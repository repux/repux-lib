export class Base64Decoder {
  decode(str: string) {
    return Uint8Array.from(atob(str).split('').map(c => c.charCodeAt(0)));
  }
}
