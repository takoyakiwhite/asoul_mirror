/*
 * Quantumult X UnblockNeteaseMusic Script
 *
 * @version 2.0.0
 * @author UnblockNeteaseMusic, QuellaMC
 * Last Modified: 2025-06-16
 *
 * This script is generated based on the logic from the UnblockNeteaseMusic project.
 * It now includes CryptoJS to handle EAPI decryption and encryption,
 * providing more comprehensive unlocking capabilities.
 *
 * GitHub: https://github.com/UnblockNeteaseMusic/server
 */

// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js

const url = $request.url;
let body = $response.body;

// EAPI 加密密钥
const eapiKey = "e82ckenh8dichen8";

/**
 * 使用 CryptoJS 解密 EAPI 响应
 * @param {string} encryptedHex - 十六进制的加密字符串
 * @returns {string} - 解密后的明文字符串
 */
function eapiDecrypt(encryptedHex) {
    const key = CryptoJS.enc.Utf8.parse(eapiKey);
    const encryptedData = CryptoJS.enc.Hex.parse(encryptedHex);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedData }, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * 使用 CryptoJS 加密 EAPI 请求体
 * @param {string} plainText - 明文字符串
 * @returns {string} - 加密后的十六进制字符串
 */
function eapiEncrypt(plainText) {
    const key = CryptoJS.enc.Utf8.parse(eapiKey);
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    // 返回十六进制格式的密文
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

/**
 * 核心处理函数，修改响应体
 * @param {object} obj - 解析后的JSON响应体
 * @param {string} reqUrl - 请求的URL
 */
async function processBody(obj, reqUrl) {
    // 歌曲可用性检查
    if (reqUrl.includes('/song/enhance/player/url')) {
        for (const song of obj.data) {
            if (!song.url || song.br === 0) {
                song.code = 200;
                song.br = 320000;
                song.fee = 0;
                song.freeTrialInfo = null;
                song.level = 'exhigh';
                song.type = 'mp3';
            }
             if (song.url) {
                song.url = song.url.replace(/(m\d+?)(?!c)\.music\.126\.net/, '$1c.music.126.net');
            }
        }
    }

    // 递归修改对象中的所有歌曲相关信息
    await recursiveModify(obj);
}

/**
 * 递归遍历并修改对象中的关键解锁字段
 * 逻辑来源于 UnblockNeteaseMusic/src/hook.js
 * @param {any} data
 */
async function recursiveModify(data) {
    if (typeof data !== 'object' || data === null) {
        return;
    }

    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            await recursiveModify(data[i]);
        }
    } else {
        // 遍历对象的每个键
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                // 如果值是对象或数组，则递归
                if (typeof data[key] === 'object' && data[key] !== null) {
                    await recursiveModify(data[key]);
                }

                if (key === 'cp' && data[key] > 1) data[key] = 1;
                if (key === 'fee' && (data[key] === 1 || data[key] === 8)) data[key] = 0;
                if (key === 'st' && data[key] < 0) data[key] = 0;
                if (key === 'sp' && data[key] > 0) data[key] = 7;
                if (key === 'payed' && data[key] === 0) data[key] = 1;
                if ((key === 'flLevel' || key === 'plLevel' || key === 'dlLevel') && data[key] === 'none') data[key] = 'exhigh';
                if ((key === 'downloadMaxbr' || key === 'playMaxbr') && data[key] < 320000) data[key] = 320000;
                if ((key === 'pl' || key === 'dl') && data[key] < 320000) data[key] = 320000;
                if (key === 'noCopyrightRcmd' && data[key] !== null) data[key] = null;
                if (key === 'privileges' && data.privileges.length > 0) {
                    await recursiveModify(data.privileges)
                }
            }
        }
    }
}

// 主函数
(async function () {
    if (!body) {
        $done({});
        return;
    }

    const isEapi = url.includes('/eapi/');

    try {
        let obj;
        if (isEapi) {
            let decryptedBody = eapiDecrypt(body);
            // 为处理js的精度问题，原项目将长整型数字转为字符串后加"L"，这里进行适配
            decryptedBody = decryptedBody.replace(/([^\\]":\s*)(\d{16,})/g, '$1"$2L"');
            obj = JSON.parse(decryptedBody);
        } else {
            // weapi 和普通 api 是明文
            obj = JSON.parse(body);
        }

        // 核心修改逻辑
        await processBody(obj, url);

        let finalBody = JSON.stringify(obj);

        // 如果是 eapi, 需要重新加密
        if (isEapi) {
            // 移除之前为处理精度问题加的"L"
            finalBody = finalBody.replace(/"(\d{16,})L"/g, '$1');
            body = eapiEncrypt(finalBody);
        } else {
            body = finalBody;
        }

    } catch (e) {
        console.log(`脚本处理失败: ${e}`);
        console.log(`URL: ${url}`);
        console.log(`原始Body: ${body.slice(0, 200)}`); // 打印部分原始body以供调试
    }

    $done({ body });

})().catch((e) => {
    console.log(`脚本执行出现致命错误: ${e}`);
    $done({});
});
