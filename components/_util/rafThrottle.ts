// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rafThrottle = <T extends (...args: any) => any>(callback: T, immediate = true) => {
  let requestId: number | null = null;
  let result: ReturnType<T> | undefined = undefined;
  const throttled = function (this: ThisType<T>, ...args: Parameters<T>) {
    if (immediate) {
      immediate = false;
      return callback.apply(this, args);
    }
    if (!requestId) {
      requestId = requestAnimationFrame(() => {
        requestId = null;
        result = callback.apply(this, args);
      });
    }
    return result;
  };

  throttled.cancel = () => {
    // type guard not working when using Nullish Coalescing(??) operator
    requestId !== null && cancelAnimationFrame(requestId);
    requestId = null;
  };

  return throttled;
};
