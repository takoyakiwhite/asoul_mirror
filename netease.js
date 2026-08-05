const url = $request.url;
const headers = $request.headers;

// 本地参数
const Cookie = ($argument?.Cookie || "").trim();
const MConfigInfo = ($argument?.MConfigInfo || "").trim();
const UserAgent = ($argument?.UserAgent || "").trim();

// 远程配置
const CONFIG_URL = ($argument?.ConfigURL || "").trim();
const CONFIG_UA = ($argument?.ConfigUserAgent || "").trim();

// 持久化缓存 Key
const COOKIE_KEY = "Music163_Cookie";
const MCONFIG_KEY = "Music163_MConfigInfo";
const UA_KEY = "Music163_UserAgent";

// 参数优先，其次缓存
let cookie = Cookie || ($persistentStore.read(COOKIE_KEY) || "");
let mconfig = MConfigInfo || ($persistentStore.read(MCONFIG_KEY) || "");
let userAgent = UserAgent || ($persistentStore.read(UA_KEY) || "");

function applyConfig(cookie, mconfig, userAgent) {
    headers["cookie"] = cookie;
    headers["mconfig-info"] = mconfig;
    headers["user-agent"] = userAgent;

    console.log("✅ 网易云音乐共享会员已启用");

    $done({
        headers
    });
}

if (
    !url.includes(".music.163.com/") ||
    !url.includes("/interface")
) {

    $done({});

} else if (cookie && mconfig && userAgent) {

    // 如果是参数传入，顺便更新缓存
    if (Cookie) $persistentStore.write(Cookie, COOKIE_KEY);
    if (MConfigInfo) $persistentStore.write(MConfigInfo, MCONFIG_KEY);
    if (UserAgent) $persistentStore.write(UserAgent, UA_KEY);

    console.log(
        Cookie || MConfigInfo || UserAgent
            ? "📦 使用本地共享配置"
            : "📦 使用缓存共享配置"
    );

    applyConfig(cookie, mconfig, userAgent);

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
                    !json.configs ||
                    !Array.isArray(json.configs) ||
                    json.configs.length === 0
                ) {
                    throw new Error("configs 为空");
                }

                const cfg = json.configs[0];

                cookie = Cookie || cfg.cookie || "";
                mconfig = MConfigInfo || cfg.mconfigInfo || "";
                userAgent = UserAgent || cfg.userAgent || "";

                if (!cookie || !mconfig || !userAgent) {
                    throw new Error("远程配置字段缺失");
                }

                // 写入持久化缓存
                $persistentStore.write(cookie, COOKIE_KEY);
                $persistentStore.write(mconfig, MCONFIG_KEY);
                $persistentStore.write(userAgent, UA_KEY);

                console.log("✅ 已加载远程共享配置并写入缓存");

                applyConfig(cookie, mconfig, userAgent);

            } catch (e) {

                console.log("❌ 配置解析失败：" + e);

                $done({});

            }

        }
    );

}
