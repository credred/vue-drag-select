import { Rect } from '../typings/internal';

export function rectIsIntersect(r1: Rect, r2: Rect): boolean {
  return (
    r1.left <= r2.left + r2.width &&
    r2.left <= r1.left + r1.width &&
    r1.top <= r2.top + r2.height &&
    r2.top <= r1.top + r1.height
  );
}
