import { ref, computed, unref } from 'vue';
import { MaybeNullableRef, Position } from '../typings/internal';
import { useDrag, UseDragOptions } from './useDrag';

type DragStatus = 'start' | 'ing' | 'end';

export interface UseDragPointsOptions extends Omit<UseDragOptions, 'preventDefault' | 'onStart'> {
  /**
   * Callback when the dragging starts. Return `false` to prevent dragging.
   */
  onStart?: (event: PointerEvent, fromPoint: Position) => void | false;
}

export function useDragPoints(target: MaybeNullableRef<HTMLElement | SVGElement>, options: UseDragPointsOptions = {}) {
  const dragStatus = ref<DragStatus>('end');

  // only working for single pointer
  const fromPoint = ref<Position>([0, 0]);
  const fromPosition = ref<Position>([0, 0]);
  const toPostion = ref<Position>([0, 0]);
  const toPoint = computed<Position>(() => [
    unref(toPostion)[0] - unref(fromPosition)[0] + unref(fromPoint)[0],
    unref(toPostion)[1] - unref(fromPosition)[1] + unref(fromPoint)[1],
  ]);

  const stop = useDrag(target, {
    ...options,
    preventDefault: true,
    onStart(e) {
      if (dragStatus.value !== 'end') return false;
      const targetDOM = unref(target);
      if (!targetDOM) return false;
      const rect = targetDOM.getBoundingClientRect();
      const _fromPoint: Position = [
        e.clientX - rect.left - targetDOM.clientLeft + targetDOM.scrollLeft,
        e.clientY - rect.top - targetDOM.clientTop + targetDOM.scrollTop,
      ];
      if (options.onStart?.(e, _fromPoint) === false) {
        return false;
      }
      fromPoint.value = _fromPoint;
      fromPosition.value = _fromPoint;
      toPostion.value = _fromPoint;
    },
    onMove(e) {
      options.onMove?.(e);
      dragStatus.value = 'ing';
      const targetDOM = unref(target);
      if (!targetDOM) return;
      const rect = targetDOM.getBoundingClientRect();
      toPostion.value = [
        e.clientX - rect.left - targetDOM.clientLeft + targetDOM.scrollLeft,
        e.clientY - rect.top - targetDOM.clientTop + targetDOM.scrollTop,
      ];
    },
    onEnd(e) {
      options.onEnd?.(e);
      dragStatus.value = 'end';
      fromPoint.value = [0, 0];
      fromPosition.value = [0, 0];
      toPostion.value = [0, 0];
    },
  });

  return { fromPoint, toPoint, dragStatus, stop };
}
