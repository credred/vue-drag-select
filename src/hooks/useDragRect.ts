import { unref, computed, CSSProperties } from 'vue';
import { MaybeNullableRef, MaybeRef, Position, Rect } from '../typings/internal';
import { clipNumber } from '../utils/clipNumber';
import { toRect } from '../utils/toRect';
import { useDragPoints, UseDragPointsOptions } from './useDragPoints';

function pointInRect(contentRef: MaybeNullableRef<HTMLElement | SVGElement>, pointRef: MaybeRef<Position>): boolean {
  const [content, [x, y]] = [unref(contentRef), unref(pointRef)];
  if (!content) {
    return false;
  }
  const { clientLeft, clientWidth, clientTop, clientHeight } = content;
  return clientLeft < x && clientLeft + clientWidth > x && clientTop < y && clientTop + clientHeight > y;
}

function limitPoint(contentRef: MaybeNullableRef<HTMLElement | SVGElement>, pointRef: MaybeRef<Position>): Position {
  const [content, [x, y]] = [unref(contentRef), unref(pointRef)];
  if (!content) {
    return [0, 0];
  }
  const { clientLeft, clientWidth, clientTop, clientHeight } = content;
  return [clipNumber(clientLeft + clientWidth, clientLeft, x), clipNumber(clientTop + clientHeight, clientTop, y)];
}

export interface UseDragRectOptions extends Omit<UseDragPointsOptions, 'onStart'> {
  /**
   * Callback when the dragging starts. Return `false` to prevent dragging.
   */
  onStart?: (event: PointerEvent) => void | false;
}

export function useDragRect(contentRef: MaybeNullableRef<HTMLElement | SVGElement>, options: UseDragRectOptions = {}) {
  const { fromPoint, toPoint, dragStatus, stop } = useDragPoints(contentRef, {
    ...options,
    onStart(e, fromPoint) {
      if (!pointInRect(contentRef, fromPoint)) {
        return false;
      }
      if (options.onStart?.(e) === false) {
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
