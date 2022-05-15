import { Position } from '@/typings/internal';
import { subtraction } from '@test/_utils/math';

export let el!: HTMLDivElement;

export const elBox = {
  marginTop: 10,
  marginLeft: 20,
  borderTop: 10,
  borderLeft: 20,
  paddingTop: 10,
  paddingLeft: 20,
  height: 100,
  width: 200,
  scrollWidth: 300,
  scrollHeight: 300,
  get validArea() {
    const rect = el.getBoundingClientRect();
    const top = rect.top + el.clientTop;
    const right = rect.left + rect.width - el.clientLeft;
    const bottom = rect.top + rect.height - el.clientTop;
    const left = rect.left + el.clientLeft;
    const relativeTop = 0;
    const relativeRight = this.width;
    const relativeBottom = this.height;
    const relativeLeft = 0;
    const fromPoint: Position = [left, top];
    const toPoint: Position = [right, bottom];
    const relativeFromPoint: Position = [0, 0];
    const relativeToPoint: Position = subtraction(toPoint, fromPoint);
    return {
      top,
      right,
      bottom,
      left,
      from: fromPoint,
      to: toPoint,
      relativeTop,
      relativeRight,
      relativeBottom,
      relativeLeft,
      relativeFrom: relativeFromPoint,
      relativeTo: relativeToPoint,
    };
  },
  relative(pos: Position): Position {
    return subtraction(pos, [elBox.validArea.left, elBox.validArea.top]);
  }
};

export function setupContainer() {
  beforeEach(() => {
    el = document.createElement('div');
    el.id = 'root';
    el.style.height = `${elBox.height}px`;
    el.style.width = `${elBox.width}px`;
    el.style.margin = `${elBox.marginTop}px ${elBox.marginLeft}px`;
    el.style.borderWidth = `${elBox.borderTop}px ${elBox.borderLeft}px`;
    el.style.borderStyle = `solid`;
    el.style.border = `${elBox.borderTop}px ${elBox.borderLeft}px solid`;
    el.style.padding = `${elBox.paddingTop}px ${elBox.paddingLeft}px`;
    el.style.overflow = 'auto';
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
    //@ts-ignore
    el = undefined;
  });

  return el;
}

export function makeContainerScrollable() {
  const child = document.createElement('div');
  child.style.width = '300px';
  child.style.height = '300px';
  el.appendChild(child);
}