export default function doesElementScrolledTotally(
  element: HTMLElement,
  direction: {
    x?: number;
    y?: number;
  }
) {
  const { x = 0, y = 0 } = direction;
  return (
    (x === 0 ||
      (x < 0 && element.scrollLeft === 0) ||
      (x > 0 && element.scrollWidth - element.clientWidth - element.scrollLeft < 1)) &&
    (y === 0 ||
      (y < 0 && element.scrollTop === 0) ||
      (y > 0 && element.scrollHeight - element.clientHeight - element.scrollTop < 1))
  );
}
