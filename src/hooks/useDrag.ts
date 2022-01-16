import { unref } from 'vue';
import { useEventListener } from './useEventListener';
import { MaybeNullableRef, MaybeRef, PointerType } from '../typings/internal';
import { noop } from '../utils/noop';
import { tryOnScopeDispose } from '../utils/tryOnScopeDispose';

export interface UseDragOptions {
  /**
   * Only start the dragging when click on the element directly
   *
   * @default false
   */
  exact?: MaybeRef<boolean>;

  /**
   * Prevent events defaults
   *
   * @default false
   */
  preventDefault?: MaybeRef<boolean>;

  /**
   * Element to attach `pointermove` and `pointerup` events to.
   *
   * @default window
   */
  draggingElement?: MaybeRef<HTMLElement | SVGElement | Window | Document | null>;

  /**
   * Pointer types that listen to.
   *
   * @default ['mouse', 'touch', 'pen']
   */
  pointerTypes?: PointerType[];

  /**
   * Callback when the dragging starts. Return `false` to prevent dragging.
   */
  onStart?: (event: PointerEvent) => void | false;

  /**
   * Callback during dragging.
   */
  onMove?: (event: PointerEvent) => void;

  /**
   * Callback when dragging end.
   */
  onEnd?: (event: PointerEvent) => void;
}

/**
 * Make elements draggable.
 *
 * @param target
 * @param options
 */
export function useDrag(target: MaybeNullableRef<HTMLElement | SVGElement>, options: UseDragOptions = {}) {
  const draggingElement = options.draggingElement ?? window;
  const filterEvent = (e: PointerEvent) => {
    if (!e.isPrimary) return false;
    if (options.pointerTypes) return options.pointerTypes.includes(e.pointerType as PointerType);
    return true;
  };
  const preventDefault = (e: PointerEvent) => {
    if (unref(options.preventDefault)) e.preventDefault();
  };
  const start = (e: PointerEvent) => {
    if (!filterEvent(e)) return;
    if (unref(options.exact) && e.target !== unref(target)) return;

    if (options.onStart?.(e) === false) return;

    lastMouseEvent = e;
    stopPointermove = useEventListener(draggingElement, 'pointermove', move, true);
    stopPointerup = useEventListener(draggingElement, 'pointerup', end, true);
    stopScroll = useEventListener(draggingElement, 'scroll', scroll, true);
    preventDefault(e);
  };
  const move = (e: PointerEvent) => {
    lastMouseEvent = e;
    if (!filterEvent(e)) return;

    options.onMove?.(e);

    preventDefault(e);
  };
  const end = (e: PointerEvent) => {
    if (!filterEvent(e)) return;

    options.onEnd?.(e);

    stopPointermove();
    stopPointerup();
    stopScroll();
    preventDefault(e);
  };

  /** for scroll event */
  let lastMouseEvent: PointerEvent;
  const scroll = () => {
    move(lastMouseEvent);
  };

  const stopPointerdown = useEventListener(target, 'pointerdown', start);
  let stopPointermove = noop;
  let stopPointerup = noop;
  let stopScroll = noop;

  let stopImpl = () => {
    stopPointerdown();
    stopPointermove();
    stopPointerup();
    stopScroll();
    stopImpl = noop;
  };

  const stop = () => {
    stopImpl();
  };

  tryOnScopeDispose(stop);

  return stop;
}
