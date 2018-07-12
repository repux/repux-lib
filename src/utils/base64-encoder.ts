export class Base64Encoder {
  encode(u8: Uint8Array) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(u8)));
  }
}
