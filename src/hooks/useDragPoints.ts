import { ref, Ref, computed, unref } from 'vue';
import { Position } from '../typings/internal';
import { useDrag, UseDragOptions } from './useDrag';

type DragStatus = 'start' | 'ing' | 'end';

type UseDragPointsOptions = Omit<UseDragOptions, 'preventDefault'>;

export function useDragPoints(target: Ref<HTMLElement | undefined>, options: UseDragPointsOptions = {}) {
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
      if (options.onStart?.(e) === false) {
        return false;
      }
      const rect = targetDOM.getBoundingClientRect();
      fromPoint.value = [e.clientX - rect.left, e.clientY - rect.top];
      fromPosition.value = [e.pageX, e.pageY];
      toPostion.value = [e.pageX, e.pageY];
    },
    onMove(e) {
      options.onMove?.(e);
      dragStatus.value = 'ing';
      toPostion.value = [e.pageX, e.pageY];
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
