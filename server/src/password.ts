import CryptoJS from "crypto-js";

function hashPassword(password: string, salt?: string): string[] {

    if (salt === undefined) {
        salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
    }

    const key = CryptoJS.PBKDF2(password, salt, {keySize: 64, iterations: 10000});
    const hash = CryptoJS.HmacSHA512(password, key);

    return [hash.toString(CryptoJS.enc.Hex), salt];
}

export { hashPassword }