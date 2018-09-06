const key = "dGHLVUj3N3";
export function encrypt(text) {
  return CryptoJS.AES.encrypt(text, key).toString();
}
