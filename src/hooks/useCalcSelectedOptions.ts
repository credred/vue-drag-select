import { ComputedRef, Ref, computed, ref, unref } from 'vue';
import { setXor } from '../utils/setXor';
import { setIsEqual } from '../utils/setIsEqual';

export interface useCalcSelectedConfig {
  multiple: Ref<boolean | undefined>;
  deselectRepeated: Ref<boolean>;
}

export const useCalcSelectedOptions = (
  currentSelectedOptions: ComputedRef<Set<unknown>>,
  { multiple, deselectRepeated }: useCalcSelectedConfig
) => {
  const selectedOptionsWhenDragStart = ref<Set<unknown>>();

  const onStart = () => {
    selectedOptionsWhenDragStart.value = unref(currentSelectedOptions);
  };

  const onEnd = () => {
    selectedOptionsWhenDragStart.value = undefined;
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
