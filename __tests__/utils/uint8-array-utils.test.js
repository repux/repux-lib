import { merge } from '../../src/utils/uint8-array-utils';

describe('Uint8 array utils', () => {
    it('should merge given arrays into one', () => {
        const arr1 = new Uint8Array([1, 2, 3]);
        const arr2 = new Uint8Array([5, 6, 7]);
        const arr3 = new Uint8Array([9, 10, 11, 12]);

        expect(merge(arr1, arr2, arr3)).toEqual(new Uint8Array([1, 2, 3, 5, 6, 7, 9, 10, 11, 12]));
    });
});
