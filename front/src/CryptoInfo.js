const crypto = require('crypto');
export default class CryptoUtil {
     static create_pw(password) {
        console.log("[crypto_result]\n", crypto.createHash('sha512').update(password).digest('base64'));
    }
}