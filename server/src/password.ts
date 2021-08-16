import CryptoJS from "crypto-js";

function hashPassword(password: string, salt?: string): string[] {

    if (salt === undefined) {
        salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
    }

    const hash = CryptoJS.PBKDF2(password, salt);

    return [hash.toString(CryptoJS.enc.Hex), salt];
}

export { hashPassword }