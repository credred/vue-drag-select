import { toRect } from '../../src/utils/toRect';

describe('toRect', () => {
  test('toRect', () => {
    expect(toRect([10, 10], [50, 50])).toEqual({
      left: 10,
      top: 10,
      width: 40,
      height: 40,
    });
    expect(toRect([50, 50], [5, 5])).toEqual({
      left: 5,
      top: 5,
      width: 45,
      height: 45,
    });
    expect(toRect([0, 0], [0, 0])).toEqual({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    });
  });
});
