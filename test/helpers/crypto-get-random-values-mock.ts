export function mockCryptoGetRandomValues() {
    crypto.getRandomValues = (array: Uint8Array) => {
        return array.map((value: any) => Math.round(Math.random() * 100));
    };
}
