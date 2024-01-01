<script setup lang="ts">
import { computed, PropType, provide, Ref, ref, toRef, unref } from 'vue';
import { InnerDragSelectProps, ModifierKey, forOptionActionKey, Option } from './DragSelectCommon';
import { useClickToSelect, useDragToSelect } from './DragSelectHook';
import { MaybeRef } from './typings/internal';
import { useCalcSelectedOptions } from './hooks/useCalcSelectedOptions';
import { useMultiple } from './hooks/useMultiple';

type ArrayOrSet<T = unknown> = Array<T> | Set<T>;

const _p = defineProps({
  /**
   * binding value
   * @alias v-model
   */
  modelValue: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    default: undefined as any,
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
    default: false,
    validator(value) {
      const plainValue = unref(value);
      return typeof plainValue === 'boolean';
    },
  },
  draggableOnOption: {
    default: true,
    validator(value) {
      const plainValue = unref(value);
      return typeof plainValue === 'boolean';
    },
  },
  dragAreaClass: {
    type: String,
    default: '',
  },
  dragAreaStyle: {
    type: Object,
    default: () => ({}),
  },
  background: {
    type: String,
    default: 'rgba(66, 153, 225, 0.5)',
  },
  selectedOptionClass: {
    type: String,
    default: '',
  },
  selectedOptionStyle: {
    type: Object,
    default: () => ({}),
  },
  multiple: {
    type: Boolean,
    default: undefined,
  },
  defaultMultiple: {
    type: Boolean,
    default: undefined,
  },
  activeMultipleKeys: {
    type: Array as PropType<ModifierKey[]>,
    default: () => ['ctrl', 'meta', 'shift'],
  },
  deselectRepeated: {
    type: Boolean,
    default: true,
  },
});

const props = _p as InnerDragSelectProps<typeof _p, ArrayOrSet>;

const emit = defineEmits<{
  (event: 'update:modelValue', value: ArrayOrSet): void;
  (event: 'update:multiple', value: boolean): void;
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
  const clickedOnOption = ref(false);
  const pointerDownedOnOption = ref(false);
  provide(forOptionActionKey, {
    selectedOptionClass: toRef(props, 'selectedOptionClass'),
    has(option) {
      return options.has(unref(option));
    },
    isSelected(option) {
      return unref(selectedOptions).has(unref(option).value);
    },
    add(option) {
      options.add(unref(option));
    },
    delete(option) {
      options.delete(unref(option));
    },
    onClick(option) {
      onClickToSelect(unref(option));
      clickedOnOption.value = true;
    },
    onPointerDown() {
      pointerDownedOnOption.value = true;
    },
  });

  const consumeClickedOnOption = () => {
    try {
      return clickedOnOption.value;
    } finally {
      clickedOnOption.value = false;
    }
  };

  const consumePointerDownedOnOption = () => {
    try {
      return pointerDownedOnOption.value;
    } finally {
      pointerDownedOnOption.value = false;
    }
  };

  return { options, consumeClickedOnOption, consumePointerDownedOnOption };
}

const { selectedOptions: currentSelectedOptions, emitModelValue } = useModelValue(
  toRef(props, 'modelValue') as Ref<ArrayOrSet | undefined>
);

const { multiple, ...multipleMethod } = useMultiple(props, emit, {
  activeMultipleKeys: toRef(props, 'activeMultipleKeys') as Ref<ModifierKey[]>,
});

const calcSelectedOptionsMethod = useCalcSelectedOptions(currentSelectedOptions, {
  multiple: multiple,
  deselectRepeated: toRef(props, 'deselectRepeated') as Ref<boolean>,
});

const onChange = (selectedOptions: Set<unknown>) => {
  const newSelectedOptions = calcSelectedOptionsMethod.calcNewSelectedOptions(selectedOptions);
  if (newSelectedOptions) {
    emitModelValue(newSelectedOptions);
  }
};

const isDisableClick = () => {
  return !!dragged.value;
};

const onClickToSelect = useClickToSelect({ onChange, isDisableClick });

const { options, consumeClickedOnOption, consumePointerDownedOnOption } = useOptions(
  currentSelectedOptions,
  onClickToSelect
);

const contentRef = ref<HTMLElement>();
const containerRef = ref<HTMLElement>();

const {
  areaStyle: areaRectStyle,
  dragged,
  isDragging,
} = useDragToSelect({
  contentRef,
  containerRef,
  options,
  onChange,
  onStart: (e) => {
    calcSelectedOptionsMethod.onStart();
    multipleMethod.onStart(e);
  },
  onEnd: () => {
    calcSelectedOptionsMethod.onEnd();
    multipleMethod.onEnd();
  },
  consumePointerDownedOnOption,
  disabled: toRef(props, 'disabled') as Ref<boolean>,
  draggableOnOption: toRef(props, 'draggableOnOption') as Ref<boolean>,
});

const areaStyle = computed(() => ({
  background: props.background,
  ...props.dragAreaStyle,
  ...areaRectStyle.value,
}));

const dragSelectClass = computed(() => ({
  'drag-select': true,
  'drag-select--disabled': props.disabled,
}));

const onContentRefClick = () => {
  if (consumeClickedOnOption() || isDisableClick()) return;
  onChange(new Set());
};

defineExpose({
  isDragging,
});
</script>

<template>
  <div ref="containerRef" class="drag-select__wrapper">
    <div ref="contentRef" :class="dragSelectClass" style="position: relative" @click="onContentRefClick">
      <slot />
      <div class="drag-select__area" :class="props.dragAreaClass" :style="areaStyle" />
    </div>
  </div>
</template>

<style></style>
