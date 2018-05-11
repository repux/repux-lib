export default function mockCryptoGetRandomValues() {
    if (!global.crypto) {
        global.crypto = {};
    }

    global.crypto.getRandomValues = (array) => {
        return array.map(value => Math.round(Math.random() * 100));
    };
}
