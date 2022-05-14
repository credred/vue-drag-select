import { Position } from '@/typings/internal';
import userEvent from '@testing-library/user-event';

function pointerPress(name: 'pointerdown' | 'pointerup', x: number, y: number) {
  return userEvent.pointer({
    keyDef: {
      name,
      pointerType: 'mouse',
    },
    target: document.elementFromPoint(x, y) || document.documentElement,
    releaseSelf: false,
    releasePrevious: false,
    coords: {
      x,
      y,
    },
  });
}

export function pointerMove(x: number, y: number) {
  return userEvent.pointer({
    target: document.elementFromPoint(x, y) || document.documentElement,
    coords: {
      x,
      y,
      isPrimary: true,
    },
  });
}

export function pointerdown(x: number, y: number) {
  return pointerPress('pointerdown', x, y);
}
export function pointerup(x: number, y: number) {
  return pointerPress('pointerup', x, y);
}

interface DragOption {
  duration?: number;
  interval?: number;
  onBeforeStart?: () => void;
  onStart?: () => void;
  onBeforeMove?: (currentPos: Position, nextPos: Position) => void;
  onMove?: (currentPos: Position, prevPos: Position) => void;
  onBeforeEnd?: () => void;
  onEnd?: () => void;
}

async function slideMove(from: Position, to: Position, option: DragOption) {
  const { duration = 100, interval = 20 } = option;
  const [[x1, y1], [x2, y2]] = [from, to];
  const num = duration / interval;
  const [x, y] = [(x2 - x1) / num, (y2 - y1) / num];
  let currentPos: Position = [x1, y1];
  for await (const i of Array.from({ length: num }, (_, index) => index + 1)) {
    const nextPos: Position = [x1 + i * x, y1 + i * y];
    option.onBeforeMove?.(currentPos, nextPos);
    await pointerMove(...nextPos);
    option.onMove?.(nextPos, currentPos);
    currentPos = nextPos;
  }
}

export async function drag(from: Position, to: Position, option: DragOption) {
  option.onBeforeStart?.();
  await pointerdown(...from);
  option.onStart?.();
  await slideMove(from, to, option);
  option.onBeforeEnd?.();
  await pointerup(...to);
}