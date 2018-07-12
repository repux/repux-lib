import { expect } from 'chai';
import { Base64Encoder } from '../../../src/utils/base64-encoder';

describe('Base64Encoder', () => {
  it('should encode given string', () => {
    const u8 = new Uint8Array([ 65, 66, 67, 68 ]);
    expect(new Base64Encoder().encode(u8)).to.equal('QUJDRA==');
  });
});
