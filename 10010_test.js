try {
    console.log("=== whitephone_fix start ===");

    if (!$response) {
        console.log("❌ no response object");
        return $done({});
    }

    let body = $response.body;

    console.log("body type:", typeof body);
    console.log("body length:", body ? body.length : 0);

    if (!body) {
        console.log("❌ body is empty");
        return $done({});
    }

    // 打印前200字符（避免日志太长）
    console.log("body preview:", body.slice(0, 200));

    if (body.includes("0211")) {
        console.log("✅ found 0211, replacing...");
        body = body.replace(/0211/g, "0000");
    } else {
        console.log("⚠️ 0211 not found");
    }

    console.log("=== whitephone_fix end ===");

    $done({ body });

} catch (e) {
    console.log("❌ error:", e);
    $done({});
}
