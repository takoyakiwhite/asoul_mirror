// Surge Response Script

if (!$response.body) {
  console.log("No body");
  $done({});
}

let body = $response.body;

try {
  // 直接字符串替换（最稳）
  let modified = body.replace(/0211/g, "0000");

  console.log("Original:", body);
  console.log("Modified:", modified);

  $done({ body: modified });

} catch (e) {
  console.log("Error:", e);
  $done({});
}
