import { Position } from '@/typings/internal';
import userEvent from '@testing-library/user-event';

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

export async function pointerdown(x: number, y: number, target?: Element | null) {
  const user = userEvent.setup();

  const keyDef = {
    name: 'pointerdown',
    pointerType: 'mouse',
    button: 'primary',
  } as const;
  await user.pointer({
    keyDef,
    target: target || document.elementFromPoint(x, y) || document.documentElement,
    releaseSelf: false,
    releasePrevious: false,
    coords: {
      x,
      y,
    },
  });

  return function pointerup(newX?: number, newY?: number, newTarget?: Element | null) {
    return user.pointer({
      keyDef,
      target: newTarget || document.elementFromPoint(newX ?? x, newY ?? y) || document.documentElement,
      releasePrevious: true,
      coords: {
        x,
        y,
      },
    });
  };
}

export async function click(x: number, y: number) {
  const downTarget = document.elementFromPoint(x, y);
  const pointerup = await pointerdown(x, y, downTarget);
  const upTarget = document.elementFromPoint(x, y);
  await pointerup(x, y, upTarget);
  if (downTarget && upTarget && downTarget !== upTarget) {
    let commonParent: Element = document.documentElement;
    const upTargetParents: Set<Element> = new Set();
    let upTargetParent: Element | null = upTarget;
    while (upTargetParent) {
      upTargetParents.add(upTargetParent);
      upTargetParent = upTargetParent.parentElement;
    }
    let downTargetParent: Element | null = downTarget;
    while (downTargetParent) {
      if (upTargetParents.has(downTargetParent)) {
        commonParent = downTargetParent;
        break;
      }
      downTargetParent = downTargetParent.parentElement;
    }
    // user-event not trigger click event if downTarget is not upTarget
    // but browser will pick their common parent as click event target
    await userEvent.click(commonParent);
  }
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
  const pointerup = await pointerdown(...from);
  option.onStart?.();
  await slideMove(from, to, option);
  option.onBeforeEnd?.();
  await pointerup(...to);
}
