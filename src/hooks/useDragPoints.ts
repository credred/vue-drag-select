import { ref, Ref, computed, unref } from 'vue';
import { Position } from '../typings/internal';
import { useDrag } from './useDrag';

type DragStatus = 'start' | 'ing' | 'end';

export function useDragPoints(target: Ref<HTMLElement | undefined>) {
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
    preventDefault: true,
    onStart(e) {
      if (dragStatus.value !== 'end') return;
      const targetDOM = unref(target);
      if (targetDOM) {
        const rect = targetDOM.getBoundingClientRect();
        fromPoint.value = [e.clientX - rect.left, e.clientY - rect.top];
        fromPosition.value = [e.pageX, e.pageY];
        toPostion.value = [e.pageX, e.pageY];
      }
    },
    onMove(e) {
      dragStatus.value = 'ing';
      toPostion.value = [e.pageX, e.pageY];
    },
    onEnd() {
      dragStatus.value = 'end';
      fromPoint.value = [0, 0];
      fromPosition.value = [0, 0];
      toPostion.value = [0, 0];
    },
  });

  return { fromPoint, toPoint, dragStatus, stop };
}
