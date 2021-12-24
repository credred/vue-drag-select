import { Rect } from '@/typings/internal';
import { rectIsIntersect } from '@/utils/rectIsIntersect';

describe('rectIsIntersect', () => {
  test('rect is intersect', () => {
    const rectA: Rect = {
      left: 500,
      top: 600,
      width: 200,
      height: 200,
    };
    const rectB: Rect = {
      left: 600,
      top: 700,
      width: 200,
      height: 200,
    };

    expect(rectIsIntersect(rectA, rectB)).toBeTruthy();
  });

  test("rect isn't intersect", () => {
    const rectA: Rect = {
      left: 100,
      top: 200,
      width: 200,
      height: 200,
    };
    const rectB: Rect = {
      left: 600,
      top: 700,
      width: 200,
      height: 200,
    };

    expect(rectIsIntersect(rectA, rectB)).toBeFalsy();
  });

  test('a rect contain an other rect is intersect', () => {
    const rectA: Rect = {
      left: 100,
      top: 100,
      width: 200,
      height: 200,
    };
    const rectB: Rect = {
      left: 200,
      top: 200,
      width: 50,
      height: 50,
    };

    expect(rectIsIntersect(rectA, rectB)).toBeTruthy();
  });

  test('the edge contact of tow rect is intersect', () => {
    const rectA: Rect = {
      left: 100,
      top: 100,
      width: 200,
      height: 200,
    };
    const rectB: Rect = {
      left: 200,
      top: 300,
      width: 50,
      height: 50,
    };

    expect(rectIsIntersect(rectA, rectB)).toBeTruthy();
  });
});
