import {KEYUTIL, Signature, hex2b64} from "jsrsasign"
import hmacSHA512 from "crypto-js/hmac-sha512";
import Base64 from 'crypto-js/enc-base64';
import moment from "moment";

export function asymmetricEncryption(message) {
    const prvKey = KEYUTIL.getKey(localStorage.getItem('private_key'))
    const sig = new Signature({alg: 'SHA256withRSA'})
    sig.init(prvKey)
    sig.updateString(message)

    return hex2b64(sig.sign())
}

export function symmetricEncryption(message) {
    return Base64.stringify(hmacSHA512(message, localStorage.getItem('secret_key')))
}

export function getTokenB2B(timestamp=null) {
    if (!timestamp) {
        timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ')
    }

    if (!localStorage.getItem('snap_base_url') || localStorage.getItem('snap_base_url') === '') {
        return new Promise((resolve, reject) => reject('SNAP Base URL not set in settings.'))
    }

    try {
        const strToSign = `${localStorage.getItem('merchant_id')}|${timestamp}`
        const signature = asymmetricEncryption(strToSign)

        return fetch(`${localStorage.getItem('snap_base_url')}/openapi/v1.0/access-token/b2b`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-TIMESTAMP': timestamp,
                'X-CLIENT-KEY': localStorage.getItem('merchant_id'),
                'X-SIGNATURE': signature,
            },
            body: JSON.stringify({
                'grantType': 'client_credentials',
                'additionalInfo': {}
            })
        })
    } catch (e) {
        console.log(e)
    }
}
