import * as crypto from "crypto";
const subtle = crypto.webcrypto.subtle;
const decrypt = async (iv: string, enc: string): Promise<string> => {
  let ivBuffer = Buffer.from(iv, "hex");
  let key = await subtle.importKey("jwk", {
    "alg": "A256GCM",
    "ext": true,
    "k": "x9vxgoa23TZ1ZaideEMkSQv5AUsQY-qZA9me8dXSjE4",
    "key_ops": ["encrypt", "decrypt"],
    "kty": "oct"
  }, {
    name: "AES-GCM",
  }, false, ["encrypt", "decrypt"]);
  let dec = new TextDecoder();
  let decrypted = await subtle.decrypt({
    name: "AES-GCM",
    iv: ivBuffer
  }, key, Buffer.from(enc, "hex"));
  return dec.decode(decrypted)
}
export {
  decrypt
}
export default {
  decrypt
}