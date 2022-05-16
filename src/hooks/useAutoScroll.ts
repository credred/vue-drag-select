import { Ref, unref, watchEffect } from 'vue';
import { MaybeNullableRef, Position } from '../typings/internal';
import { findScrollableParent } from '../utils/findScrollableParent';
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
}

function targetScrolledTotally(target: HTMLElement, xVelocity: number, yVelocity: number) {
  return (
    (xVelocity === 0 ||
      (xVelocity < 0 && target.scrollLeft === 0) ||
      (xVelocity > 0 && target.scrollWidth - target.clientWidth - target.scrollLeft < 1)) &&
    (yVelocity === 0 ||
      (yVelocity < 0 && target.scrollTop === 0) ||
      (yVelocity > 0 && target.scrollHeight - target.clientHeight - target.scrollTop < 1))
  );
}

function doAutoScrollByOffset(target: HTMLElement, offset: Position, options?: AutoScrollOption) {
  const { maxScrollPadding = 30, minScrollVelocity = 2, maxScrollVelocity = 5 } = options || {};
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
  const stop = rafInterval(() => {
    target.scrollLeft += xVelocity;
    target.scrollTop += yVelocity;

    if (targetScrolledTotally(target, xVelocity, yVelocity)) {
      stop();
    }
  });

  return stop;
}

export function usePointAutoScroll(
  target: MaybeNullableRef<HTMLElement>,
  enable: Ref<boolean>,
  pointRef: Ref<Position>,
  options?: AutoScrollOption
) {
  const { scrollGutter = 0 } = options || {};

  let stop = noop;
  const start = () => {
    stop = watchEffect((onCleanup) => {
      const targetDOM = unref(target);
      const point = unref(pointRef);
      if (!targetDOM) return;
      const scrollableDom = findScrollableParent(targetDOM);
      if (!scrollableDom) return;
      const rect = scrollableDom.getBoundingClientRect();

      const scrollableEdge = {
        top: rect.top + scrollableDom.clientTop + scrollGutter,
        bottom: rect.top + scrollableDom.clientTop + scrollableDom.clientHeight - scrollGutter,
        left: rect.left + scrollableDom.clientLeft + scrollGutter,
        right: rect.left + scrollableDom.clientLeft + scrollableDom.clientWidth - scrollGutter,
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
        onCleanup(doAutoScrollByOffset(scrollableDom, [offsetX, offsetY], options));
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
