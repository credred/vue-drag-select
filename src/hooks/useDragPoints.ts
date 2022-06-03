import { effectScope, ref, unref, watchEffect } from 'vue';
import { MaybeNullableRef, MaybeRef, Position } from '../typings/internal';
import { useDrag, UseDragOptions } from './useDrag';

export interface UseDragPointsOptions extends Omit<UseDragOptions, 'preventDefault' | 'onStart'> {
  disabled?: MaybeRef<boolean>;
  /**
   * Callback when the dragging starts. Return `false` to prevent dragging.
   */
  onStart?: (event: PointerEvent, fromPoint: Position) => void | false;
}

export function useDragPoints(target: MaybeNullableRef<HTMLElement | SVGElement>, options: UseDragPointsOptions = {}) {
  const isDragging = ref(false);

  // only working for single pointer
  const fromPoint = ref<Position>([0, 0]);
  const toPoint = ref<Position>([0, 0]);

  // flatten nested watch https://github.com/vuejs/core/issues/5783
  const effect = effectScope();

  const stop = watchEffect((onCleanup) => {
    if (unref(options.disabled)) return;
    effect.run(() => {
      const stopDragListener = useDrag(target, {
        ...options,
        preventDefault: true,
        onStart(e) {
          if (isDragging.value) return false;
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
          toPoint.value = _fromPoint;
        },
        onMove(e) {
          isDragging.value = true;
          const targetDOM = unref(target);
          if (!targetDOM) return;
          const rect = targetDOM.getBoundingClientRect();
          toPoint.value = [
            e.clientX - rect.left - targetDOM.clientLeft + targetDOM.scrollLeft,
            e.clientY - rect.top - targetDOM.clientTop + targetDOM.scrollTop,
          ];
          options.onMove?.(e);
        },
        onEnd(e) {
          isDragging.value = false;
          fromPoint.value = [0, 0];
          toPoint.value = [0, 0];
          options.onEnd?.(e);
        },
      });
      onCleanup(stopDragListener);
    });
  });

  return { fromPoint, toPoint, isDragging, stop };
}
