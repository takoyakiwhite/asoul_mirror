const SITE = "https://ddys.app";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const PLAY_HEADERS = { "User-Agent": UA, "Referer": SITE + "/", "Origin": SITE };
const GATE_PASSWORD = "ddys";
const STORE_COOKIE = "ddys_protect_cookie";
const STORE_EXPIRES = "ddys_protect_expires";
const STORE_SESSION_OK = "ddys_protect_session_ok";
const STORE_VISION_KEY = "ddys_vision_api_key";
const STORE_VISION_BASE = "ddys_vision_api_base";
const STORE_ALIAS_PREFIX = "ddys_tmdb_alias_";
const STORE_MATCH_PREFIX = "ddys_title_match_";
const COOKIE_SKEW_MS = 6 * 3600 * 1000;
const SESSION_TTL_MS = 6 * 3600 * 1000;
const META_CACHE_MS = 30 * 86400 * 1000;
const DEFAULT_VISION_BASE = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_VISION_MODEL = "gemini-3.1-flash-lite";

var WidgetMetadata = {
  id: "https://ddys.app?mod=resource&v=140",
  title: "低调影视播放源",
  description: "低调影视播放源；Cookie 自动过门禁续期，无需手抓；视觉匹配+归一化坐标+原生Gemini API，兼容多模型",
  author: "TG@ZenMoFiShi",
  site: "https://t.me/Nzmgs",
  version: "1.4.0",
  requiredVersion: "0.0.1",
  globalParams: [
    {
      name: "visionApiKey",
      title: "视觉 API Key（一次性）",
      type: "input",
      description: "OpenAI 兼容多模态 Key，只填一次。用于自动点选验证码续 Cookie，之后不用再抓 CK。",
      value: ""
    },
    {
      name: "visionApiBase",
      title: "视觉 API Base",
      type: "input",
      description: "OpenAI 兼容 Base，默认 Google AI Studio；可填根地址或已带 /v1|/v1beta 的地址；已含版本号时不会再拼",
      value: DEFAULT_VISION_BASE
    },
    {
      name: "visionModel",
      title: "视觉模型",
      type: "input",
      description: "默认 gemini-3.1-flash-lite（Google AI Studio 免费可用）",
      value: DEFAULT_VISION_MODEL
    }
  ],
  modules: [
    {
      id: "loadResource",
      title: "低调影视播放源",
      description: "低调影视搜索与播放源返回",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 0,
      params: []
    }
  ]
};

function toInt(v, d) {
  const n = parseInt(v, 10);
  return isNaN(n) ? (d || 0) : n;
}

function storageGet(key) {
  try {
    if (Widget.storage && Widget.storage.get) return Widget.storage.get(key);
  } catch (e) {}
  return null;
}

function storageSet(key, value) {
  try {
    if (Widget.storage && Widget.storage.set) Widget.storage.set(key, value);
  } catch (e) {}
}

function storageRemove(key) {
  try {
    if (Widget.storage && Widget.storage.remove) Widget.storage.remove(key);
  } catch (e) {}
}

function readJsonCache(key, ttl) {
  try {
    const raw = storageGet(key);
    if (!raw) return null;
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!data || !data.savedAt || Date.now() - data.savedAt > ttl) return null;
    return data.value;
  } catch (e) {
    return null;
  }
}

function writeJsonCache(key, value) {
  storageSet(key, JSON.stringify({ savedAt: Date.now(), value: value }));
}

function normalizeCookie(raw) {
  let s = String(raw || "").trim();
  if (!s) return "";
  s = s.replace(/^cookie\s*:\s*/i, "").trim();
  const m = s.match(/(ddys_protect_[a-f0-9]{8,}\s*=\s*[^;\s]+)/i);
  if (m) return m[1].replace(/\s+/g, "");
  if (/^ddys_protect_/i.test(s) && s.indexOf("=") > 0) return s.split(";")[0].trim();
  return s;
}

function parseCookieExpiry(cookie) {
  const ck = normalizeCookie(cookie);
  if (!ck) return 0;
  const val = ck.split("=").slice(1).join("=");
  if (!val) return 0;
  let decoded = val;
  try { decoded = decodeURIComponent(val); } catch (e) {}
  const parts = decoded.split("|");
  if (parts.length >= 4) {
    const ts = parseInt(parts[3], 10);
    if (ts > 1000000000) return ts * 1000;
  }
  return 0;
}

function saveCookie(cookie) {
  const ck = normalizeCookie(cookie);
  if (!ck) return false;
  const exp = parseCookieExpiry(ck) || (Date.now() + 7 * 86400 * 1000);
  storageSet(STORE_COOKIE, ck);
  storageSet(STORE_EXPIRES, String(exp));
  storageSet(STORE_SESSION_OK, String(Date.now() + Math.min(SESSION_TTL_MS, exp - Date.now())));
  return true;
}

function markSessionOk(ms) {
  storageSet(STORE_SESSION_OK, String(Date.now() + (ms || SESSION_TTL_MS)));
}

function sessionOk() {
  const exp = toInt(storageGet(STORE_SESSION_OK), 0);
  return !!(exp && Date.now() < exp);
}

function clearAuth() {
  storageRemove(STORE_COOKIE);
  storageRemove(STORE_EXPIRES);
  storageRemove(STORE_SESSION_OK);
}

function loadStoredCookie() {
  const ck = normalizeCookie(storageGet(STORE_COOKIE) || "");
  if (!ck) return "";
  const exp = toInt(storageGet(STORE_EXPIRES), parseCookieExpiry(ck));
  if (exp && Date.now() > exp - COOKIE_SKEW_MS) {
    storageRemove(STORE_COOKIE);
    storageRemove(STORE_EXPIRES);
    return "";
  }
  return ck;
}

function resolveVisionConfig(params) {
  let key = String((params && params.visionApiKey) || "").trim();
  let base = String((params && params.visionApiBase) || "").trim();
  let model = String((params && params.visionModel) || "").trim();
  if (key) storageSet(STORE_VISION_KEY, key);
  else key = String(storageGet(STORE_VISION_KEY) || "").trim();
  if (base) storageSet(STORE_VISION_BASE, base);
  else base = String(storageGet(STORE_VISION_BASE) || DEFAULT_VISION_BASE).trim();
  if (!base) base = DEFAULT_VISION_BASE;
  if (!model) model = DEFAULT_VISION_MODEL;
  return { key: key, base: base.replace(/\/+$/, ""), model: model };
}

function calibrateCoordinates(points, maxW, maxH) {
  if (!points || points.length < 3) return points;
  var xs = points.map(function(p) { return p.x; });
  var ys = points.map(function(p) { return p.y; });
  var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
  var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
  if (maxX <= maxW && maxY <= maxH && minX >= 0 && minY >= 0) return points;
  var rangeX = maxX - minX || 1;
  var rangeY = maxY - minY || 1;
  var pad = 0.1;
  var tMinX = maxW * pad, tMaxX = maxW * (1 - pad);
  var tMinY = maxH * pad, tMaxY = maxH * (1 - pad);
  var tRangeX = tMaxX - tMinX, tRangeY = tMaxY - tMinY;
  return points.map(function(p) {
    return {
      x: Math.round(tMinX + ((p.x - minX) / rangeX) * tRangeX),
      y: Math.round(tMinY + ((p.y - minY) / rangeY) * tRangeY)
    };
  });
}

function buildVisionChatEndpoint(base) {
  var b = String(base || "").replace(/\/+$/, "");
  if (!b) return "/v1/chat/completions";
  if (/\/chat\/completions$/i.test(b)) return b;
  if (/generativelanguage\.googleapis\.com/i.test(b)) {
    if (/\/openai$/i.test(b)) return b + "/chat/completions";
    if (/\/v\d+$/i.test(b)) return b + "/openai/chat/completions";
    return b + "/openai/chat/completions";
  }
  if (/\/v\d+$/i.test(b)) return b + "/chat/completions";
  return b + "/v1/chat/completions";
}

function buildHeaders(cookie, extra) {
  const h = { "User-Agent": UA, "Referer": SITE + "/", "Origin": SITE };
  const ck = normalizeCookie(cookie);
  if (ck) h["Cookie"] = ck;
  return Object.assign(h, extra || {});
}

function pickHeader(headers, name) {
  if (!headers) return null;
  const want = String(name).toLowerCase();
  if (Array.isArray(headers)) return null;
  for (const k of Object.keys(headers)) {
    if (String(k).toLowerCase() === want) return headers[k];
  }
  return null;
}

function extractProtectCookie(res) {
  if (!res) return "";
  if (res.cookies) {
    if (typeof res.cookies === "string" && /ddys_protect_/i.test(res.cookies)) {
      return normalizeCookie(res.cookies);
    }
    if (Array.isArray(res.cookies)) {
      for (const item of res.cookies) {
        const s = typeof item === "string" ? item : (item && (item.name + "=" + item.value));
        const m = String(s || "").match(/(ddys_protect_[a-f0-9]+=[^;]+)/i);
        if (m) return normalizeCookie(m[1]);
      }
    } else if (typeof res.cookies === "object") {
      for (const k of Object.keys(res.cookies)) {
        if (/^ddys_protect_/i.test(k)) return normalizeCookie(k + "=" + res.cookies[k]);
      }
    }
  }
  const headers = res.headers || res.header || {};
  let sc = pickHeader(headers, "set-cookie");
  if (!sc && res.rawHeaders) sc = pickHeader(res.rawHeaders, "set-cookie");
  if (!sc) return "";
  const arr = Array.isArray(sc) ? sc : String(sc).split(/,(?=[^;]+?=)/);
  for (const item of arr) {
    const m = String(item).match(/(ddys_protect_[a-f0-9]+=[^;]+)/i);
    if (m) return normalizeCookie(m[1]);
  }
  return "";
}

function bytesToHex(buf) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < u8.length; i++) s += u8[i].toString(16).padStart(2, "0");
  return s;
}

function sha256HexPure(str) {
  function rotr(n, x) { return (x >>> n) | (x << (32 - n)); }
  function ch(x, y, z) { return (x & y) ^ (~x & z); }
  function maj(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); }
  function bsig0(x) { return rotr(2, x) ^ rotr(13, x) ^ rotr(22, x); }
  function bsig1(x) { return rotr(6, x) ^ rotr(11, x) ^ rotr(25, x); }
  function ssig0(x) { return rotr(7, x) ^ rotr(18, x) ^ (x >>> 3); }
  function ssig1(x) { return rotr(17, x) ^ rotr(19, x) ^ (x >>> 10); }
  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ];
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c < 0x80) bytes.push(c);
    else if (c < 0x800) bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    else bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
  }
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while ((bytes.length % 64) !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i--) bytes.push((Math.floor(bitLen / Math.pow(2, i * 8))) & 0xff);
  let H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const w = new Array(64);
  for (let i = 0; i < bytes.length; i += 64) {
    for (let t = 0; t < 16; t++) {
      w[t] = ((bytes[i + t * 4] << 24) | (bytes[i + t * 4 + 1] << 16) | (bytes[i + t * 4 + 2] << 8) | bytes[i + t * 4 + 3]) >>> 0;
    }
    for (let t = 16; t < 64; t++) w[t] = (ssig1(w[t - 2]) + w[t - 7] + ssig0(w[t - 15]) + w[t - 16]) >>> 0;
    let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
    for (let t = 0; t < 64; t++) {
      const t1 = (h + bsig1(e) + ch(e, f, g) + K[t] + w[t]) >>> 0;
      const t2 = (bsig0(a) + maj(a, b, c)) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    H = H.map((x, idx) => (x + [a, b, c, d, e, f, g, h][idx]) >>> 0);
  }
  return H.map(x => ("00000000" + x.toString(16)).slice(-8)).join("");
}

async function solveAltcha(challenge) {
  const salt = String(challenge.salt || "");
  const target = String(challenge.challenge || "");
  const maxNumber = toInt(challenge.maxNumber, 500000);
  const t0 = Date.now();
  // 分片计算：每批让出事件循环，避免 Forward 卡死/超时
  const batch = 2500;
  for (let start = 0; start <= maxNumber; start += batch) {
    const end = Math.min(maxNumber, start + batch - 1);
    for (let i = start; i <= end; i++) {
      if (sha256HexPure(salt + i) === target) {
        return {
          algorithm: challenge.algorithm || "SHA-256",
          challenge: target,
          number: i,
          salt: salt,
          signature: challenge.signature,
          took: Date.now() - t0
        };
      }
    }
    await Promise.resolve();
  }
  throw new Error("ALTCHA POW 无解 max=" + maxNumber + " took=" + (Date.now() - t0));
}

function utf8ToBytes(str) {
  const s = String(str || "");
  const out = [];
  for (let i = 0; i < s.length; i++) {
    let c = s.charCodeAt(i);
    if (c < 0x80) out.push(c);
    else if (c < 0x800) {
      out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    } else if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) {
      const c2 = s.charCodeAt(++i);
      const u = 0x10000 + (((c & 0x3ff) << 10) | (c2 & 0x3ff));
      out.push(
        0xf0 | (u >> 18),
        0x80 | ((u >> 12) & 0x3f),
        0x80 | ((u >> 6) & 0x3f),
        0x80 | (u & 0x3f)
      );
    } else {
      out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    }
  }
  return out;
}

function b64EncodeUtf8(str) {
  const bytes = utf8ToBytes(str);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const triple = (a << 16) | (b << 8) | c;
    out += chars[(triple >> 18) & 63];
    out += chars[(triple >> 12) & 63];
    out += i + 1 < bytes.length ? chars[(triple >> 6) & 63] : "=";
    out += i + 2 < bytes.length ? chars[triple & 63] : "=";
  }
  return out;
}

function extractDataUrls(html) {
  const text = String(html || "");
  let urls = text.match(/data:image\/(?:png|jpeg|jpg);base64,[A-Za-z0-9+/=]+/gi) || [];
  // 兼容被截断/转义的 base64
  if (urls.length < 2) {
    const loose = text.match(/data:image\\\/(?:png|jpeg|jpg);base64,[A-Za-z0-9+/=]+/gi) || [];
    urls = loose.map(u => u.replace("\\/", "/"));
  }
  if (urls.length < 2) return null;
  let stage = urls[0];
  for (const u of urls) if (u.length > stage.length) stage = u;
  let prompt = "";
  for (const u of urls) {
    if (u === stage) continue;
    if (u.length > prompt.length) prompt = u;
  }
  if (!prompt) return null;
  return { prompt: prompt, stage: stage };
}

function formField(html, name) {
  const re1 = new RegExp('name="' + name + '"[^>]*value="([^"]*)"', "i");
  const re2 = new RegExp('value="([^"]*)"[^>]*name="' + name + '"', "i");
  let m = String(html).match(re1);
  if (m) return m[1];
  m = String(html).match(re2);
  return m ? m[1] : "";
}

function parseMaybeJson(data) {
  if (data == null) return null;
  if (typeof data === "object") return data;
  const s = String(data).trim();
  if (!s) return null;
  try { return JSON.parse(s); } catch (e) {}
  // 有时被包在 HTML/文本里
  const m = s.match(/\{[\s\S]*\}/);
  if (m) {
    try { return JSON.parse(m[0]); } catch (e2) {}
  }
  return null;
}

async function refreshCaptchaHtml(html) {
  const ajaxNonce = (String(html).match(/"nonce"\s*:\s*"([^"]+)"/) || [])[1] || "";
  const token = formField(html, "ddys_protect_captcha_token");
  if (!ajaxNonce) return null;
  const body = encodeForm({
    action: "ddys_protect_refresh_captcha",
    nonce: ajaxNonce,
    context: "gate",
    token: token || ""
  });
  const res = await rawPost(SITE + "/wp-admin/admin-ajax.php", body, "", {
    "X-Requested-With": "XMLHttpRequest",
    "Referer": SITE + "/category/movie/"
  });
  const payload = parseMaybeJson(res && res.data);
  if (payload && payload.success && payload.data && payload.data.html) {
    return String(payload.data.html);
  }
  // 直接字符串 html
  const raw = String((res && res.data) || "");
  if (/data:image\/(?:png|jpeg)/i.test(raw)) return raw;
  return null;
}

async function loadCaptchaBundle(html) {
  let imgs = extractDataUrls(html);
  let captchaHtml = html;
  let token = formField(html, "ddys_protect_captcha_token");
  if (!imgs) {
    const refreshed = await refreshCaptchaHtml(html);
    if (refreshed) {
      captchaHtml = refreshed;
      imgs = extractDataUrls(refreshed);
      const t2 = formField(refreshed, "ddys_protect_captcha_token");
      if (t2) token = t2;
    }
  }
  if (!imgs) {
    // 最后再试一次无旧 token 的刷新
    const refreshed2 = await refreshCaptchaHtml(html.replace(/name="ddys_protect_captcha_token"[^>]*>/, 'name="ddys_protect_captcha_token" value="">'));
    if (refreshed2) {
      captchaHtml = refreshed2;
      imgs = extractDataUrls(refreshed2);
      const t3 = formField(refreshed2, "ddys_protect_captcha_token");
      if (t3) token = t3;
    }
  }
  if (!imgs) return null;
  return { imgs: imgs, captchaHtml: captchaHtml, token: token };
}

async function rawGet(url, cookie, extra) {
  let lastErr;
  for (let t = 0; t < 3; t++) {
    try {
      return await Widget.http.get(url, { headers: buildHeaders(cookie, extra) });
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("http fail: " + url);
}

async function rawPost(url, body, cookie, extra) {
  return await Widget.http.post(url, body, {
    headers: buildHeaders(cookie, Object.assign({
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }, extra || {}))
  });
}

function extractBase64FromDataUrl(dataUrl) {
  var m = String(dataUrl || "").match(/^data:[^;]+;base64,(.+)$/);
  return m ? m[1] : "";
}

function extractMimeFromDataUrl(dataUrl) {
  var m = String(dataUrl || "").match(/^data:([^;]+);/);
  return m ? m[1] : "image/png";
}

async function visionClickPointsNative(vision, promptDataUrl, stageDataUrl) {
  var promptB64 = extractBase64FromDataUrl(promptDataUrl);
  var stageB64 = extractBase64FromDataUrl(stageDataUrl);
  var promptMime = extractMimeFromDataUrl(promptDataUrl);
  var stageMime = extractMimeFromDataUrl(stageDataUrl);
  if (!promptB64 || !stageB64) throw new Error("无法提取 base64 图片数据");

  var b = String(vision.base || "").replace(/\/+$/, "");
  var model = vision.model || DEFAULT_VISION_MODEL;
  // 从 base 中提取版本路径 (如 /v1beta)
  var verMatch = b.match(/\/(v\d+[^\/]*)$/);
  var verPath = verMatch ? verMatch[1] : "v1beta";
  var url = "https://generativelanguage.googleapis.com/" + verPath + "/models/" + model + ":generateContent?key=" + vision.key;

  var payload = {
    contents: [{
      parts: [
        { text: '点选验证码。图1有3个目标图案(左到右)，图2有5个图案(上3下2)。比较图1每个图案的形状，在图2中找形状相同的3个，给归一化坐标(0~1，左上0,0，右下1,1)。不要识别文字，直接比形状。只输出JSON数组：[{"x":0.17,"y":0.25},{"x":0.5,"y":0.25},{"x":0.33,"y":0.75}]' },
        { inline_data: { mime_type: promptMime, data: promptB64 } },
        { inline_data: { mime_type: stageMime, data: stageB64 } },
      ]
    }],
    generationConfig: { temperature: 0, maxOutputTokens: 200 }
  };

  var res = await Widget.http.post(url, payload, {
    headers: { "Content-Type": "application/json", "User-Agent": UA }
  });
  var data = res && res.data;
  var text = "";
  if (typeof data === "string") text = data;
  else if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
    var parts = data.candidates[0].content.parts || [];
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].text) { text += parts[i].text; }
    }
  } else {
    text = JSON.stringify(data || {});
  }
  var m = String(text).match(/\[[\s\S]*?\]/);
  if (!m) throw new Error("视觉接口未返回坐标");
  var arr = JSON.parse(m[0]);
  if (!Array.isArray(arr) || arr.length < 3) throw new Error("坐标数量不足");
  return arr.slice(0, 3).map(function(p) {
    var px = Number(p.x), py = Number(p.y);
    if (px >= 0 && px <= 1 && py >= 0 && py <= 1) {
      return { x: Math.round(px * 320), y: Math.round(py * 150) };
    }
    return { x: Math.round(px), y: Math.round(py) };
  });
}

async function visionClickPoints(vision, promptDataUrl, stageDataUrl) {
  if (!vision.key) {
    throw new Error("首次使用请在模块参数填写「视觉 API Key」（一次性）。之后 Cookie 会自动续，不用再手抓。");
  }
  // Google AI Studio：优先使用原生 API（更稳定，视觉匹配更准）
  if (/generativelanguage\.googleapis\.com/i.test(vision.base || "")) {
    return await visionClickPointsNative(vision, promptDataUrl, stageDataUrl);
  }
  // 其他 OpenAI 兼容 API
  var endpoint = buildVisionChatEndpoint(vision.base);
  var content = [
    {
      type: "text",
      text: '点选验证码。图1有3个目标图案(左到右)，图2有5个图案(上3下2)。比较图1每个图案的形状，在图2中找形状相同的3个，给归一化坐标(0~1，左上0,0，右下1,1)。不要识别文字，直接比形状。只输出JSON数组：[{"x":0.17,"y":0.25},{"x":0.5,"y":0.25},{"x":0.33,"y":0.75}]'
    },
    { type: "image_url", image_url: { url: promptDataUrl } },
    { type: "image_url", image_url: { url: stageDataUrl } }
  ];
  var payload = {
    model: vision.model || DEFAULT_VISION_MODEL,
    messages: [{ role: "user", content: content }],
    temperature: 0,
    max_tokens: 1024
  };
  var reqHeaders = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + vision.key,
    "User-Agent": UA
  };
  var res = await Widget.http.post(endpoint, payload, { headers: reqHeaders });
  var data = res && res.data;
  var text = "";
  if (typeof data === "string") text = data;
  else if (data && data.choices && data.choices[0] && data.choices[0].message) {
    var msg = data.choices[0].message;
    text = msg.content || "";
    // 兼容 reasoning 模型（如 minimax-m3）：content 为空时从 reasoning 提取
    if (!text && msg.reasoning) text = msg.reasoning;
  } else {
    text = JSON.stringify(data || {});
  }
  var m = String(text).match(/\[[\s\S]*?\]/);
  if (!m) throw new Error("视觉接口未返回坐标");
  var arr = JSON.parse(m[0]);
  if (!Array.isArray(arr) || arr.length < 3) throw new Error("坐标数量不足");
  return arr.slice(0, 3).map(function(p) {
    var px = Number(p.x), py = Number(p.y);
    if (px >= 0 && px <= 1 && py >= 0 && py <= 1) {
      return { x: Math.round(px * 320), y: Math.round(py * 150) };
    }
    var pt = { x: Math.round(px), y: Math.round(py) };
    var cal = calibrateCoordinates([pt], 320, 150);
    return cal[0];
  });
}

function encodeForm(obj) {
  return Object.keys(obj).map(k => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k] == null ? "" : obj[k])).join("&");
}

async function autoRefreshCookie(params) {
  const vision = resolveVisionConfig(params);
  let lastErr = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      // 1) 门禁页：拿 form 字段；图片不依赖整页（Forward 常截断大 base64）
      const pageRes = await rawGet(SITE + "/category/movie/", "", null);
      const html = String((pageRes && pageRes.data) || "");
      if (!/ddys-protect-panel/.test(html) && html.length > 500) {
        const maybe = extractProtectCookie(pageRes) || loadStoredCookie();
        if (maybe) {
          saveCookie(maybe);
          return maybe;
        }
        // Forward 常读不到 Set-Cookie，但运行时 cookie jar 已放行：直接记会话并继续
        const probe0 = await rawGet(SITE + "/?s=" + encodeURIComponent("test"), "", null);
        const ck0 = extractProtectCookie(probe0);
        if (ck0) {
          saveCookie(ck0);
          return ck0;
        }
        const probeHtml0 = String((probe0 && probe0.data) || "");
        if (!/ddys-protect-panel/.test(probeHtml0) && probeHtml0.length > 200) {
          markSessionOk(SESSION_TTL_MS);
          console.log("[ddys] site already open, continue with session jar");
          return "";
        }
        if (!/ddys-protect-panel/.test(html)) {
          markSessionOk(SESSION_TTL_MS);
          console.log("[ddys] category open without cookie header");
          return "";
        }
      }
      if (/尝试次数过多/.test(html)) throw new Error("门禁尝试过多，请稍后再试");

      const formNonce = formField(html, "ddys_protect_nonce");
      const started = formField(html, "ddys_protect_started");
      const startedSig = formField(html, "ddys_protect_started_sig");
      if (!formNonce) throw new Error("门禁页缺少 nonce，html=" + html.length);

      // 2) 始终 ajax 拉验证码小段（避免整页截断）
      let captcha = await loadCaptchaBundle(html);
      if (!captcha || !captcha.imgs) {
        // 再强制刷一次
        const refreshed = await refreshCaptchaHtml(html);
        if (refreshed) {
          captcha = {
            imgs: extractDataUrls(refreshed),
            captchaHtml: refreshed,
            token: formField(refreshed, "ddys_protect_captcha_token")
          };
        }
      }
      if (!captcha || !captcha.imgs) {
        throw new Error("无法获取验证码图(html=" + html.length + ",ajaxNonce=" + !!((html.match(/\"nonce\"\\s*:\\s*\"([^\"]+)\"/) || [])[1]) + ")");
      }

      // 3) 视觉点选 || challenge+POW 并行
      const pointsPromise = visionClickPoints(vision, captcha.imgs.prompt, captcha.imgs.stage);
      const chRes = await rawGet(SITE + "/wp-json/ddys-protect/v1/gatecha/challenge", "", null);
      const challenge = parseMaybeJson(chRes && chRes.data) || (chRes && chRes.data);
      if (!challenge || !challenge.challenge) throw new Error("获取 ALTCHA challenge 失败");
      // 先等视觉，再算 POW（避免两者抢时间导致 Forward 20s 超时）
      const points = await pointsPromise;
      if (!points || points.length < 3) throw new Error("点选坐标无效");
      const pow = await solveAltcha(challenge);

      const form = {
        ddys_protect_password: GATE_PASSWORD,
        ddys_protect_altcha_gate: b64EncodeUtf8(JSON.stringify(pow)),
        ddys_protect_company: "",
        ddys_protect_started: started,
        ddys_protect_started_sig: startedSig,
        ddys_protect_click_points: JSON.stringify(points),
        ddys_protect_captcha_token: captcha.token || formField(html, "ddys_protect_captcha_token"),
        ddys_protect_action: "gate_login",
        redirect_to: SITE + "/category/movie/",
        ddys_protect_nonce: formNonce,
        _wp_http_referer: "/category/movie/"
      };
      const loginRes = await rawPost(SITE + "/category/movie/", encodeForm(form), "", null);
      const loginHtml = String((loginRes && loginRes.data) || "");
      let ck = extractProtectCookie(loginRes);

      if (!ck) {
        // 很多 Forward 版本读不到 Set-Cookie，但运行时有 cookie jar
        const probe = await rawGet(SITE + "/?s=" + encodeURIComponent("test"), "", null);
        ck = extractProtectCookie(probe);
        const probeHtml = String((probe && probe.data) || "");
        if (!ck && !/ddys-protect-panel/.test(probeHtml) && probeHtml.length > 200) {
          markSessionOk(SESSION_TTL_MS);
          console.log("[ddys] gate ok without readable Set-Cookie, use session jar");
          return "";
        }
        if (!ck && !/ddys-protect-panel/.test(loginHtml) && loginHtml.length > 200) {
          markSessionOk(SESSION_TTL_MS);
          console.log("[ddys] login html open without cookie header");
          return "";
        }
      }

      if (!ck) {
        const err = (loginHtml.match(/class="ddys-protect-(?:error|warning)"[^>]*>([\s\S]*?)</) || [])[1] || "";
        throw new Error((err.replace(/\s+/g, " ").trim() || "自动过门禁失败") + " #" + (attempt + 1) + " pow=" + pow.took + "ms");
      }
      saveCookie(ck);
      return ck;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("自动续 Cookie 失败");
}

async function ensureAuth(params) {
  const ck = loadStoredCookie();
  if (ck) return ck;
  if (sessionOk()) return ""; // Forward 可能自动维护 cookie jar
  return await autoRefreshCookie(params);
}

async function httpGetAuthed(url, params) {
  let ck = await ensureAuth(params);
  let res = await rawGet(url, ck, null);
  let html = String((res && res.data) || "");
  if (/ddys-protect-panel/.test(html)) {
    clearAuth();
    ck = await autoRefreshCookie(params);
    res = await rawGet(url, ck, null);
    html = String((res && res.data) || "");
    if (/ddys-protect-panel/.test(html)) {
      throw new Error("自动续 Cookie 后仍被门禁拦截");
    }
  }
  // 成功访问时延长会话标记
  if (!/ddys-protect-panel/.test(html)) markSessionOk(SESSION_TTL_MS);
  return res;
}

function normalizeName(text) {
  return String(text || "")
    .replace(/\s+/g, "")
    .replace(/[：:·・,，.。!！?？\-—_'’"“”()（）\[\]【】]/g, "")
    .toLowerCase();
}

function stripTitleMeta(text) {
  return String(text || "")
    .replace(/[\(（][^\)）]*[\)）]/g, "")
    .replace(/第[0-9一二三四五六七八九十]+季/g, "")
    .replace(/season\s*\d+/ig, "")
    .replace(/\bs\d{1,2}\b/ig, "")
    .trim();
}

const CN_NUM = { "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9, "十": 10 };
function cnToNum(s) {
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  if (s === "十") return 10;
  if (s.length === 2 && s[0] === "十") return 10 + (CN_NUM[s[1]] || 0);
  if (s.length === 2 && s[1] === "十") return (CN_NUM[s[0]] || 0) * 10;
  return CN_NUM[s] || 0;
}

function extractSeasonFromText(text) {
  const t = String(text || "");
  let m = t.match(/第\s*([0-9一二三四五六七八九十]+)\s*季/);
  if (m) return cnToNum(m[1]);
  m = t.match(/season\s*(\d+)/i);
  if (m) return parseInt(m[1], 10);
  m = t.match(/\bs(\d{1,2})\b/i);
  if (m) return parseInt(m[1], 10);
  return null;
}

function htmlDecode(text) {
  return String(text || "")
    .replace(/&#(\d+);/g, function(_, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9a-f]+);/gi, function(_, n) { return String.fromCharCode(parseInt(n, 16)); })
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function uniqueTitles(values) {
  const out = [];
  const seen = {};
  for (const value of values || []) {
    const title = htmlDecode(String(value || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    const norm = normalizeName(stripTitleMeta(title));
    if (!title || !norm || seen[norm]) continue;
    seen[norm] = true;
    out.push(title);
  }
  return out;
}

function parseTmdbSearchResults(html, mediaType) {
  const out = [];
  const re = /href=["']\/(tv|movie)\/(\d+)(?:[^"']*)?["']/gi;
  let m;
  while ((m = re.exec(String(html || "")))) {
    if (mediaType && m[1] !== mediaType) continue;
    const key = m[1] + ":" + m[2];
    if (!out.some(x => x.key === key)) out.push({ key: key, type: m[1], id: m[2] });
  }
  return out;
}

async function loadTmdbAliases(tmdbId, mediaType) {
  const id = String(tmdbId || "").match(/\d+/);
  if (!id) return [];
  const kind = mediaType === "movie" ? "movie" : "tv";
  const key = STORE_ALIAS_PREFIX + kind + "_" + id[0];
  const cached = readJsonCache(key, META_CACHE_MS);
  if (cached) return cached;
  try {
    const res = await rawGet("https://www.themoviedb.org/" + kind + "/" + id[0] + "/titles?language=zh-CN", "", {
      "Referer": "https://www.themoviedb.org/",
      "Origin": "https://www.themoviedb.org"
    });
    const html = String((res && res.data) || "");
    const titles = [];
    const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
    if (og) titles.push(og[1]);
    const td = /<td(?:\s[^>]*)?>([\s\S]*?)<\/td>/gi;
    let m;
    while ((m = td.exec(html))) titles.push(m[1]);
    const result = uniqueTitles(titles);
    if (result.length) writeJsonCache(key, result);
    return result;
  } catch (e) {
    console.log("[ddys] tmdb alias fetch failed: " + (e.message || e));
    return [];
  }
}

async function searchTmdbCandidates(title, mediaType) {
  const query = String(title || "").trim();
  if (!query) return [];
  try {
    const res = await rawGet("https://www.themoviedb.org/search?query=" + encodeURIComponent(query) + "&language=zh-CN", "", {
      "Referer": "https://www.themoviedb.org/",
      "Origin": "https://www.themoviedb.org"
    });
    return parseTmdbSearchResults((res && res.data) || "", mediaType === "movie" ? "movie" : "tv").slice(0, 3);
  } catch (e) {
    return [];
  }
}

async function buildAliasQueries(params, baseTitle, rawSeries) {
  const titles = [baseTitle, rawSeries];
  const mediaType = String((params && params.type) || "") === "movie" ? "movie" : "tv";
  const tmdbId = params && params.tmdbId;
  if (tmdbId) {
    const aliases = await loadTmdbAliases(tmdbId, mediaType);
    titles.push.apply(titles, aliases);
  } else if (Widget.tmdb && Widget.tmdb.get) {
    const seeds = uniqueTitles([baseTitle, rawSeries]);
    for (const seed of seeds.slice(0, 2)) {
      const candidates = await searchTmdbCandidates(seed, mediaType);
      if (candidates.length !== 1) continue;
      const aliases = await loadTmdbAliases(candidates[0].id, candidates[0].type);
      titles.push.apply(titles, aliases);
    }
  }
  return uniqueTitles(titles);
}

function parseDetailAliases(html) {
  const m = String(html || "").match(/又名\s*[:：]\s*([\s\S]*?)(?:<br\s*\/?>|导演\s*[:：]|演员\s*[:：]|类型\s*[:：]|年份\s*[:：])/i);
  if (!m) return [];
  return uniqueTitles(m[1].split(/\s*\/\s*/));
}

function titleMatchesAny(title, wantedTitles) {
  const norm = normalizeName(stripTitleMeta(title));
  if (!norm) return false;
  for (const wanted of wantedTitles || []) {
    const want = normalizeName(stripTitleMeta(wanted));
    if (!want) continue;
    if (norm === want || norm.indexOf(want) >= 0 || want.indexOf(norm) >= 0) return true;
  }
  return false;
}

function parseSearchResults(html) {
  const out = [];
  const re = /<h2 class="post-title"><a href="(https:\/\/ddys\.app\/[a-z0-9-]+\/)"[^>]*rel="bookmark">([^<]+)<\/a>/g;
  let m;
  while ((m = re.exec(html))) out.push({ url: m[1], rawTitle: m[2].trim() });
  return out;
}

async function searchSite(keyword, params) {
  const res = await httpGetAuthed(SITE + "/?s=" + encodeURIComponent(keyword), params);
  return parseSearchResults((res && res.data) || "");
}

function buildSearchQueries(baseTitle, rawSeries) {
  const out = [];
  function add(value) {
    const q = String(value || "").replace(/\s+/g, " ").trim();
    if (q && out.indexOf(q) < 0) out.push(q);
  }
  [baseTitle, rawSeries].forEach(title => {
    const raw = String(title || "").trim();
    if (!raw) return;
    add(raw);
    const spaced = raw
      .replace(/[：:·・,，.。!！?？\-—_'’"“”()（）\[\]【】\/\\]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    add(spaced);
    add(spaced.replace(/\s+/g, ""));
    const parts = raw
      .split(/[：:·・,，.。!！?？\-—_'’"“”()（）\[\]【】\/\\\s]+/)
      .map(s => s.trim())
      .filter(s => s.length >= 2)
      .sort((a, b) => b.length - a.length);
    parts.forEach(add);
  });
  return out.slice(0, 6);
}

function parsePlaylist(html) {
  const i = String(html || "").indexOf('"playlistType"');
  if (i < 0) return null;
  const s = html.lastIndexOf("{", i);
  if (s < 0) return null;
  let depth = 0, end = -1;
  for (let k = s; k < html.length; k++) {
    const c = html[k];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) { end = k + 1; break; }
    }
  }
  if (end < 0) return null;
  try { return JSON.parse(html.slice(s, end)); } catch (e) { return null; }
}

function extractDoubanId(html) {
  const m = String(html || "").match(/movie\.douban\.com\/subject\/(\d+)/i);
  return m ? m[1] : "";
}

function matchCacheKey(params, title) {
  const id = String((params && (params.tmdbId || params.imdbId || params.id)) || "").trim();
  return STORE_MATCH_PREFIX + normalizeName(id || title);
}

async function loadDetailData(detailUrl, params) {
  const res = await httpGetAuthed(detailUrl, params);
  const html = String((res && res.data) || "");
  return {
    playlist: parsePlaylist(html),
    aliases: parseDetailAliases(html),
    doubanId: extractDoubanId(html),
    html: html
  };
}

async function loadPlaylist(detailUrl, params) {
  const data = await loadDetailData(detailUrl, params);
  return data.playlist;
}

function scoreResult(item, wantedTitles) {
  const baseNorm = normalizeName(stripTitleMeta(item.rawTitle));
  let best = -1;
  for (const wanted of wantedTitles || []) {
    const wantBaseNorm = normalizeName(stripTitleMeta(wanted));
    if (!wantBaseNorm) continue;
    if (baseNorm === wantBaseNorm) best = Math.max(best, 320);
    else if (baseNorm.indexOf(wantBaseNorm) >= 0 || wantBaseNorm.indexOf(baseNorm) >= 0) best = Math.max(best, 160);
  }
  return best;
}

function pickBestResult(results, wantedTitles) {
  let best = null, bestScore = -Infinity;
  for (const it of results) {
    const sc = scoreResult(it, wantedTitles);
    if (sc > bestScore) { bestScore = sc; best = it; }
  }
  return bestScore >= 0 ? best : null;
}

async function pickByDetailAliases(results, wantedTitles, params) {
  for (const item of (results || []).slice(0, 5)) {
    const detail = await loadDetailData(item.url, params);
    if (!detail.playlist) continue;
    if (titleMatchesAny(item.rawTitle, wantedTitles) || detail.aliases.some(a => titleMatchesAny(a, wantedTitles))) {
      return { item: item, detail: detail };
    }
  }
  return null;
}

function pickTrack(playlist, wantSeason, wantEpisode, isMovie) {
  if (!playlist || !Array.isArray(playlist.seasons) || !playlist.seasons.length) return null;
  const seasons = playlist.seasons;
  if (isMovie) return (seasons[0] && seasons[0].tracks && seasons[0].tracks[0]) || null;
  let season = null;
  if (wantSeason > 0) {
    season = seasons.find(s => toInt(s.season, -1) === wantSeason) || null;
    if (!season) season = seasons.find(s => extractSeasonFromText(s.title) === wantSeason) || null;
  }
  if (!season) season = seasons.length === 1 ? seasons[0] : (seasons.find(s => toInt(s.season, -1) === 1) || seasons[0]);
  const tracks = (season && season.tracks) || [];
  if (!tracks.length) return null;
  if (wantEpisode > 0) {
    return tracks.find(t => toInt(t.episode, -1) === wantEpisode)
      || tracks.find(t => toInt(t.title, -1) === wantEpisode)
      || null;
  }
  return tracks[0];
}

function buildVideoUrl(track) {
  const server = String(track.server || "v3").trim();
  let src = String(track.src || "");
  if (!src) return null;
  if (!src.startsWith("/")) src = "/" + src;
  return "https://" + server + ".ddys.app" + src;
}

async function loadResource(params) {
  console.log("[ddys] widget version 1.3.0");
  resolveVisionConfig(params || {});
  const rawSeries = String(params.seriesName || params.title || "").trim();
  const rawEpisodeName = String(params.episodeName || "").trim();
  const isMovie = String(params.type || "") === "movie";
  const wantSeason = toInt(params.season, 0);
  const wantEpisode = toInt(params.episode, 0);
  const baseTitle = stripTitleMeta(rawSeries) || rawSeries || rawEpisodeName;
  if (!baseTitle) return [];

  const wantedTitles = await buildAliasQueries(params, baseTitle, rawSeries);
  let results = [];
  let hitQuery = "";
  let cachedUrl = "";
  let cachedDetail = null;
  const cachedMatch = readJsonCache(matchCacheKey(params, baseTitle), META_CACHE_MS);
  if (cachedMatch && cachedMatch.url) {
    cachedDetail = await loadDetailData(cachedMatch.url, params);
    if (cachedDetail && cachedDetail.playlist) cachedUrl = cachedMatch.url;
  }
  const searchQueries = [];
  for (const title of wantedTitles) {
    const queries = buildSearchQueries(title, title);
    for (const query of queries) {
      if (searchQueries.indexOf(query) < 0) searchQueries.push(query);
    }
  }
  for (const query of searchQueries.slice(0, 18)) {
    if (cachedUrl) break;
    results = await searchSite(query, params);
    if (results.length) {
      hitQuery = query;
      console.log("[ddys] search hit: " + query + " -> " + results.length);
      break;
    }
  }
  if (!cachedUrl && !results.length) return [];

  let best = cachedUrl ? { url: cachedUrl, rawTitle: (cachedMatch && cachedMatch.rawTitle) || baseTitle } : pickBestResult(results, wantedTitles);
  let detail = cachedDetail;
  if (best && !detail) {
    detail = await loadDetailData(best.url, params);
  } else if (!best) {
    const matched = await pickByDetailAliases(results, wantedTitles, params);
    if (matched) {
      best = matched.item;
      detail = matched.detail;
    }
  }
  if (!best || !detail || !detail.playlist) return [];
  writeJsonCache(matchCacheKey(params, baseTitle), {
    url: best.url,
    rawTitle: best.rawTitle,
    doubanId: detail.doubanId || ""
  });
  const playlist = detail.playlist;

  const track = pickTrack(playlist, wantSeason, wantEpisode, isMovie || playlist.playlistType === "movie");
  if (!track) return [];

  const url = buildVideoUrl(track);
  if (!url) return [];

  const seasonLabel = wantSeason > 0 ? ("S" + wantSeason) : "";
  const epLabel = wantEpisode > 0 ? ("E" + wantEpisode) : "";
  return [{
    name: "低调影视 " + (seasonLabel + epLabel || "正片"),
    description: [
      best.rawTitle,
      "线路：" + (track.server || "v3"),
      seasonLabel || epLabel ? ("定位：" + seasonLabel + epLabel) : ""
    ].filter(Boolean).join("\n"),
    url: url,
    customHeaders: PLAY_HEADERS,
    headers: PLAY_HEADERS
  }];
}
