import { ref, Ref, computed, unref } from 'vue';
import { Position } from '../typings/internal';
import { useDrag } from './useDrag';

type DragStatus = 'start' | 'ing' | 'end';

export function useDragPoints(target: Ref<HTMLElement | undefined>) {
  const dragStatus = ref<DragStatus>('end');

  // only working for single pointer
  const fromPoint = ref<Position>([0, 0]);
  const fromClientPositon = ref<Position>([0, 0]);
  const toClientPositon = ref<Position>([0, 0]);
  const toPoint = computed<Position>(() => [
    unref(toClientPositon)[0] - unref(fromClientPositon)[0] + unref(fromPoint)[0],
    unref(toClientPositon)[1] - unref(fromClientPositon)[1] + unref(fromPoint)[1],
  ]);

  const stop = useDrag(target, {
    preventDefault: true,
    onStart(e) {
      if (dragStatus.value !== 'end') return;
      const targetDOM = unref(target);
      if (targetDOM) {
        const rect = targetDOM.getBoundingClientRect();
        fromPoint.value = [e.pageX - rect.left, e.pageY - rect.top];
        fromClientPositon.value = [e.clientX, e.clientY];
        toClientPositon.value = [e.clientX, e.clientY];
      }
    },
    onMove(e) {
      dragStatus.value = 'ing';
      toClientPositon.value = [e.clientX, e.clientY];
    },
    onEnd() {
      dragStatus.value = 'end';
      fromPoint.value = [0, 0];
      fromClientPositon.value = [0, 0];
      toClientPositon.value = [0, 0];
    },
  });

  return { fromPoint, toPoint, dragStatus, stop };
}
