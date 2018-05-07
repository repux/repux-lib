class Base64 {
    static encode(u8) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(u8)));
    }

    static decode(str) {
        return Uint8Array.from(atob(str).split('').map(c => c.charCodeAt(0)));
    }
}

export default Base64;
