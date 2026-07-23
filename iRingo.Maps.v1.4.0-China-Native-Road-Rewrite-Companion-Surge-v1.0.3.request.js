/*
 * iRingo Maps v1.4.0 mainland native-road rewrite companion for Surge.
 *
 * Keep the stable v1.4.0 GeoManifest untouched. Observe the live AutoNavi
 * vector credential already emitted by Maps, then rewrite only mainland-China
 * Apple VECTOR_ROADS (style 20) requests to the native China descriptor.
 * Foreign tiles and every unrelated service pass through unchanged.
 *
 * Surge runs this script with engine=jsc. Do not add URL, URLSearchParams,
 * fetch, TextEncoder, TextDecoder, or another Web API dependency here.
 */
(() => {
  "use strict";

  const Z11_ROWS = {"663":[1718,1728],"664":[1713,1731],"665":[1712,1734],"666":[1711,1736],"667":[1710,1737],"668":[1709,1739],"669":[1708,1740],"670":[1709,1740],"671":[1711,1740],"672":[1711,1741],"673":[1711,1741],"674":[1711,1742],"675":[1711,1742],"676":[1711,1742],"677":[1710,1743],"678":[1709,1743],"679":[1708,1744],"680":[1707,1744],"681":[1707,1745],"682":[1706,1745],"683":[1706,1746],"684":[1705,1746],"685":[1705,1746],"686":[1704,1747],"687":[1704,1747],"688":[1703,1747],"689":[1703,1747],"690":[1703,1748],"691":[1703,1748],"692":[1703,1748],"693":[1702,1748],"694":[1701,1749],"695":[1699,1749],"696":[1687,1689,1698,1749],"697":[1687,1691,1697,1752],"698":[1687,1693,1695,1756],"699":[1686,1759],"700":[1686,1760],"701":[1521,1522,1685,1761],"702":[1520,1523,1685,1762],"703":[1519,1523,1684,1763],"704":[1519,1523,1684,1765],"705":[1518,1523,1683,1766],"706":[1517,1524,1683,1766],"707":[1515,1524,1683,1766],"708":[1512,1526,1682,1767,1790,1791],"709":[1512,1527,1682,1767,1786,1790],"710":[1512,1528,1681,1767,1783,1790],"711":[1512,1529,1681,1694,1696,1768,1781,1790],"712":[1512,1531,1682,1693,1698,1768,1780,1789],"713":[1512,1534,1682,1684,1687,1692,1699,1768,1778,1789],"714":[1512,1537,1701,1789],"715":[1512,1537,1701,1788],"716":[1512,1538,1702,1787],"717":[1511,1538,1703,1787],"718":[1497,1500,1510,1539,1704,1786],"719":[1497,1504,1509,1539,1705,1786],"720":[1496,1540,1705,1786],"721":[1496,1540,1705,1785],"722":[1496,1540,1696,1702,1705,1785],"723":[1496,1540,1691,1785],"724":[1495,1540,1690,1785],"725":[1495,1540,1688,1784],"726":[1495,1539,1687,1784],"727":[1494,1539,1686,1784],"728":[1494,1539,1686,1784],"729":[1494,1539,1685,1783],"730":[1494,1538,1684,1783],"731":[1493,1539,1682,1782],"732":[1493,1539,1679,1782],"733":[1491,1540,1676,1781],"734":[1489,1541,1674,1773,1776,1781],"735":[1485,1546,1673,1771],"736":[1482,1552,1660,1662,1672,1769],"737":[1479,1556,1660,1666,1670,1769],"738":[1479,1557,1659,1769],"739":[1480,1558,1658,1769],"740":[1480,1560,1658,1769],"741":[1480,1561,1658,1769],"742":[1481,1564,1658,1770],"743":[1481,1565,1659,1770],"744":[1482,1566,1659,1770],"745":[1482,1566,1660,1770],"746":[1482,1567,1660,1770],"747":[1483,1567,1659,1770],"748":[1483,1567,1658,1769],"749":[1483,1568,1656,1769],"750":[1484,1568,1655,1769],"751":[1483,1569,1654,1769],"752":[1481,1570,1653,1769],"753":[1480,1570,1652,1762,1764,1766],"754":[1480,1571,1578,1578,1650,1762,1765,1766],"755":[1480,1584,1595,1598,1647,1761,1766,1766],"756":[1480,1603,1638,1761],"757":[1481,1604,1634,1759],"758":[1480,1606,1630,1756],"759":[1479,1608,1627,1754],"760":[1477,1610,1626,1752],"761":[1475,1618,1624,1752],"762":[1473,1619,1622,1744,1747,1752],"763":[1471,1743,1748,1752],"764":[1470,1743],"765":[1469,1742],"766":[1468,1741],"767":[1461,1740],"768":[1461,1739],"769":[1461,1713,1717,1737],"770":[1460,1711,1718,1735],"771":[1452,1455,1460,1709,1718,1734],"772":[1450,1708,1719,1733],"773":[1448,1707,1718,1732],"774":[1446,1706,1717,1731],"775":[1445,1704,1716,1730],"776":[1444,1703,1715,1728],"777":[1445,1703,1715,1724],"778":[1444,1702,1715,1721],"779":[1443,1701,1715,1720],"780":[1443,1700,1715,1719],"781":[1444,1694,1714,1718],"782":[1444,1693,1714,1715],"783":[1444,1693],"784":[1444,1692],"785":[1444,1692],"786":[1448,1693],"787":[1450,1693],"788":[1450,1694],"789":[1450,1695],"790":[1450,1698],"791":[1450,1699,1711,1711],"792":[1450,1699,1709,1713],"793":[1450,1699,1708,1715],"794":[1451,1701,1707,1719],"795":[1451,1703,1706,1719],"796":[1452,1720],"797":[1453,1720],"798":[1454,1716],"799":[1456,1712],"800":[1456,1711],"801":[1456,1711],"802":[1457,1710],"803":[1457,1709],"804":[1457,1708],"805":[1459,1706],"806":[1463,1704],"807":[1466,1703],"808":[1467,1703],"809":[1468,1702],"810":[1469,1702],"811":[1470,1701],"812":[1470,1702],"813":[1471,1704],"814":[1472,1705],"815":[1473,1707],"816":[1473,1707],"817":[1473,1708],"818":[1473,1708],"819":[1473,1708],"820":[1472,1709],"821":[1472,1709],"822":[1473,1709],"823":[1474,1710],"824":[1474,1710],"825":[1475,1711],"826":[1475,1711],"827":[1474,1712],"828":[1471,1713],"829":[1471,1713],"830":[1471,1714],"831":[1471,1715],"832":[1471,1716],"833":[1472,1716],"834":[1472,1717],"835":[1473,1716],"836":[1474,1716],"837":[1475,1716],"838":[1477,1716],"839":[1478,1715],"840":[1480,1713],"841":[1482,1713],"842":[1483,1486,1489,1714],"843":[1485,1485,1491,1714],"844":[1493,1715],"845":[1494,1717],"846":[1495,1718],"847":[1497,1717],"848":[1498,1717],"849":[1501,1568,1571,1717],"850":[1502,1560,1564,1567,1572,1717],"851":[1503,1558,1573,1717],"852":[1503,1557,1573,1716],"853":[1507,1555,1573,1716],"854":[1509,1554,1572,1716],"855":[1510,1553,1573,1716],"856":[1512,1534,1537,1552,1581,1715],"857":[1516,1532,1540,1550,1582,1712],"858":[1523,1525,1529,1531,1544,1549,1582,1711],"859":[1529,1531,1583,1711],"860":[1529,1530,1584,1710],"861":[1529,1529,1585,1709],"862":[1585,1709],"863":[1585,1708],"864":[1586,1708],"865":[1586,1707],"866":[1586,1707],"867":[1585,1706],"868":[1585,1705],"869":[1585,1705],"870":[1585,1704],"871":[1585,1704],"872":[1584,1703],"873":[1583,1703],"874":[1582,1702],"875":[1581,1701],"876":[1580,1700],"877":[1580,1700],"878":[1580,1699],"879":[1580,1698],"880":[1580,1697],"881":[1579,1696],"882":[1579,1694],"883":[1579,1581,1585,1693],"884":[1586,1692],"885":[1586,1690],"886":[1586,1689],"887":[1586,1687],"888":[1587,1620,1625,1686],"889":[1589,1619,1626,1684],"890":[1590,1618,1630,1683],"891":[1590,1607,1631,1676],"892":[1589,1605,1631,1670,1672,1675],"893":[1589,1602,1630,1669,1673,1673],"894":[1589,1601,1630,1668],"895":[1590,1602,1632,1667],"896":[1591,1602,1633,1664],"897":[1593,1596,1599,1602,1635,1640,1642,1662],"898":[1600,1602,1646,1659],"899":[1600,1602,1649,1653],"900":[1600,1602,1648,1653],"901":[1648,1653],"902":[1648,1652],"903":[1648,1652],"904":[1649,1652],"905":[1649,1651],"907":[1650,1653],"908":[1646,1654],"909":[1644,1654],"910":[1643,1654],"911":[1642,1653],"912":[1642,1652],"913":[1642,1652],"914":[1642,1651],"915":[1642,1651],"916":[1642,1650],"917":[1644,1648],"918":[1646,1646]};
  const EXCLUDED_ROWS = {"12":{"1784":[3348,3349],"1785":[3345,3349],"1786":[3344,3351],"1787":[3344,3351],"1788":[3343,3350],"1789":[3340,3340,3344,3350]},"13":{"3569":[6693,6700],"3570":[6690,6700],"3571":[6688,6700],"3572":[6687,6702],"3573":[6687,6703],"3574":[6687,6703],"3575":[6687,6702],"3576":[6686,6702],"3577":[6686,6701],"3578":[6680,6680,6687,6701],"3579":[6680,6680,6699,6699]},"14":{"7138":[13387,13400],"7139":[13384,13400],"7140":[13380,13380,13383,13400],"7141":[13379,13400],"7142":[13378,13400],"7143":[13376,13401],"7144":[13375,13402,13405,13405],"7145":[13375,13406],"7146":[13375,13406],"7147":[13375,13407],"7148":[13375,13407],"7149":[13374,13407],"7150":[13374,13406],"7151":[13374,13406],"7152":[13373,13405],"7153":[13373,13405],"7154":[13372,13404],"7155":[13359,13360,13373,13403],"7156":[13359,13361,13373,13403],"7157":[13360,13361,13375,13402],"7158":[13360,13362,13376,13376,13397,13400],"7159":[13360,13361]},"15":{"14275":[26785,26799],"14276":[26775,26779,26783,26800],"14277":[26774,26801],"14278":[26769,26801],"14279":[26769,26801],"14280":[26767,26801],"14281":[26760,26801],"14282":[26758,26801],"14283":[26757,26801],"14284":[26756,26801],"14285":[26754,26802],"14286":[26753,26802],"14287":[26751,26803],"14288":[26750,26804,26811,26811],"14289":[26750,26805,26808,26811],"14290":[26750,26811],"14291":[26750,26813],"14292":[26750,26814],"14293":[26749,26814],"14294":[26749,26814],"14295":[26749,26814],"14296":[26749,26815],"14297":[26749,26814],"14298":[26749,26814],"14299":[26749,26814],"14300":[26748,26814],"14301":[26748,26813],"14302":[26748,26813],"14303":[26747,26812],"14304":[26746,26811],"14305":[26746,26811],"14306":[26746,26810],"14307":[26745,26810],"14308":[26745,26809],"14309":[26719,26719,26744,26809],"14310":[26719,26721,26745,26808],"14311":[26718,26722,26745,26807],"14312":[26718,26722,26746,26806],"14313":[26718,26723,26747,26806],"14314":[26719,26723,26748,26805],"14315":[26719,26724,26750,26804],"14316":[26720,26724,26751,26754,26783,26785,26792,26802],"14317":[26720,26724,26796,26801],"14318":[26720,26723],"14319":[26720,26722]}};
  const APPLE_ROAD_HOSTS = {
    "gspe19-ssl.ls.apple.com": true,
    "gspe19-kittyhawk-ssl.ls.apple.com": true,
  };
  const CHINA_TILE_HOSTS = {
    "gspe19-cn-ssl.ls.apple.com": true,
    "gspe19-2-cn-ssl.ls.apple.com": true,
  };
  const STORAGE_KEY = "iRingo.Maps.v140.CNNativeRoadAuth.v103";
  const AUTH_MAX_AGE_MS = 30 * 60 * 1000;
  const WAIT_ATTEMPTS = 12;
  const WAIT_INTERVAL_MS = 50;

  function lowerCaseHeaders(headers) {
    const result = {};
    if (Array.isArray(headers)) {
      for (const item of headers) {
        const name = String(item && item.name || "").toLowerCase();
        if (name) result[name] = String(item && item.value || "");
      }
    } else {
      for (const name of Object.keys(headers || {})) {
        result[String(name).toLowerCase()] = String(headers[name]);
      }
    }
    return result;
  }

  function cloneHeaders(headers) {
    const result = {};
    if (Array.isArray(headers)) {
      for (const item of headers) {
        const name = String(item && item.name || "");
        if (name) result[name] = String(item && item.value || "");
      }
    } else {
      for (const name of Object.keys(headers || {})) result[name] = String(headers[name]);
    }
    return result;
  }

  function replaceHeader(headers, name, value) {
    const lowerName = String(name).toLowerCase();
    for (const key of Object.keys(headers)) {
      if (String(key).toLowerCase() === lowerName) delete headers[key];
    }
    if (value !== undefined && value !== null) headers[name] = String(value);
  }

  function parseRequestURL(value) {
    const match = /^(https?):\/\/([^\/:?#]+)(?::\d+)?([^?#]*)(?:\?([^#]*))?/i.exec(String(value || ""));
    if (!match) return null;
    return {
      host: String(match[2] || "").toLowerCase(),
      path: match[3] || "/",
      query: match[4] || "",
    };
  }

  function parameter(source, name) {
    const expression = new RegExp("(?:^|&)" + name + "=([^&]*)");
    const match = expression.exec(String(source || ""));
    if (!match) return null;
    try { return decodeURIComponent(match[1].replace(/\+/g, " ")); }
    catch (_) { return match[1]; }
  }

  function parseTileRequest(request) {
    const address = parseRequestURL(request && request.url);
    if (!address) return null;
    const headers = lowerCaseHeaders(request && request.headers);
    const packed = headers["maps-tile-style"] || "";
    const value = name => parameter(address.query, name)
      ?? parameter(packed, name)
      ?? headers["maps-tile-" + name]
      ?? null;
    return {
      host: address.host,
      path: address.path,
      style: Number.parseInt(value("style"), 10),
      x: Number.parseInt(value("x"), 10),
      y: Number.parseInt(value("y"), 10),
      z: Number.parseInt(value("z"), 10),
      version: Number.parseInt(value("v") ?? value("version"), 10),
      size: value("size"),
      scale: value("scale"),
      verticalDatum: value("vertical_datum"),
      language: value("vlang"),
      preflight: value("preflight"),
      authToken: headers["maps-auth-token"] || null,
      packedStyle: packed,
    };
  }

  function isMainlandTile(x, y, z) {
    if (![x, y, z].every(Number.isInteger)) return false;
    if (z < 12 || z > 15) return false;
    const dimension = 2 ** z;
    if (x < 0 || y < 0 || x >= dimension || y >= dimension) return false;
    const divisor = 2 ** (z - 11);
    const parentX = Math.floor(x / divisor);
    const parentY = Math.floor(y / divisor);
    const row = Z11_ROWS[parentY];
    if (!row) return false;
    const excluded = EXCLUDED_ROWS[z] && EXCLUDED_ROWS[z][y];
    if (excluded) {
      for (let index = 0; index < excluded.length; index += 2) {
        if (x >= excluded[index] && x <= excluded[index + 1]) return false;
      }
    }
    for (let index = 0; index < row.length; index += 2) {
      if (parentX >= row[index] && parentX <= row[index + 1]) return true;
    }
    return false;
  }

  function encodePair(name, value) {
    return encodeURIComponent(String(name)) + "=" + encodeURIComponent(String(value));
  }

  function nativePackedStyle(tile, version) {
    const pairs = [
      ["style", "20"],
      ["size", tile.size || "2"],
      ["scale", tile.scale || "0"],
      ["v", String(version)],
      ["vertical_datum", tile.verticalDatum || "wgs84"],
    ];
    if (tile.language) pairs.push(["vlang", tile.language]);
    pairs.push(["preflight", tile.preflight || "2"]);
    return pairs.map(pair => encodePair(pair[0], pair[1])).join("&");
  }

  function readAuth(storage, now) {
    if (!storage || typeof storage.read !== "function") return null;
    let record;
    try {
      record = storage.read();
      if (typeof record === "string") record = JSON.parse(record);
    } catch (_) { return null; }
    if (!record || typeof record.token !== "string" || record.token.length < 16) return null;
    if (!Number.isInteger(record.version) || record.version < 2000 || record.version > 99999999) return null;
    if (!Number.isFinite(record.savedAt) || now - record.savedAt < 0 || now - record.savedAt > AUTH_MAX_AGE_MS) return null;
    return record;
  }

  function observeChinaAuth(tile, storage, now) {
    const observable = tile
      && CHINA_TILE_HOSTS[tile.host]
      && tile.path === "/tiles"
      && (tile.style === 1 || tile.style === 20 || tile.style === 22)
      && typeof tile.authToken === "string"
      && tile.authToken.length >= 16
      && Number.isInteger(tile.version)
      && tile.version >= 2000;
    if (!observable || !storage || typeof storage.write !== "function") return false;
    storage.write({ token: tile.authToken, version: tile.version, savedAt: now, sourceStyle: tile.style });
    return true;
  }

  function makeNativeRewrite(request, tile, auth) {
    const headers = cloneHeaders(request && request.headers);
    replaceHeader(headers, "Host", "gspe19-cn-ssl.ls.apple.com");
    replaceHeader(headers, ":authority", null);
    replaceHeader(headers, "maps-auth-token", auth.token);
    replaceHeader(headers, "maps-tile-style", nativePackedStyle(tile, auth.version));
    replaceHeader(headers, "maps-tile-x", tile.x);
    replaceHeader(headers, "maps-tile-y", tile.y);
    replaceHeader(headers, "maps-tile-z", tile.z);
    replaceHeader(headers, "If-None-Match", null);
    replaceHeader(headers, "If-Modified-Since", null);
    replaceHeader(headers, "Content-Length", null);
    return { url: "https://gspe19-cn-ssl.ls.apple.com/tiles", headers };
  }

  function handle(request, storage, now = Date.now()) {
    const tile = parseTileRequest(request);
    if (observeChinaAuth(tile, storage, now)) return { action: "observe", modified: false, tile };
    const targeted = tile
      && APPLE_ROAD_HOSTS[tile.host]
      && tile.path === "/tile.vf"
      && tile.style === 20
      && isMainlandTile(tile.x, tile.y, tile.z);
    if (!targeted) return { action: "passthrough", modified: false, tile };
    const auth = readAuth(storage, now);
    if (!auth) return { action: "await-auth", modified: false, tile };
    return {
      action: "rewrite",
      modified: true,
      tile,
      request: makeNativeRewrite(request, tile, auth),
      authVersion: auth.version,
    };
  }

  function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  async function handleAsync(request, storage) {
    let result = handle(request, storage);
    if (result.action !== "await-auth") return result;
    if (typeof setTimeout !== "function") return { ...result, action: "passthrough-no-auth" };
    for (let attempt = 0; attempt < WAIT_ATTEMPTS; attempt++) {
      await wait(WAIT_INTERVAL_MS);
      result = handle(request, storage);
      if (result.action === "rewrite") return result;
    }
    return { ...result, action: "passthrough-no-auth" };
  }

  const api = {
    lowerCaseHeaders,
    cloneHeaders,
    replaceHeader,
    parseRequestURL,
    parameter,
    parseTileRequest,
    isMainlandTile,
    nativePackedStyle,
    readAuth,
    observeChinaAuth,
    makeNativeRewrite,
    handle,
    handleAsync,
  };
  if (typeof module === "object" && module && module.exports) module.exports = api;
  if (typeof $request === "object" && typeof $done === "function") {
    const storage = {
      read() { return $persistentStore.read(STORAGE_KEY); },
      write(record) { return $persistentStore.write(JSON.stringify(record), STORAGE_KEY); },
    };
    handleAsync($request, storage).then(result => {
      if (result.action === "rewrite") {
        console.log("[iRingo Maps CN native road v1.0.3] rewrite " + result.tile.z + "/" + result.tile.x + "/" + result.tile.y + " -> CN v=" + result.authVersion);
        $done(result.request);
      } else {
        if (result.action === "passthrough-no-auth") console.log("[iRingo Maps CN native road v1.0.3] no live CN credential; Apple tile passed through");
        $done({});
      }
    }).catch(error => {
      console.log("[iRingo Maps CN native road v1.0.3] passthrough after error: " + (error && error.message || error));
      $done({});
    });
  }
})();
