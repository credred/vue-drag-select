/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { unref, watch } from 'vue';
import { noop } from '../utils/noop';
import { tryOnScopeDispose } from '../utils/tryOnScopeDispose';
import { Fn, MaybeNullableRef } from '../typings/internal';

export interface InferEventTarget<Events> {
  addEventListener(event: Events, fn?: any, options?: any): any;
  removeEventListener(event: Events, fn?: any, options?: any): any;
}

export type GeneralEventListener<E = Event> = {
  (evt: E): void;
};

export function useEventListener<E extends keyof WindowEventMap>(
  target: Window,
  event: E,
  listener: (this: Window, ev: WindowEventMap[E]) => any,
  options?: boolean | AddEventListenerOptions
): Fn;
export function useEventListener<E extends keyof DocumentEventMap>(
  target: Document,
  event: E,
  listener: (this: Document, ev: DocumentEventMap[E]) => any,
  options?: boolean | AddEventListenerOptions
): Fn;
export function useEventListener<E extends keyof HTMLElementEventMap>(
  target: MaybeNullableRef<HTMLElement>,
  event: E,
  listener: (this: Window, ev: HTMLElementEventMap[E]) => any,
  options?: boolean | AddEventListenerOptions
): Fn;
export function useEventListener<E extends keyof SVGElementEventMap>(
  target: MaybeNullableRef<SVGElement>,
  event: E,
  listener: (this: Window, ev: SVGElementEventMap[E]) => any,
  options?: boolean | AddEventListenerOptions
): Fn;
export function useEventListener<EventType = Event>(
  target: MaybeNullableRef<EventTarget>,
  event: string,
  listener: GeneralEventListener<EventType>,
  options?: boolean | AddEventListenerOptions
): Fn;
export function useEventListener(
  target: MaybeNullableRef<Window | Document | HTMLElement | SVGElement> | MaybeNullableRef<EventTarget>,
  event: string,
  listener: any,
  options?: boolean | AddEventListenerOptions
): Fn {
  let cleanup = noop;
  const stopWatch = watch(
    () => unref(target),
    (el) => {
      cleanup();
      if (!el) return;

      el.addEventListener(event, listener, options);

      cleanup = () => {
        el.removeEventListener(event, listener, options);
      };
    },
    { immediate: true, flush: 'sync' }
  );

  let stopImpl = () => {
    stopWatch();
    cleanup();
    stopImpl = noop;
  };

  const stop = () => {
    stopImpl();
  };

  tryOnScopeDispose(stop);

  return stop;
}
