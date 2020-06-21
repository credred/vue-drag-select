<template>
  <div :class="itemClass">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from "vue-property-decorator";
import DragSelect, { selectedOptionKey } from "@/DragSelect.vue";

@Component
export default class DragSelectOption extends Vue {
  @Inject() dragSelect!: DragSelect;
  @Prop({ required: true }) itemKey!: selectedOptionKey;
  @Prop({ default: "" }) selectedClass!: string;

  get itemClass() {
    return {
      "drag-select__option": true,
      "drag-select__option--selected": this.isSelected,
      [this.dragSelect.SelecteditemClass]: this.isSelected,
      [this.selectedClass]: this.isSelected,
    };
  }

  get isSelected() {
    return !!this.dragSelect.selectedOptionKeys[this.itemKey];
  }

  created() {
    this.dragSelect.options.set(this.itemKey, this);
  }

  beforeDestroy() {
    this.dragSelect.options.delete(this.itemKey);
    this.dragSelect.optionRectCache?.delete(this.itemKey);
    const index = this.dragSelect.value.indexOf(this.itemKey);
    if (index > -1) {
      this.dragSelect.value.splice(index, 1);
    }
  }
}
</script>
