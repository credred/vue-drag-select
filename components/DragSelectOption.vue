<template>
  <div :class="itemClass" :style="itemStyle">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject, Watch } from "vue-property-decorator";
import DragSelect, { selectedOptionValue } from "./DragSelect.vue";

@Component({ name: "DragSelectOption" })
export default class DragSelectOption extends Vue {
  @Inject() dragSelect!: DragSelect;
  /** value of option */
  @Prop({ required: true }) value!: selectedOptionValue;
  /** the class names of selected option */
  @Prop({ default: "" }) selectedClass!: string;
  /** whether option is disabled */
  @Prop({ type: Boolean, default: false }) disabled!: boolean;

  get itemClass() {
    return {
      "drag-select__option": true,
      "drag-select__option--selected": this.isSelected,
      "drag-select__option--disabled": this.disabled,
      [this.dragSelect.selectedOptionClass]: this.isSelected,
      [this.selectedClass]: this.isSelected,
    };
  }

  get itemStyle() {
    return this.dragSelect.selectedOptionStyle;
  }

  get isSelected() {
    return !!this.dragSelect.selectedOptionValues.has(this.value);
  }

  @Watch("disabled", { immediate: true })
  onDisabledChange() {
    if (!this.disabled) {
      this.dragSelect.options.set(this.value, this);
    } else {
      this.dragSelect.options.delete(this.value);
    }
    if (this.dragSelect.optionRectCache) {
      if (!this.disabled) {
        this.dragSelect._addOptionRectCache(this);
      } else {
        this.dragSelect.optionRectCache.delete(this.value);
      }
    }
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
