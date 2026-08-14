const SITE = "https://ddys.app";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const PLAY_HEADERS = { "User-Agent": UA, "Referer": SITE + "/", "Origin": SITE };

var WidgetMetadata = {
  id: "https://ddys.app?mod=resource&v=128",
  title: "低调影视播放源",
  description: "低调影视播放源；Cookie 由用户手动输入",
  author: "TG@ZenMoFiShi",
  site: "https://t.me/Nzmgs",
  version: "1.2.8",
  requiredVersion: "0.0.1",
  globalParams: [
    {
      name: "cookie",
      title: "ddys_protect Cookie",
      type: "input",
      description: "在浏览器访问 ddys.app 并通过门禁后，复制 ddys_protect_xxx=值 整段填入。Cookie 失效后请重新获取并输入。",
      value: ""
    }
  ],
  modules: [
    {
      id: "loadResource",
      title: "低调影视播放源",
      description: "低调影视搜索与播放源返回",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 120,
      params: []
    }
  ]
};

function toInt(v, d) {
  const n = parseInt(v, 10);
  return isNaN(n) ? (d || 0) : n;
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

function buildHeaders(cookie, extra) {
  const h = { "User-Agent": UA, "Referer": SITE + "/", "Origin": SITE };
  const ck = normalizeCookie(cookie);
  if (ck) h["Cookie"] = ck;
  return Object.assign(h, extra || {});
}

function gateError() {
  throw new Error("ddys Cookie 无效或已过期，请重新获取 ddys_protect Cookie 后在模块参数中手动输入");
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

async function httpGetAuthed(url, params) {
  const cookie = normalizeCookie(params && params.cookie);
  if (!cookie) gateError();
  const res = await rawGet(url, cookie, null);
  const html = String((res && res.data) || "");
  if (/ddys-protect-panel/.test(html)) gateError();
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

function parseSearchResults(html) {
  const out = [];
  const re = /<h2 class="post-title"><a href="(https:\/\/ddys\.app\/[a-z0-9-]+\/)"[^>]*rel="bookmark">([^<]+)<\/a>/g;
  let m;
  while ((m = re.exec(String(html || "")))) {
    out.push({ url: m[1], rawTitle: m[2].trim() });
  }
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
  const text = String(html || "");
  const i = text.indexOf('"playlistType"');
  if (i < 0) return null;

  const s = text.lastIndexOf("{", i);
  if (s < 0) return null;

  let depth = 0;
  let end = -1;
  for (let k = s; k < text.length; k++) {
    const c = text[k];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        end = k + 1;
        break;
      }
    }
  }

  if (end < 0) return null;
  try {
    return JSON.parse(text.slice(s, end));
  } catch (e) {
    return null;
  }
}

async function loadPlaylist(detailUrl, params) {
  const res = await httpGetAuthed(detailUrl, params);
  return parsePlaylist((res && res.data) || "");
}

function scoreResult(item, wantBaseNorm) {
  const baseNorm = normalizeName(stripTitleMeta(item.rawTitle));
  if (baseNorm === wantBaseNorm) return 320;
  if (baseNorm.indexOf(wantBaseNorm) >= 0 || wantBaseNorm.indexOf(baseNorm) >= 0) return 160;
  return -1;
}

function pickBestResult(results, wantBaseNorm) {
  let best = null;
  let bestScore = -Infinity;
  for (const it of results) {
    const sc = scoreResult(it, wantBaseNorm);
    if (sc > bestScore) {
      bestScore = sc;
      best = it;
    }
  }
  return bestScore >= 0 ? best : null;
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

  if (!season) {
    season = seasons.length === 1
      ? seasons[0]
      : (seasons.find(s => toInt(s.season, -1) === 1) || seasons[0]);
  }

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
  console.log("[ddys] widget version 1.2.8 manual-cookie");

  const rawSeries = String(params.seriesName || params.title || "").trim();
  const rawEpisodeName = String(params.episodeName || "").trim();
  const isMovie = String(params.type || "") === "movie";
  const wantSeason = toInt(params.season, 0);
  const wantEpisode = toInt(params.episode, 0);

  const baseTitle = stripTitleMeta(rawSeries) || rawSeries || rawEpisodeName;
  if (!baseTitle) return [];

  const wantBaseNorm = normalizeName(baseTitle);
  let results = [];

  for (const query of buildSearchQueries(baseTitle, rawSeries)) {
    results = await searchSite(query, params);
    if (results.length) {
      console.log("[ddys] search hit: " + query + " -> " + results.length);
      break;
    }
  }

  if (!results.length) return [];

  const best = pickBestResult(results, wantBaseNorm);
  if (!best) return [];

  const playlist = await loadPlaylist(best.url, params);
  if (!playlist) return [];

  const track = pickTrack(
    playlist,
    wantSeason,
    wantEpisode,
    isMovie || playlist.playlistType === "movie"
  );
  if (!track) return [];

  const url = buildVideoUrl(track);
  if (!url) return [];

  const seasonLabel = wantSeason > 0 ? "S" + wantSeason : "";
  const epLabel = wantEpisode > 0 ? "E" + wantEpisode : "";

  return [{
    name: "低调影视 " + (seasonLabel + epLabel || "正片"),
    description: [
      best.rawTitle,
      "线路：" + (track.server || "v3"),
      seasonLabel || epLabel ? "定位：" + seasonLabel + epLabel : ""
    ].filter(Boolean).join("\n"),
    url: url,
    customHeaders: PLAY_HEADERS,
    headers: PLAY_HEADERS
  }];
}
