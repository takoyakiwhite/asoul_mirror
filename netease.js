const url = $request.url;
const headers = $request.headers;

if (
  !url.includes(".music.163.com/") ||
  !url.includes("/interface")
) {
  $done({});
}

// 插件参数
let Cookie = ($argument?.Cookie || "").trim();
let MConfigInfo = ($argument?.MConfigInfo || "").trim();
let UserAgent = ($argument?.UserAgent || "").trim();

const CONFIG_URL = ($argument?.ConfigURL || "").trim();
const CONFIG_UA = ($argument?.ConfigUserAgent || "").trim();

// 应用请求头
function applyConfig() {
  headers["cookie"] = Cookie;
  headers["mconfig-info"] = MConfigInfo;
  headers["user-agent"] = UserAgent;

  console.log("✅ 网易云音乐共享会员已启用");

  $done({ headers });
}

// 本地参数完整
if (Cookie && MConfigInfo && UserAgent) {
  console.log("📦 使用本地共享配置");
  applyConfig();
  return;
}

// 未配置远程共享，直接放行
if (!CONFIG_URL || !CONFIG_UA) {
  console.log("ℹ️ 未配置远程共享");
  $done({});
  return;
}

console.log("🌐 获取远程共享配置...");

$httpClient.get(
  {
    url: CONFIG_URL,
    timeout: 5000,
    headers: {
      "User-Agent": CONFIG_UA
    }
  },
  (err, resp, data) => {

    if (err || !data) {
      console.log("❌ 获取远程配置失败");
      $done({});
      return;
    }

    try {

      const json = JSON.parse(data);

      if (
        !json.configs ||
        !Array.isArray(json.configs) ||
        json.configs.length === 0
      ) {
        throw new Error("configs 为空");
      }

      const cfg = json.configs[0];

      Cookie = cfg.cookie || "";
      MConfigInfo = cfg.mconfigInfo || "";
      UserAgent = cfg.userAgent || "";

      if (!Cookie || !MConfigInfo || !UserAgent) {
        throw new Error("远程配置字段缺失");
      }

      console.log("✅ 已加载远程共享配置");

      applyConfig();

    } catch (e) {

      console.log("❌ 远程配置解析失败：" + e);

      $done({});

    }

  }
);
