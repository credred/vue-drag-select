import { Ref, unref } from 'vue';
import { ModifierKey } from '../DragSelectCommon';
import { useControllableValue } from './useControllableValue';

export interface useMultipleConfig {
  activeMultipleKeys: Ref<ModifierKey[]>;
}

const keyMap: Record<ModifierKey, keyof MouseEvent> = {
  ctrl: 'ctrlKey',
  shift: 'shiftKey',
  meta: 'metaKey',
  alt: 'altKey',
};

export const useMultiple = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit: (event: any, ...args: any[]) => void,
  { activeMultipleKeys }: useMultipleConfig
) => {
  const [multiple, emitMultiple] = useControllableValue(props, emit, {
    valuePropName: 'multiple',
    defaultValuePropName: 'defaultMultiple',
    defaultValue: false,
    trigger: 'update:multiple',
  });

  const onStart = (e: PointerEvent) => {
    emitMultiple(unref(activeMultipleKeys).some((key) => !!e[keyMap[key]]));
  };
  const onEnd = () => {
    emitMultiple(false);
  };

  return {
    multiple,
    onStart,
    onEnd,
  };
};
