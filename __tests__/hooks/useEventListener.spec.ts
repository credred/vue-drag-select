import { ref, nextTick, effectScope } from 'vue';
import { useEventListener } from '@/hooks/useEventListener';
import { mockFn } from '../_utils/mockFn';
import { createEventListener } from '../_utils/mockEventListener';
import { randomStr } from '../_utils/randomStr';

describe('useEventListener', () => {
  test('basic usage', () => {
    const el = document.createElement('div');
    useEventListener(el, 'mousedown', mockFn, true);

    el.dispatchEvent(new MouseEvent('mousedown'));

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should pass argument to addEventListener/removeEventListener', () => {
    const el = document.createElement('div');
    const { addEventListener, removeEventListener } = createEventListener(el);

    const args = [randomStr(), jest.fn(), {}] as const;

    const stop = useEventListener(el, ...args);
    expect(addEventListener).toHaveBeenCalledWith(...args);
    expect(removeEventListener).toHaveBeenCalledTimes(0);
    stop();
    expect(removeEventListener).toHaveBeenCalledWith(...args);
  });

  test('target maybe is ref', () => {
    const el = document.createElement('div');
    const { addEventListener } = createEventListener(el);
    useEventListener(ref(el), 'mousedown', jest.fn());
    expect(addEventListener).toHaveBeenCalled();
  });

  test('should cleanup after the target becomes undefined/null', async () => {
    const el = document.createElement('div');
    const elRef = ref<HTMLElement | undefined>(el);
    useEventListener(elRef, 'mousedown', jest.fn());
    const { removeEventListener } = createEventListener(el);
    expect(removeEventListener).toHaveBeenCalledTimes(0);

    elRef.value = undefined;
    await nextTick();
    expect(removeEventListener).toHaveBeenCalled();
  });

  test('should cleanup after the scope was destroyed', () => {
    const el = document.createElement('div');
    const scope = effectScope();
    scope.run(() => {
      useEventListener(el, 'mousedown', jest.fn());
    });
    const { removeEventListener } = createEventListener(el);
    expect(removeEventListener).toHaveBeenCalledTimes(0);
    scope.stop();
    expect(removeEventListener).toHaveBeenCalled();
  });
});
