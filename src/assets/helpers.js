import {JSEncrypt} from "jsencrypt";
import sha256 from "crypto-js/sha256";
import hmacSHA512 from "crypto-js/hmac-sha512";
import Base64 from 'crypto-js/enc-base64';

const encrypt = new JSEncrypt()
export function asymmetricEncryption(message) {
    encrypt.setPrivateKey(localStorage.getItem('private_key'))
    return encrypt.sign(message, sha256, 'sha256')
}

export function symmetricEncryption(message) {
    return Base64.stringify(hmacSHA512(message, localStorage.getItem('secret_key')))
}
