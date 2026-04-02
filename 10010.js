try {
    let body = $response.body;
    let headers = $response.headers;

    $console.log("=== whitephone debug ===");
    $console.log("Headers: " + JSON.stringify(headers));

    // 👉 兼容 binary / ArrayBuffer
    if (body instanceof ArrayBuffer) {
        $console.log("ArrayBuffer → decoding");
        body = new TextDecoder("utf-8").decode(body);
    }

    if (!body) {
        $console.log("Empty body");
        return $done({});
    }

    if (typeof body !== "string") {
        $console.log("Not string body: " + typeof body);
        return $done({});
    }

    if (!body.includes("0211")) {
        $console.log("0211 not found");
        return $done({});
    }

    let newBody = body.replace(/0211/g, "0000");

    $console.log("Replace success");
    $notify("联通白名单绕过", "成功", "0211 → 0000");

    $done({ body: newBody });

} catch (e) {
    $console.log("ERROR: " + e);
    $notify("Script Error", "", String(e));
    $done({});
}
