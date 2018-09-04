export function mockCryptoGetRandomValues() {
    crypto.getRandomValues = (array: Uint8Array) => {
        return array.map(() => Math.round(Math.random() * 100));
    };
}
