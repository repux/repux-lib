import { expect } from 'chai';
import { UserAgent } from '../../../src/utils/user-agent';

describe('UserAgent', () => {
  const userAgent = new UserAgent();

  it('should detect mobile', () => {
    expect(userAgent.isMobile()).to.equal(false);
  });

  it('should detect correct user agent', () => {
    userAgent.getUA = () => 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) ' +
      'CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';
    expect(userAgent.isChromeOS()).to.equal(true);

    userAgent.getUA = () => 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) ' +
      'FxiOS/1.0 Mobile/12F69 Safari/600.1.4';
    expect(userAgent.isFirefoxOS()).to.equal(true);

    userAgent.getUA = () => 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0)';
    expect(userAgent.isTrident()).to.equal(true);

    userAgent.getUA = () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 ' +
      'Safari/537.36 Edge/14.14393';
    expect(userAgent.isEdge()).to.equal(true);

    userAgent.getUA = () => 'Mozilla/5.0 (X11; CrOS x86_64 10032.75.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.116 ' +
      'Safari/537.36';
    expect(userAgent.is64bit()).to.equal(true);
  });
});
