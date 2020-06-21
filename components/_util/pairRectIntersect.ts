import { Rect } from "@/_typings";

export const pairRectIntersect = (Rect1: Rect, Rect2: Rect) => {
  return (
    Math.abs(2 * Rect1.left + Rect1.width - 2 * Rect2.left - Rect2.width) <= Rect1.width + Rect2.width &&
    Math.abs(2 * Rect1.top + Rect1.height - 2 * Rect2.top - Rect2.height) <= Rect1.height + Rect2.height
  );
};
