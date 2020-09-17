const crypto = require('crypto');
export default class CryptoUtil {
     static create_pw(p, i) {
         let r = crypto.pbkdf2Sync(p, i, 10, 64, 'sha512').toString('base64');
         return r;
     }
}