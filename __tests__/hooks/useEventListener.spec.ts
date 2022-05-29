import { ref, nextTick, effectScope } from 'vue';
import { useEventListener } from '@/hooks/useEventListener';
import { createEventListener } from '../_utils/mockEventListener';
import { randomStr } from '../_utils/randomStr';

describe('useEventListener', () => {
  it('basic usage', () => {
    const el = document.createElement('div');
    const handler = jasmine.createSpy();
    useEventListener(el, 'mousedown', handler, true);

    el.dispatchEvent(new MouseEvent('mousedown'));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should cleanup after stop callback was called', () => {
    const el = document.createElement('div');
    const stop = useEventListener(el, 'mousedown', jasmine.createSpy());
    const { removeEventListener } = createEventListener(el);

    expect(removeEventListener).toHaveBeenCalledTimes(0);
    stop();

    expect(removeEventListener).toHaveBeenCalled();
  });

  it('should pass argument to addEventListener/removeEventListener', () => {
    const el = document.createElement('div');
    const { addEventListener, removeEventListener } = createEventListener(el);

    const args = [randomStr(), jasmine.createSpy(), {}] as const;

    const stop = useEventListener(el, ...args);

    expect(addEventListener).toHaveBeenCalledWith(...args);
    stop();

    expect(removeEventListener).toHaveBeenCalledWith(...args);
  });

  it('target maybe is ref', () => {
    const el = document.createElement('div');
    const { addEventListener } = createEventListener(el);
    useEventListener(ref(el), 'mousedown', jasmine.createSpy());

    expect(addEventListener).toHaveBeenCalled();
  });

  it('should watch target change', async () => {
    const el = document.createElement('div');
    const newEl = document.createElement('div');
    const elRef = ref<HTMLElement>(el);
    useEventListener(elRef, 'mousedown', jasmine.createSpy());
    const { removeEventListener } = createEventListener(el);
    const { addEventListener } = createEventListener(newEl);
    elRef.value = newEl;
    await nextTick();

    expect(removeEventListener).toHaveBeenCalled();
    expect(addEventListener).toHaveBeenCalled();
  });

  it('should do nothing after target change to undefined', () => {
    expect(() => {
      const el = document.createElement('div');
      const elRef = ref<HTMLElement | undefined>(el);
      useEventListener(elRef, 'mousedown', jasmine.createSpy());
      elRef.value = undefined;
    }).not.toThrow();
  });

  it('should cleanup after the scope was destroyed', () => {
    const el = document.createElement('div');
    const scope = effectScope();
    scope.run(() => {
      useEventListener(el, 'mousedown', jasmine.createSpy());
    });
    const { removeEventListener } = createEventListener(el);
    scope.stop();

    expect(removeEventListener).toHaveBeenCalled();
  });

  it('should not cleanup again after call stop callback again', () => {
    const el = document.createElement('div');
    const stop = useEventListener(el, 'mousedown', jasmine.createSpy());
    const { removeEventListener } = createEventListener(el);
    stop();

    expect(removeEventListener).toHaveBeenCalledTimes(1);
    stop();

    expect(removeEventListener).toHaveBeenCalledTimes(1);
  });
});
