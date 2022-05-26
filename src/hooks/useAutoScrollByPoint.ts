import { unref, watchEffect } from 'vue';
import { Fn, MaybeNullableRef, MaybeRef, Position } from '../typings/internal';
import doesElementScrollable from '../utils/doesElementScrollable';
import doesElementScrolledTotally from '../utils/doesElementScrolledTotally';
import { noop } from '../utils/noop';
import rafInterval from '../utils/rafInterval';
import { tryOnScopeDispose } from '../utils/tryOnScopeDispose';

interface AutoScrollOption {
  scrollGutter?: number;
  // maximum distance moved in one second
  maxScrollVelocity?: number;
  // minimum distance moved in one second
  minScrollVelocity?: number;
  maxScrollPadding?: number;
  /** on auto scroll end */
  onEnd?: Fn;
}

function doAutoScrollByOffset(target: HTMLElement, offset: Position, options: AutoScrollOption = {}) {
  const { maxScrollPadding = 30, minScrollVelocity = 2, maxScrollVelocity = 5, onEnd } = options;
  const [offsetX, offsetY] = offset;
  const [xVelocity, yVelocity] = [
    Math.sign(offsetX) *
      Math.max(
        minScrollVelocity,
        Math.min(maxScrollVelocity, Math.abs(offsetX) * (maxScrollVelocity / maxScrollPadding))
      ),
    Math.sign(offsetY) *
      Math.max(
        minScrollVelocity,
        Math.min(maxScrollVelocity, Math.abs(offsetY) * (maxScrollVelocity / maxScrollPadding))
      ),
  ];
  let stop = noop;
  if (!doesElementScrolledTotally(target, { x: xVelocity, y: yVelocity })) {
    stop = rafInterval(() => {
      target.scrollLeft += xVelocity;
      target.scrollTop += yVelocity;
      if (doesElementScrolledTotally(target, { x: xVelocity, y: yVelocity })) {
        stop();
        onEnd?.();
      }
    });
  }

  return stop;
}

export default function useAutoScrollByPoint(
  target: MaybeNullableRef<HTMLElement>,
  enable: MaybeRef<boolean>,
  pointRef: MaybeRef<Position>,
  options?: AutoScrollOption
) {
  const { scrollGutter = 0 } = options || {};

  let stop = noop;
  const start = () => {
    stop = watchEffect((onCleanup) => {
      const targetDOM = unref(target);
      const point = unref(pointRef);
      if (!targetDOM || !doesElementScrollable(targetDOM)) return;
      const rect = targetDOM.getBoundingClientRect();

      const scrollableEdge = {
        top: rect.top + targetDOM.clientTop + scrollGutter,
        bottom: rect.top + targetDOM.clientTop + targetDOM.clientHeight - scrollGutter,
        left: rect.left + targetDOM.clientLeft + scrollGutter,
        right: rect.left + targetDOM.clientLeft + targetDOM.clientWidth - scrollGutter,
      };

      const [x, y] = point;
      let offsetX = 0;
      let offsetY = 0;
      if (x < scrollableEdge.left) {
        offsetX = x - scrollableEdge.left;
      } else if (x > scrollableEdge.right) {
        offsetX = x - scrollableEdge.right;
      }
      if (y < scrollableEdge.top) {
        offsetY = y - scrollableEdge.top;
      } else if (y > scrollableEdge.bottom) {
        offsetY = y - scrollableEdge.bottom;
      }
      if (offsetX !== 0 || offsetY !== 0) {
        onCleanup(doAutoScrollByOffset(targetDOM, [offsetX, offsetY], options));
      }
    });
  };

  tryOnScopeDispose(stop);

  return watchEffect((onCleanup) => {
    onCleanup(stop);
    if (!unref(enable)) {
      stop();
    } else {
      start();
    }
  });
}
