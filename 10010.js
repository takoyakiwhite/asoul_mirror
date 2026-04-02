try {
    let body = $response.body;
    if (!body || !body.includes("0211")) return $done({});
    $done({ body: body.replace(/0211/g, "0000") });
} catch {
    $done({});
}
