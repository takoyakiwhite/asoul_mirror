try {
    let body = $response.body;

    if (!body) {
        $done({});
        return;
    }

    if (body.includes("0211")) {
        body = body.replace(/0211/g, "0000");
        console.log("替换成功");
    }

    $done({ body });

} catch (e) {
    console.log("错误: " + e);
    $done({});
}
