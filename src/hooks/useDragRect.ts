import { Ref, unref, computed, CSSProperties } from 'vue';
import { MaybeRef, Position, Rect } from '../typings/internal';
import { clipNumber } from '../utils/clipNumber';
import { toRect } from '../utils/toRect';
import { useDragPoints } from './useDragPoints';

function pointInRect(contentRef: Ref<HTMLElement | undefined>, pointRef: MaybeRef<Position>): boolean {
  const [content, [x, y]] = [unref(contentRef), unref(pointRef)];
  if (!content) {
    return false;
  }
  const { clientLeft, clientWidth, clientTop, clientHeight } = content;
  return clientLeft < x && clientLeft + clientWidth > x && clientTop < y && clientTop + clientHeight > y;
}

function limitPoint(contentRef: Ref<HTMLElement | undefined>, pointRef: MaybeRef<Position>): Position {
  const [content, [x, y]] = [unref(contentRef), unref(pointRef)];
  if (!content) {
    return [0, 0];
  }
  const { clientLeft, clientWidth, clientTop, clientHeight } = content;
  return [clipNumber(clientLeft + clientWidth, clientLeft, x), clipNumber(clientTop + clientHeight, clientTop, y)];
}

export function useDragRect(contentRef: Ref<HTMLElement | undefined>) {
  const { fromPoint, toPoint, dragStatus, stop } = useDragPoints(contentRef, {
    onStart(_, fromPoint) {
      if (!pointInRect(contentRef, fromPoint)) {
        return false;
      }
    },
  });

  const rect = computed<Rect | undefined>(() => {
    if (dragStatus.value === 'ing') {
      return toRect(unref(fromPoint), limitPoint(contentRef, toPoint));
    } else {
      return undefined;
    }
  });

  const style = computed<CSSProperties>(() => {
    if (dragStatus.value === 'ing' && rect.value) {
      const { left, top, width, height } = rect.value;
      return {
        position: 'absolute',
        boxSizing: 'border-box',
        touchAction: 'none',
        top: 0,
        left: 0,
        transform: `translate(${left}px, ${top}px)`,
        width: `${width}px`,
        height: `${height}px`,
      };
    } else {
      return {
        display: 'none',
      };
    }
  });

  return { fromPoint, toPoint, style, rect, dragStatus, stop };
}
