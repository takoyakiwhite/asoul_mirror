try {
    let body = $response.body;

    if (body instanceof ArrayBuffer) {
        body = new TextDecoder("utf-8").decode(body);
    }

    if (!body || typeof body !== "string") {
        return $done({});
    }

    if (!body.includes("0211")) {
        return $done({});
    }

    let newBody = body.replace(/0211/g, "0000");

    $done({ body: newBody });

} catch (e) {
    $done({});
}
