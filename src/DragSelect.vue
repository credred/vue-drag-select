<script setup lang="ts">
import { computed, provide, ref, toRef, unref } from 'vue';
import { forOptionActionKey, Option } from './DragSelectCommon';
import { useClickToSelect, useDragToSelect } from './DragSelectHook';
import { MaybeRef } from './typings/internal';
import { setIsEqual } from './utils/setIsEqual';

type ArrayOrSet<T = unknown> = Array<T> | Set<T>;

const props = defineProps({
  /**
   * binding value
   * @alias v-model
   */
  modelValue: {
    required: true,
    type: Array || Set,
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

const emit = defineEmits<{
  (event: 'update:modelValue', value: ArrayOrSet): void;
  (event: 'change', value: ArrayOrSet): void;
}>();

function useModelValue(modelValueRef: MaybeRef<ArrayOrSet>) {
  const selectedOptions = computed(() => {
    const modelValue = unref(modelValueRef);
    return Array.isArray(modelValue) ? new Set(modelValue) : modelValue;
  });

  const emitModelValue = (selectedOptions: ArrayOrSet) => {
    const formattedSelectedOptions = Array.isArray(unref(modelValueRef))
      ? Array.from(selectedOptions)
      : selectedOptions;
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

const { selectedOptions: currentSelectedOptions, emitModelValue } = useModelValue(toRef(props, 'modelValue'));

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
