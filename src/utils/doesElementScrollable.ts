export default function doesElementScrollable(element: HTMLElement) {
  const xHasScrollableContent = element.scrollWidth > element.clientWidth;
  const yHasScrollableContent = element.scrollHeight > element.clientHeight;

  const style = window.getComputedStyle(element);
  const isXNotScrollable = style.overflowX === 'visible' || style.overflowX === 'hidden';
  const isYNotScrollable = style.overflowY === 'visible' || style.overflowY === 'hidden';

  return (xHasScrollableContent && !isXNotScrollable) || (yHasScrollableContent && !isYNotScrollable);
}
