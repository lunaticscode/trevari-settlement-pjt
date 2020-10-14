const crypto = require('crypto');
const aes_info = require('../secret');
export default class CryptoUtil {

    static create_pw(p, i) {
        let r = crypto.pbkdf2Sync(p, i, 10, 64, 'sha512').toString('base64');
        return r;
    }

    static encrypt_account(accountNum){
        let cypher = crypto.createCipher(aes_info.aes_algo, aes_info.aes_key);
        let encrypted = cypher.update(accountNum, 'utf8', 'base64');
        encrypted = encrypted + cypher.final('base64');
        return encrypted;
    }

    static decrypt_account(accountText){
        let pre_cypher = crypto.createDecipher(aes_info.aes_algo, aes_info.aes_key);
        let decrypted = pre_cypher.update(accountText,'base64', 'utf8');
        decrypted = decrypted + pre_cypher.final('utf8');
        return decrypted;
    }

    static base64_enc(text){
        let enc_text = Buffer.from(text).toString('base64');
        return enc_text;
    }
    static base64_denc(text){
        let denc_text = Buffer.from(text, 'base64').toString('ascii');
        return denc_text;
    }

}