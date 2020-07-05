<template>
  <div :class="itemClass">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from "vue-property-decorator";
import DragSelect, { selectedOptionValue } from "./DragSelect.vue";

@Component({ name: "DragSelectOption" })
export default class DragSelectOption extends Vue {
  @Inject() dragSelect!: DragSelect;
  @Prop({ required: true }) value!: selectedOptionValue;
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
    return !!this.dragSelect.selectedOptionValues[this.value];
  }

  created() {
    this.dragSelect.options.set(this.value, this);
  }

  beforeDestroy() {
    this.dragSelect.options.delete(this.value);
    this.dragSelect.optionRectCache?.delete(this.value);
    const index = this.dragSelect.value.indexOf(this.value);
    if (index > -1) {
      this.dragSelect.value.splice(index, 1);
    }
  }
}
</script>
