import { Fn } from '../typings/internal';

export default function rafInterval(fn: Fn, immediate = true) {
  let id: number | undefined = undefined;
  let stopped = false;
  function loop() {
    if (immediate) {
      fn();
    }
    id = requestAnimationFrame(() => {
      if (!immediate) {
        fn();
      }
      // fn may be call stop function, we should check stopped value
      if (!stopped) {
        loop();
      }
    });
  }

  loop();

  return () => {
    if (id) {
      cancelAnimationFrame(id);
      id = undefined;
      stopped = true;
    }
  };
}
