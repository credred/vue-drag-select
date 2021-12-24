import { Ref, unref, computed, CSSProperties } from 'vue';
import { MaybeRef, Position, Rect } from '../typings/internal';
import { clipNumber } from '../utils/clipNumber';
import { toRect } from '../utils/toRect';
import { useDragPoints } from './useDragPoints';

function limitPoint(contentRef: Ref<HTMLElement | undefined>, pointRef: MaybeRef<Position>): Position {
  const [content, point] = [unref(contentRef), unref(pointRef)];
  return [
    clipNumber(content?.clientWidth ?? Infinity, 0, point[0]),
    clipNumber(content?.clientHeight ?? Infinity, 0, point[1]),
  ];
}

export function useDragRect(contentRef: Ref<HTMLElement | undefined>) {
  const { fromPoint, toPoint, dragStatus, stop } = useDragPoints(contentRef);

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
