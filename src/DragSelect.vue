<script setup lang="ts">
import { computed, provide, Ref, ref, toRef, unref } from 'vue';
import { DragSelectProps, forOptionActionKey, Option } from './DragSelectCommon';
import { useClickToSelect, useDragToSelect } from './DragSelectHook';
import { MaybeRef } from './typings/internal';
import { setIsEqual } from './utils/setIsEqual';

type ArrayOrSet<T = unknown> = Array<T> | Set<T>;

const _p = defineProps({
  /**
   * binding value
   * @alias v-model
   */
  modelValue: {
    default: undefined,
    validator(value) {
      const plainValue = unref(value);
      return plainValue === undefined || Array.isArray(plainValue) || plainValue instanceof Set;
    },
  },
  /**
   * whether DragSelect is disabled
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },
});
const props = _p as DragSelectProps<ArrayOrSet | undefined>;

const emit = defineEmits<{
  (event: 'update:modelValue', value: ArrayOrSet): void;
  (event: 'change', value: ArrayOrSet): void;
}>();

function useModelValue(modelValueRef: Ref<ArrayOrSet | undefined>) {
  const innerSelectedOptions: Ref<ArrayOrSet> = ref(new Set([]));
  const selectedOptions = computed(() => {
    const modelValue = unref(modelValueRef) || innerSelectedOptions.value;
    return Array.isArray(modelValue) ? new Set(modelValue) : modelValue;
  });

  const emitModelValue = (selectedOptions: ArrayOrSet) => {
    const formattedSelectedOptions = Array.isArray(unref(modelValueRef))
      ? Array.from(selectedOptions)
      : selectedOptions;
    innerSelectedOptions.value = formattedSelectedOptions;
    emit('update:modelValue', formattedSelectedOptions);
    emit('change', formattedSelectedOptions);
  };

  return { selectedOptions, emitModelValue };
}

function useOptions(selectedOptions: MaybeRef<Set<unknown>>, onClickToSelect: (option: Option) => void) {
  const options = new Set<Option>();
  provide(forOptionActionKey, {
    has(option: Option) {
      return options.has(option);
    },
    isSelected(option) {
      return unref(selectedOptions).has(option.value);
    },
    add(option: Option) {
      options.add(option);
    },
    delete(option: Option) {
      options.delete(option);
    },
    onClick(option: Option) {
      onClickToSelect(option);
    },
  });

  return options;
}

const { selectedOptions: currentSelectedOptions, emitModelValue } = useModelValue(
  toRef(props, 'modelValue') as Ref<ArrayOrSet | undefined>
);

const onChange = (selectedOptions: Set<unknown>) => {
  if (!setIsEqual(selectedOptions, unref(currentSelectedOptions))) {
    emitModelValue(selectedOptions);
  }
};

const isDisableClick = () => {
  return !!dragged.value;
};

const onClickToSelect = useClickToSelect({ onChange, isDisableClick });

const options = useOptions(currentSelectedOptions, onClickToSelect);

const contentRef = ref<HTMLElement>();

const { areaStyle, dragged } = useDragToSelect({ contentRef, options, onChange });

const onContentRefClick = () => {
  if (isDisableClick()) return;
  onChange(new Set());
};
</script>

<template>
  <div class="drag-select__wrapper">
    <div ref="contentRef" class="drag-select" style="position: relative" @click="onContentRefClick">
      <slot />
      <div class="drag-select__area" :style="areaStyle" />
    </div>
  </div>
</template>

<style></style>
