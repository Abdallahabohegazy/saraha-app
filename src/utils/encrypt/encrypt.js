
import CryptoJS from "crypto-js"
        
export const Encrypt = async ({key , SECRET_KEY = process.env.SIGNATURE_TOKEN_USER}) => {
    return CryptoJS.AES.encrypt(key ,SECRET_KEY).toString();
}