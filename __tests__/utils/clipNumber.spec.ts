import { clipNumber } from '@/utils/clipNumber';

describe('clipNumber', () => {
  it('number or edge', () => {
    expect(clipNumber(10, 0, 100)).toBe(10);
    expect(clipNumber(-1, 0, 100)).toBe(0);
    expect(clipNumber(150, 0, 100)).toBe(100);
  });
});
