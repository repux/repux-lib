export function mockCryptoGetRandomValues() {
  crypto.getRandomValues = <Uint8Array>(array: Uint8Array): Uint8Array => {
    return (<any> array).map(() => Math.round(Math.random() * 100));
  };
}
