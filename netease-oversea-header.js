/*
 * NetEase Cloud Music - Request Header Modifier
 * Used to bypass region lock by spoofing IP address.
 *
 * @author QuellaMC
 * Last Modified: 2026-08-06
 */

const headers = $request.headers || {};

// 兼容大小写，覆盖已有 Header
const setHeader = (name, value) => {
    const key = Object.keys(headers).find(
        k => k.toLowerCase() === name.toLowerCase()
    );
    if (key) {
        headers[key] = value;
    } else {
        headers[name] = value;
    }
};

// 随机生成 116.25.x.x（避免 .0 和 .255）
const random = () => Math.floor(Math.random() * 254) + 1;
const fakeIP = `116.25.${random()}.${random()}`;

setHeader("X-Real-IP", fakeIP);

$done({ headers });
