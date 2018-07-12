export class UserAgent {
  getUA(): string {
    return navigator ? navigator.userAgent : '';
  }

  isMobile(): boolean {
    return typeof window.orientation !== 'undefined';
  }

  isChromeOS(): boolean {
    return /CriOS/i.test(this.getUA());
  }

  isFirefoxOS(): boolean {
    return /FxiOS/i.test(this.getUA());
  }

  isTrident(): boolean {
    return /trident/i.test(this.getUA());
  }

  isEdge(): boolean {
    return /\sedge\//i.test(this.getUA());
  }

  is64bit(): boolean {
    return /\b(WOW64|x86_64|Win64|intel mac os x 10.(9|\d{2,}))/i.test(this.getUA());
  }
}
