/* eslint-disable jasmine/no-unsafe-spy */
import { afterTest } from './afterTest';

export function createEventListener(target: HTMLElement | Document | Window) {
  // use 'as' statement reason:
  // typescript can't recognize right type when we calling target.addEventListener("mousedown", ...)
  target = target as HTMLElement;
  const originAddEventListener = target.addEventListener.bind(target);
  const addEventListener = spyOn(target, 'addEventListener').and.callFake((...args: unknown[]) => {
    //@ts-expect-error parameter transparent transmission
    originAddEventListener(...args);
    // ensure every test suite has clear event listener
    //@ts-expect-error parameter transparent transmission
    afterTest(() => target.removeEventListener(...args));
  });
  const removeEventListener = spyOn(target, 'removeEventListener');

  return { originAddEventListener, addEventListener, removeEventListener };
}
