const url = $request.url;
const headers = $request.headers;

const Cookie = ($argument?.Cookie || "").trim();
const MConfigInfo = ($argument?.MConfigInfo || "").trim();
const UserAgent = ($argument?.UserAgent || "").trim();

const CONFIG_URL = ($argument?.ConfigURL || "").trim();
const CONFIG_UA = ($argument?.ConfigUserAgent || "").trim();

const CACHE = {
    cookie: "Music163_Cookie",
    mconfig: "Music163_MConfigInfo",
    ua: "Music163_UserAgent"
};

let cookie = Cookie || ($persistentStore.read(CACHE.cookie) || "");
let mconfig = MConfigInfo || ($persistentStore.read(CACHE.mconfig) || "");
let userAgent = UserAgent || ($persistentStore.read(CACHE.ua) || "");

function writeCache() {
    if (cookie) {
        $persistentStore.write(cookie, CACHE.cookie);
    }
    if (mconfig) {
        $persistentStore.write(mconfig, CACHE.mconfig);
    }
    if (userAgent) {
        $persistentStore.write(userAgent, CACHE.ua);
    }
}

function setHeader(name, value) {
    const key = Object.keys(headers).find(
        k => k.toLowerCase() === name.toLowerCase()
    );

    if (key) {
        headers[key] = value;
    } else {
        headers[name] = value;
    }
}

function applyConfig() {
    setHeader("Cookie", cookie);
    setHeader("MConfig-Info", mconfig);
    setHeader("User-Agent", userAgent);

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

                if (
                    !Array.isArray(json.configs) ||
                    json.configs.length === 0
                ) {
                    throw new Error("configs 为空");
                }

                const cfg = json.configs[0];

                cookie = (cfg.cookie || "").trim();
                mconfig = (cfg.mconfigInfo || "").trim();
                userAgent = (cfg.userAgent || "").trim();

                if (!cookie || !mconfig || !userAgent) {
                    throw new Error("远程配置字段缺失");
                }

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
