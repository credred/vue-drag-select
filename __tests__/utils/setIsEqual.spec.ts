import { setIsEqual } from '@/utils/setIsEqual';

describe('setIsEqual', () => {
  test('setIsEqual', () => {
    expect(setIsEqual(new Set([5, 4, 3, 2, 1]), new Set([1, 2, 4, 3, 5]))).toBeTruthy();

    expect(setIsEqual(new Set([]), new Set([]))).toBeTruthy();
  });

  test('set is not equal', () => {
    expect(setIsEqual(new Set([4, 3, 2, 1]), new Set([1, 2, 3, 4, 5]))).toBeFalsy();

    expect(setIsEqual(new Set([5, 4, 3, 2, 1]), new Set([1, 2, 3, 4]))).toBeFalsy();

    expect(setIsEqual(new Set([]), new Set([1, 2, 3, 4, 5]))).toBeFalsy();
  });
});
