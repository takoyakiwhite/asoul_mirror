const url = $request.url;
const headers = $request.headers;

const Cookie = ($argument?.Cookie || "").trim();
const MConfigInfo = ($argument?.MConfigInfo || "").trim();
const UserAgent = ($argument?.UserAgent || "").trim();

const CONFIG_URL = ($argument?.ConfigURL || "").trim();
const CONFIG_UA = ($argument?.ConfigUserAgent || "").trim();

// 持久化缓存 Key
const CACHE = {
    cookie: "Music163_Cookie",
    mconfig: "Music163_MConfigInfo",
    ua: "Music163_UserAgent"
};

let cookie = Cookie || ($persistentStore.read(CACHE.cookie) || "");
let mconfig = MConfigInfo || ($persistentStore.read(CACHE.mconfig) || "");
let userAgent = UserAgent || ($persistentStore.read(CACHE.ua) || "");

function writeCache() {
    $persistentStore.write(cookie, CACHE.cookie);
    $persistentStore.write(mconfig, CACHE.mconfig);
    $persistentStore.write(userAgent, CACHE.ua);
}

function applyConfig() {
    headers["cookie"] = cookie;
    headers["mconfig-info"] = mconfig;
    headers["user-agent"] = userAgent;

    console.log("✅ 网易云音乐共享会员已启用");

    $done({ headers });
}

if (
    !url.includes(".music.163.com/") ||
    !url.includes("/interface")
) {

    $done({});

} else if (cookie && mconfig && userAgent) {

    if (Cookie || MConfigInfo || UserAgent) {
        writeCache();
        console.log("📦 使用本地共享配置");
    } else {
        console.log("📦 使用缓存共享配置");
    }

    applyConfig();

} else if (!CONFIG_URL || !CONFIG_UA) {

    console.log("ℹ️ 未配置远程共享");

    $done({});

} else {

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

                if (!Array.isArray(json.configs) || json.configs.length === 0) {
                    throw new Error("configs 为空");
                }

                const cfg = json.configs.find(item =>
                    item.cookie &&
                    item.mconfigInfo &&
                    item.userAgent
                );

                if (!cfg) {
                    throw new Error("没有可用配置");
                }

                cookie = cfg.cookie.trim();
                mconfig = cfg.mconfigInfo.trim();
                userAgent = cfg.userAgent.trim();

                writeCache();

                console.log("✅ 已加载远程共享配置并写入缓存");

                applyConfig();

            } catch (e) {

                console.log("❌ 配置解析失败：" + e);

                $done({});

            }

        }
    );

}
