const url = $request.url;
const headers = $request.headers;

const Cookie = ($argument?.Cookie || "").trim();
const MConfigInfo = ($argument?.MConfigInfo || "").trim();
const UserAgent = ($argument?.UserAgent || "").trim();

const CONFIG_URL = ($argument?.ConfigURL || "").trim();
const CONFIG_UA = ($argument?.ConfigUserAgent || "").trim();

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

} else if (Cookie && MConfigInfo && UserAgent) {

    console.log("📦 使用本地共享配置");

    applyConfig(Cookie, MConfigInfo, UserAgent);

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

                const cookie = Cookie || cfg.cookie || "";
                const mconfig = MConfigInfo || cfg.mconfigInfo || "";
                const userAgent = UserAgent || cfg.userAgent || "";

                if (!cookie || !mconfig || !userAgent) {
                    throw new Error("远程配置字段缺失");
                }

                console.log("✅ 已加载远程共享配置");

                applyConfig(cookie, mconfig, userAgent);

            } catch (e) {

                console.log("❌ 配置解析失败：" + e);

                $done({});

            }

        }
    );

}
