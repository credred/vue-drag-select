<script setup lang="ts">
import { computed, provide, ref, toRef, unref, watch } from 'vue';
import { forOptionActionKey, Option } from './DragSelectCommon';
import { useDragRect } from './hooks/useDragRect';
import { MaybeRef } from './typings/internal';
import { rectIsIntersect } from './utils/rectIsIntersect';
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

function useOptions(selectedOptions: MaybeRef<Set<unknown>>) {
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
  });

  return options;
}

const { selectedOptions: pSelectedOptions, emitModelValue } = useModelValue(toRef(props, 'modelValue'));
const options = useOptions(pSelectedOptions);

const contentRef = ref<HTMLElement>();

const { rect: areaRect, style: areaStyle } = useDragRect(contentRef);

watch(areaRect, () => {
  const newSelectedOptions = new Set();
  if (!areaRect.value) return;
  for (const { dom, value } of options) {
    if (
      rectIsIntersect(areaRect.value, {
        left: dom.offsetLeft,
        top: dom.offsetTop,
        width: dom.clientWidth,
        height: dom.clientHeight,
      })
    ) {
      newSelectedOptions.add(value);
    }
  }
  if (!setIsEqual(newSelectedOptions, pSelectedOptions.value)) {
    emitModelValue(newSelectedOptions);
  }
});
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
