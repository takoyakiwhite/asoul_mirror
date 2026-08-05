const url = $request.url;
const headers = $request.headers;

const {
    Cookie = "",
    MConfigInfo = "",
    UserAgent = "",
    ConfigURL = "",
    ConfigUserAgent = ""
} = $argument || {};

const CACHE = {
    cookie: "Music163_Cookie",
    mconfig: "Music163_MConfigInfo",
    ua: "Music163_UserAgent"
};

let cookie = Cookie.trim() || ($persistentStore.read(CACHE.cookie) || "");
let mconfig = MConfigInfo.trim() || ($persistentStore.read(CACHE.mconfig) || "");
let userAgent = UserAgent.trim() || ($persistentStore.read(CACHE.ua) || "");

function finish() {
    $done({ headers });
}

function writeCache() {
    if (cookie) $persistentStore.write(cookie, CACHE.cookie);
    if (mconfig) $persistentStore.write(mconfig, CACHE.mconfig);
    if (userAgent) $persistentStore.write(userAgent, CACHE.ua);
}

function setHeader(name, value) {
    for (const key in headers) {
        if (key.toLowerCase() === name.toLowerCase()) {
            headers[key] = value;
            return;
        }
    }
    headers[name] = value;
}

function applyConfig() {
    setHeader("Cookie", cookie);
    setHeader("MConfig-Info", mconfig);
    setHeader("User-Agent", userAgent);

    console.log("✅ 网易云音乐共享会员已启用");
    finish();
}

function loadRemote() {
    console.log("🌐 获取远程共享配置...");

    $httpClient.get(
    {
        url: ConfigURL.trim(),
        timeout: 5000,
        headers: {
            "Accept": "*/*",
            "User-Agent": ConfigUserAgent.trim(),
            "Priority": "u=3",
            "Accept-Language": "zh-CN,zh-Hans;q=0.9",
            "Accept-Encoding": "gzip, deflate, br"
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

                if (!Array.isArray(json.configs) || !json.configs.length) {
                    throw new Error("configs 为空");
                }

                const cfg = json.configs[0];

                cookie = String(cfg.cookie || "").trim();
                mconfig = String(cfg.mconfigInfo || "").trim();
                userAgent = String(cfg.userAgent || "").trim();

                if (!cookie || !mconfig || !userAgent) {
                    throw new Error("远程配置字段缺失");
                }

                writeCache();

                console.log("✅ 已加载远程共享配置并写入缓存");

                applyConfig();

            } catch (e) {

                console.log("❌ 配置解析失败：" + e.message);

                $done({});

            }

        }
    );
}

if (
    !url.includes(".music.163.com/") ||
    !url.includes("/interface")
) {
    $done({});
}

else if (cookie && mconfig && userAgent) {

    if (Cookie || MConfigInfo || UserAgent) {
        writeCache();
        console.log("📦 使用本地共享配置");
    } else {
        console.log("📦 使用缓存共享配置");
    }

    applyConfig();
}

else if (!ConfigURL.trim() || !ConfigUserAgent.trim()) {

    console.log("ℹ️ 未配置远程共享");

    $done({});
}

else {

    loadRemote();

}
