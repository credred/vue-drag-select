import { ComputedRef, Ref, computed, ref, unref } from 'vue';
import { setXor } from '../utils/setXor';
import { setIsEqual } from '../utils/setIsEqual';
import { ModifierKey } from '../DragSelectCommon';

const keyMap: Record<ModifierKey, keyof MouseEvent> = {
  ctrl: 'ctrlKey',
  shift: 'shiftKey',
  meta: 'metaKey',
  alt: 'altKey',
};

export interface useCalcSelectedConfig {
  multiple: Ref<boolean | undefined>;
  emitMultiple: (multiple: boolean) => void;
  activeMultipleKeys: Ref<ModifierKey[]>;
  deselectRepeated: Ref<boolean>;
}

export const useCalcSelectedOptions = (
  currentSelectedOptions: ComputedRef<Set<unknown>>,
  { multiple, activeMultipleKeys, deselectRepeated, emitMultiple }: useCalcSelectedConfig
) => {
  const selectedOptionsWhenDragStart = ref<Set<unknown>>();

  const onStart = (e: PointerEvent) => {
    emitMultiple(unref(activeMultipleKeys).some((key) => !!e[keyMap[key]]));

    selectedOptionsWhenDragStart.value = unref(currentSelectedOptions);
  };

  const onEnd = () => {
    selectedOptionsWhenDragStart.value = undefined;
    emitMultiple(false);
  };

  const prevSelectedOptions = computed(() => unref(selectedOptionsWhenDragStart) || unref(currentSelectedOptions));

  const calcNewSelectedOptions = (selectedOptions: Set<unknown>) => {
    if (unref(multiple)) {
      if (unref(deselectRepeated)) {
        return setXor(selectedOptions, unref(prevSelectedOptions));
      } else {
        return new Set([...selectedOptions, ...unref(prevSelectedOptions)]);
      }
    } else {
      if (!setIsEqual(selectedOptions, unref(prevSelectedOptions))) {
        return selectedOptions;
      }
    }
  };

  return { calcNewSelectedOptions, onStart, onEnd };
};
