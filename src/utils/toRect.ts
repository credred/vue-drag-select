import { Position, Rect } from '../typings/internal';

export function toRect([x1, y1]: Position, [x2, y2]: Position): Rect {
  return {
    left: Math.min(x1, x2),
    top: Math.min(y1, y2),
    width: Math.abs(x1 - x2),
    height: Math.abs(y1 - y2),
  };
}
