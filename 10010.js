try {
    let body = $response.body;

    // Debug: 原始 body 长度
    $console.log("Body length: " + (body ? body.length : "null"));

    if (!body) {
        $console.log("Body is empty");
        return $done({});
    }

    // Debug: 是否命中关键字
    if (!body.includes("0211")) {
        $console.log("Keyword 0211 not found");
        return $done({});
    }

    $console.log("Keyword found, replacing...");

    let newBody = body.replace(/0211/g, "0000");

    // Debug: 替换前后对比（截取一部分避免太长）
    $console.log("Before: " + body.slice(0, 100));
    $console.log("After: " + newBody.slice(0, 100));

    // 可选：弹通知（调试用）
    $notify("Script Debug", "Replace Success", "0211 → 0000");

    $done({ body: newBody });

} catch (e) {
    $console.log("Error: " + e);
    $notify("Script Error", "", String(e));
    $done({});
}
