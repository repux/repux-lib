import { expect } from 'chai';
import { Base64Decoder } from '../../../src/utils/base64-decoder';

describe('Base64Decoder', () => {
  it('should decode given string', () => {
    const u8 = new Uint8Array([ 65, 66, 67, 68 ]);
    expect(new Base64Decoder().decode('QUJDRA==')).to.deep.equal(u8);
  });
});
