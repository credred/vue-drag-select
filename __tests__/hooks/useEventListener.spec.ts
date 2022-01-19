import { ref, nextTick, effectScope, Ref } from 'vue';
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

  test('should cleanup after stop callback was called', () => {
    const el = document.createElement('div');
    const stop = useEventListener(el, 'mousedown', jest.fn());
    const { removeEventListener } = createEventListener(el);
    expect(removeEventListener).toHaveBeenCalledTimes(0);
    stop();
    expect(removeEventListener).toHaveBeenCalled();
  });

  test('should pass argument to addEventListener/removeEventListener', () => {
    const el = document.createElement('div');
    const { addEventListener, removeEventListener } = createEventListener(el);

    const args = [randomStr(), jest.fn(), {}] as const;

    const stop = useEventListener(el, ...args);
    expect(addEventListener).toHaveBeenCalledWith(...args);
    stop();
    expect(removeEventListener).toHaveBeenCalledWith(...args);
  });

  test('target maybe is ref', () => {
    const el = document.createElement('div');
    const { addEventListener } = createEventListener(el);
    useEventListener(ref(el), 'mousedown', jest.fn());
    expect(addEventListener).toHaveBeenCalled();
  });

  test('should watch target change', async () => {
    const el = document.createElement('div');
    const newEl = document.createElement('div');
    const elRef = ref<HTMLElement>(el) as Ref<HTMLElement>;
    useEventListener(elRef, 'mousedown', jest.fn());
    const { removeEventListener } = createEventListener(el);
    const { addEventListener } = createEventListener(newEl);
    elRef.value = newEl;
    await nextTick();
    expect(removeEventListener).toHaveBeenCalled();
    expect(addEventListener).toHaveBeenCalled();
  });

  test('should do nothing after target change to undefined', () => {
    expect(() => {
      const el = document.createElement('div');
      const elRef = ref<HTMLElement | undefined>(el);
      useEventListener(elRef, 'mousedown', jest.fn());
      elRef.value = undefined;
    }).not.toThrow();
  });

  test('should cleanup after the scope was destroyed', () => {
    const el = document.createElement('div');
    const scope = effectScope();
    scope.run(() => {
      useEventListener(el, 'mousedown', jest.fn());
    });
    const { removeEventListener } = createEventListener(el);
    scope.stop();
    expect(removeEventListener).toHaveBeenCalled();
  });

  test('should not cleanup again after call stop callback again', () => {
    const el = document.createElement('div');
    const stop = useEventListener(el, 'mousedown', jest.fn());
    const { removeEventListener } = createEventListener(el);
    stop();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
    stop();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
  });
});
