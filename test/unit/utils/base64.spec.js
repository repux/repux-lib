import Base64 from '../../../src/utils/base64';

describe('Base64', () => {
    it('should encode given array', () => {
        const u8 = new Uint8Array([65, 66, 67, 68]);
        expect(Base64.encode(u8)).to.equal('QUJDRA==');
    });

    it('should decode given string', () => {
        const u8 = new Uint8Array([65, 66, 67, 68]);
        expect(Base64.decode('QUJDRA==')).to.deep.equal(u8);
    });
});
