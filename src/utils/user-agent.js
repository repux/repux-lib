export class UserAgent {
    static getUA() {
        return navigator ? navigator.userAgent : '';
    }

    static isMobile() {
        return typeof window.orientation !== 'undefined';
    }

    static isChromeOS() {
        return /CriOS/i.test(UserAgent.getUA());
    }

    static isFirefoxOS() {
        return /FxiOS/i.test(UserAgent.getUA());
    }

    static isTrident() {
        return /trident/i.test(UserAgent.getUA());
    }

    static isEdge() {
        return /\sedge\//i.test(UserAgent.getUA());
    }

    static is64bit() {
        return /\b(WOW64|x86_64|Win64|intel mac os x 10.(9|\d{2,}))/i.test(UserAgent.getUA());
    }
}
