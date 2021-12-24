import { Fn } from '@vueuse/core';
import { getCurrentScope, onScopeDispose } from 'vue';

/**
 * copy form vueuse
 *
 * Call onScopeDispose() if it's inside a effect scope lifecycle, if not, do nothing
 *
 * @param fn
 */
export function tryOnScopeDispose(fn: Fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
