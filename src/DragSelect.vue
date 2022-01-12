<script setup lang="ts">
import { computed, provide, ref, toRef, unref } from 'vue';
import { forOptionActionKey, Option } from './DragSelectCommon';
import { useClickToSelect, useDragToSelect } from './DragSelectHook';
import { MaybeRef } from './typings/internal';

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

const { selectedOptions: currentSelectedOptions, emitModelValue: onChange } = useModelValue(toRef(props, 'modelValue'));
const onClickToSelect = useClickToSelect({ currentSelectedOptions, onChange });

const options = useOptions(currentSelectedOptions, onClickToSelect);

const contentRef = ref<HTMLElement>();

const areaStyle = useDragToSelect({ contentRef, options, currentSelectedOptions, onChange });
</script>

<template>
  <div class="drag-select__wrapper" style="position: relative">
    <div ref="contentRef" class="drag-select">
      <slot />
      <div class="drag-select__area" :style="areaStyle" />
    </div>
  </div>
</template>

<style></style>
