import { useDrag } from '@/hooks/useDrag';
import { createEventListener } from '../_utils/mockEventListener';

describe('hooks/useDrag', () => {
  test('should trigger onStart callback after pointerdown event was triggered', () => {
    const el = document.createElement('div');
    const handler = jest.fn();

    useDrag(el, {
      onStart: handler,
    });

    el.dispatchEvent(new PointerEvent('pointerdown'));

    expect(handler).toHaveBeenCalled();
  });

  test('should not register any event listener when onStart callback return false', () => {
    const el = document.createElement('div');
    const handler = jest.fn().mockReturnValue(false);

    useDrag(el, {
      onStart: handler,
    });

    const { addEventListener } = createEventListener(window);

    el.dispatchEvent(new PointerEvent('pointerdown'));
    expect(addEventListener).not.toHaveBeenCalled();

    handler.mockReturnValue(true);
    el.dispatchEvent(new PointerEvent('pointerdown'));
    expect(addEventListener).toHaveBeenCalled();
  });

  test('should trigger onMove callback after pointerdown event was triggered and then pointermove event was triggered', () => {
    const el = document.createElement('div');
    const handler = jest.fn();

    useDrag(el, {
      onMove: handler,
    });

    window.dispatchEvent(new PointerEvent('pointermove'));
    expect(handler).not.toHaveBeenCalled();

    el.dispatchEvent(new PointerEvent('pointerdown'));
    window.dispatchEvent(new PointerEvent('pointermove'));
    expect(handler).toHaveBeenCalled();
  });

  test('should trigger onMove callback after scroll event was triggered', () => {
    const el = document.createElement('div');
    const handler = jest.fn();

    useDrag(el, {
      onMove: handler,
    });

    window.dispatchEvent(new PointerEvent('scroll'));
    expect(handler).not.toHaveBeenCalled();

    el.dispatchEvent(new PointerEvent('pointerdown'));
    window.dispatchEvent(new PointerEvent('scroll'));
    expect(handler).toHaveBeenCalled();
  });

  test('should trigger onEnd callback after pointerup event was triggered', () => {
    const el = document.createElement('div');
    const handler = jest.fn();

    useDrag(el, {
      onEnd: handler,
    });

    window.dispatchEvent(new PointerEvent('pointerup'));
    expect(handler).not.toHaveBeenCalled();

    el.dispatchEvent(new PointerEvent('pointerdown'));
    window.dispatchEvent(new PointerEvent('pointerup'));
    expect(handler).toHaveBeenCalled();
  });

  test('should not trigger any event when the received pointer event type is not primary', () => {
    const el = document.createElement('div');
    const startHandler = jest.fn();
    const moveHandler = jest.fn();
    const endHandler = jest.fn();

    useDrag(el, {
      onStart: startHandler,
      onMove: moveHandler,
      onEnd: endHandler,
    });

    el.dispatchEvent(new PointerEvent('pointerdown', { isPrimary: false }));
    expect(startHandler).not.toHaveBeenCalled();

    el.dispatchEvent(new PointerEvent('pointerdown', { isPrimary: true }));
    expect(startHandler).toHaveBeenCalled();

    el.dispatchEvent(new PointerEvent('pointermove', { isPrimary: false }));
    expect(moveHandler).not.toHaveBeenCalled();
    el.dispatchEvent(new PointerEvent('pointerup', { isPrimary: false }));
    expect(endHandler).not.toHaveBeenCalled();
  });

  test('should trigger onMove callback with last PointerEvent after scroll event was triggered', () => {
    const el = document.createElement('div');
    const handler = jest.fn();

    useDrag(el, {
      onMove: handler,
    });

    let lastEvent = new PointerEvent('pointerdown');

    el.dispatchEvent(lastEvent);
    window.dispatchEvent(new Event('scroll'));
    expect(handler).toHaveBeenCalledWith(lastEvent);

    lastEvent = new PointerEvent('pointermove');
    window.dispatchEvent(new Event('scroll'));
    expect(handler).toHaveBeenCalledWith(lastEvent);

    lastEvent = new PointerEvent('pointermove');
    window.dispatchEvent(new Event('scroll'));
    expect(handler).toHaveBeenCalledWith(lastEvent);
  });

  test('should not trigger onMove callback with the PointerEvent which not trigger onMove callback after scroll event was triggered', () => {
    const el = document.createElement('div');
    const handler = jest.fn();

    useDrag(el, {
      onMove: handler,
    });

    const pointerdownEvent = new PointerEvent('pointerdown');

    el.dispatchEvent(pointerdownEvent);
    window.dispatchEvent(new Event('scroll'));

    expect(handler).toHaveBeenCalledWith(pointerdownEvent);
    const notPrimaryEvent = new PointerEvent('pointermove', { isPrimary: false });
    window.dispatchEvent(new Event('scroll'));
    expect(handler).not.toHaveBeenCalledWith(notPrimaryEvent);

    const primaryEvent = new PointerEvent('pointermove');
    window.dispatchEvent(new Event('scroll'));
    expect(handler).toHaveBeenCalledWith(primaryEvent);
  });
});
