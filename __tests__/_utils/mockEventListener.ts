import { afterTest } from './afterTest';

export function createEventListener(target: HTMLElement | Document | Window) {
  // use 'as' statement reason:
  // typescript can't recognize right type when we calling target.addEventListener("mousedown", ...)
  target = target as HTMLElement;
  const originAddEventListener = target.addEventListener.bind(target);
  const addEventListener = spyOn(target, 'addEventListener').and.callFake((...args: any[]) => {
    originAddEventListener(...args);
    // ensure every test suite has clear event listener
    afterTest(() => target.removeEventListener(...args));
  });
  const removeEventListener = spyOn(target, 'removeEventListener');

  return { originAddEventListener, addEventListener, removeEventListener };
}
