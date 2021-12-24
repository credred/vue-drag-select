<script setup lang="ts">
import { onMounted, inject, ref, computed } from 'vue';
import { forOptionActionKey, Option, OptionValue } from './DragSelectCommon';

const props = defineProps<{
  value: OptionValue;
}>();

const dragSelectOptionRef = ref<HTMLElement>();

const option = computed<Option>(() => ({
  dom: dragSelectOptionRef.value as HTMLElement,
  value: props.value,
}));

const dragSelectAction = inject(forOptionActionKey);

const isSelected = computed(() => {
  return !!dragSelectAction?.isSelected(option.value);
});

const optionClass = computed(() => ({
  'drag-select-option': true,
  'drag-select-option--selected': isSelected.value,
}));

onMounted(() => {
  dragSelectAction?.add(option.value);

  return () => {
    dragSelectAction?.delete(option.value);
  };
});
</script>

<template>
  <div ref="dragSelectOptionRef" :class="optionClass">
    <slot />
  </div>
</template>

<style></style>
