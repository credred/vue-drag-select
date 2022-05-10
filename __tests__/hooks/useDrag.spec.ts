import { useDrag } from '@/hooks/useDrag';
import { strictEq } from '../_utils/asymmetricMatch';
import { createEventListener } from '../_utils/mockEventListener';

const createPointerEvent = (type: string, eventInitDict?: PointerEventInit) => {
  return new PointerEvent(type, {
    isPrimary: true,
    ...eventInitDict,
  });
}

describe('hooks/useDrag', () => {
  it('should trigger onStart callback after pointerdown event was triggered', () => {
    const el = document.createElement('div');
    const handler = jasmine.createSpy();

    useDrag(el, {
      onStart: handler,
    });

    el.dispatchEvent(createPointerEvent('pointerdown'));

    expect(handler).toHaveBeenCalled();
  });

  it('should not register any event listener when onStart callback return false', () => {
    const el = document.createElement('div');
    const handler = jasmine.createSpy().and.returnValue(false);

    useDrag(el, {
      onStart: handler,
    });

    const { addEventListener } = createEventListener(window);

    el.dispatchEvent(createPointerEvent('pointerdown'));
    expect(addEventListener).not.toHaveBeenCalled();

    handler.and.returnValue(true);
    el.dispatchEvent(createPointerEvent('pointerdown'));
    expect(addEventListener).toHaveBeenCalled();
  });

  it('should trigger onMove callback after pointerdown event was triggered and then pointermove event was triggered', () => {
    const el = document.createElement('div');
    const handler = jasmine.createSpy();

    useDrag(el, {
      onMove: handler,
    });

    window.dispatchEvent(createPointerEvent('pointermove'));
    expect(handler).not.toHaveBeenCalled();

    el.dispatchEvent(createPointerEvent('pointerdown'));
    window.dispatchEvent(createPointerEvent('pointermove'));
    expect(handler).toHaveBeenCalled();
  });

  it('should trigger onMove callback after scroll event was triggered', () => {
    const el = document.createElement('div');
    const handler = jasmine.createSpy();

    useDrag(el, {
      onMove: handler,
    });

    window.dispatchEvent(createPointerEvent('scroll'));
    expect(handler).not.toHaveBeenCalled();

    el.dispatchEvent(createPointerEvent('pointerdown'));
    window.dispatchEvent(createPointerEvent('scroll'));
    expect(handler).toHaveBeenCalled();
  });

  it('should trigger onEnd callback after pointerup event was triggered', () => {
    const el = document.createElement('div');
    const handler = jasmine.createSpy();
    useDrag(el, {
      onEnd: handler,
    });

    window.dispatchEvent(createPointerEvent('pointerup'));
    expect(handler).not.toHaveBeenCalled();

    el.dispatchEvent(createPointerEvent('pointerdown'));
    window.dispatchEvent(createPointerEvent('pointerup'));
    expect(handler).toHaveBeenCalled();
  });

  it('should not trigger any event when the received pointer event type is not primary', () => {
    const el = document.createElement('div');
    const startHandler = jasmine.createSpy();
    const moveHandler = jasmine.createSpy();
    const endHandler = jasmine.createSpy();

    useDrag(el, {
      onStart: startHandler,
      onMove: moveHandler,
      onEnd: endHandler,
    });

    el.dispatchEvent(createPointerEvent('pointerdown', { isPrimary: false }));
    expect(startHandler).not.toHaveBeenCalled();

    el.dispatchEvent(createPointerEvent('pointerdown', { isPrimary: true }));
    expect(startHandler).toHaveBeenCalled();

    el.dispatchEvent(createPointerEvent('pointermove', { isPrimary: false }));
    expect(moveHandler).not.toHaveBeenCalled();
    el.dispatchEvent(createPointerEvent('pointerup', { isPrimary: false }));
    expect(endHandler).not.toHaveBeenCalled();
  });

  it('should trigger onMove callback with last PointerEvent after scroll event was triggered', () => {
    const el = document.createElement('div');
    const handler = jasmine.createSpy();

    useDrag(el, {
      onMove: handler,
    });

    let lastEvent = createPointerEvent('pointerdown');

    el.dispatchEvent(lastEvent);
    window.dispatchEvent(new Event('scroll'));
    expect(handler).toHaveBeenCalledWith(strictEq(lastEvent));

    lastEvent = createPointerEvent('pointermove');
    window.dispatchEvent(lastEvent);
    window.dispatchEvent(new Event('scroll'));
    expect(handler).toHaveBeenCalledWith(strictEq(lastEvent));

    lastEvent = createPointerEvent('pointermove');
    window.dispatchEvent(lastEvent);
    window.dispatchEvent(new Event('scroll'));
    expect(handler).toHaveBeenCalledWith(strictEq(lastEvent));
  });

  it('should not trigger onMove callback with the PointerEvent which not trigger onMove callback after scroll event was triggered', () => {
    const el = document.createElement('div');
    const handler = jasmine.createSpy();
    useDrag(el, {
      onMove: handler,
    });
    const pointerdownEvent = createPointerEvent('pointerdown');
    el.dispatchEvent(pointerdownEvent);
    window.dispatchEvent(new Event('scroll'));
    expect(handler).toHaveBeenCalledWith(strictEq(pointerdownEvent));

    const notPrimaryEvent = createPointerEvent('pointermove', { isPrimary: false });
    window.dispatchEvent(notPrimaryEvent);
    window.dispatchEvent(new Event('scroll'));
    expect(handler).not.toHaveBeenCalledWith(strictEq(notPrimaryEvent));

    const primaryEvent = createPointerEvent('pointermove');
    window.dispatchEvent(primaryEvent);
    window.dispatchEvent(new Event('scroll'));
    expect(handler).toHaveBeenCalledWith(strictEq(primaryEvent));
  });
});
