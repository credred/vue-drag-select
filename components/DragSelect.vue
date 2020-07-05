<template>
  <div class="drag-select__wrapper">
    <div ref="content" class="drag-select" style="position: relative;" @mousedown="_onMousedown" @click="_onClick">
      <slot></slot>
      <div class="drag-select__area" :class="dragAreaClass" :style="dragSelectAreaStyles"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Ref, Model } from "vue-property-decorator";
import { findScrollableParent } from "./_util/findScrollableParent";
import { pairRectIntersect } from "./_util/pairRectIntersect";
import { AutoScroll } from "./_util/autoScroll";
import { getDocument } from "./_util/getDocument";
import DragSelectOption from "./DragSelectOption.vue";
import { VueElement } from "./_typings";

interface Point {
  x: number;
  y: number;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type selectedOptionValue = string | number;
type selectedOptionValues = Record<selectedOptionValue, boolean>;

@Component({ name: "DragSelect" })
export default class DragSelect extends Vue {
  @Ref("content") contentRef!: HTMLElement;
  @Provide() dragSelect = this;
  @Model("change", { required: true, default: [] }) value!: selectedOptionValue[];
  @Prop() dragAreaClass!: string;
  @Prop({ type: Object, default: () => ({}) }) dragAreaStyle!: Record<string, string>;
  @Prop({ default: "" }) SelecteditemClass!: string;
  startPoint: Point | null = null;
  endPoint: Point | null = null;
  /** mark as having triggered mousemove event. if true, prevent trigger click event */
  dragged = false;
  lastMouseEvent!: MouseEvent;
  autoScroll!: AutoScroll;

  _scrollableParent!: HTMLElement;
  options: Map<selectedOptionValue, DragSelectOption> = new Map();
  optionRectCache: Map<selectedOptionValue, Rect> | null = null;
  /** calc drag area rect by startpoint and endpoint */
  get dragSelectAreaRect(): Rect | null {
    if (!this.startPoint || !this.endPoint) return null;
    return {
      left: Math.min(this.startPoint.x, this.endPoint.x),
      top: Math.min(this.startPoint.y, this.endPoint.y),
      width: Math.abs(this.startPoint.x - this.endPoint.x),
      height: Math.abs(this.startPoint.y - this.endPoint.y),
    };
  }

  get dragSelectAreaStyles() {
    if (!this.dragSelectAreaRect) return { display: "none" };
    const { left, top, width, height } = this.dragSelectAreaRect;
    return {
      position: "absolute",
      ...this.dragAreaStyle,
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  }

  /**
   * mapping for this.value
   */
  get selectedOptionValues() {
    const selectedOptionValues: selectedOptionValues = {};
    this.value.forEach((v) => {
      selectedOptionValues[v] = true;
    });
    return selectedOptionValues;
  }

  set selectedOptionValues(selectedOptionValues) {
    const selectedOptionValuesForDiff = Object.assign({}, selectedOptionValues);

    let needToUpdate = false;

    if (!needToUpdate) {
      for (const key in this.selectedOptionValues) {
        delete selectedOptionValuesForDiff[key];
        if (this.selectedOptionValues[key] !== selectedOptionValues[key]) {
          needToUpdate = true;
          break;
        }
      }
    }

    for (const key in selectedOptionValuesForDiff) {
      if (this.selectedOptionValues[key] !== selectedOptionValues[key]) {
        needToUpdate = true;
        break;
      }
    }

    if (needToUpdate) {
      this.$emit("change", Object.keys(selectedOptionValues));
    }
  }

  mounted() {
    this._scrollableParent = findScrollableParent(this.contentRef) as HTMLElement;
  }

  beforeDestroy() {
    window.removeEventListener("mousemove", this._onMousemove);
    window.removeEventListener("mouseup", this._onMouseup);
    this._scrollableParent.removeEventListener("scroll", this._onScrollableParentScroll);
  }

  _getSelfRect() {
    const el = this.contentRef;
    return {
      left: el.offsetLeft,
      top: el.offsetTop,
      width: el.getBoundingClientRect().width,
      height: el.getBoundingClientRect().height,
    };
  }

  _getCurrentPoint(e: MouseEvent) {
    const { left, top, width, height } = this.contentRef.getBoundingClientRect();

    return {
      x: Math.max(0, Math.min(e.clientX - left - this.contentRef.clientLeft, width)),
      y: Math.max(0, Math.min(e.clientY - top - this.contentRef.clientTop, height)),
    };
  }

  /**
   * avoid drag when mouseEvent trigger on border or scrollbar
   */
  _isMouseEventInClientArea(e: MouseEvent) {
    const ownDocument = getDocument(this.contentRef);
    const [pageScrollTop = 0, pageScrollLeft = 0] = [
      ownDocument?.scrollingElement?.scrollTop,
      ownDocument?.scrollingElement?.scrollLeft,
    ];
    const el = this.contentRef;

    if (
      e.clientX + pageScrollLeft < el.offsetLeft + el.clientLeft ||
      e.clientX + pageScrollLeft > el.offsetLeft + el.clientLeft + el.clientWidth
    ) {
      return false;
    }
    if (
      e.clientY + pageScrollTop < el.offsetTop + el.clientTop ||
      e.clientY + pageScrollTop > el.offsetTop + el.clientTop + el.clientHeight
    ) {
      return false;
    }
    return true;
  }

  _onMousedown(e: MouseEvent) {
    // sometime the last state was not cleaned up
    this.cleanDrag();

    if (!this._isMouseEventInClientArea(e)) {
      return;
    }
    this.startPoint = this._getCurrentPoint(e);
    this.autoScroll = new AutoScroll(this.contentRef);
    window.addEventListener("mousemove", this._onMousemove);
    window.addEventListener("mouseup", this._onMouseup);
    this._scrollableParent.addEventListener("scroll", this._onScrollableParentScroll);

    this.dragged = false;
  }

  _onClick(e: MouseEvent) {
    if (this.dragged) {
      return;
    }
    const optionElSet = new WeakSet(Array.from(this.options.values()).map((option) => option.$el));
    let target = e.target;
    const selectedOptionValue: selectedOptionValues = {};
    while (target instanceof Element && target !== this.contentRef) {
      if (optionElSet.has(target)) {
        selectedOptionValue[((target as VueElement).__vue__ as DragSelectOption).value] = true;
        break;
      }
      target = target.parentElement;
    }
    this.selectedOptionValues = selectedOptionValue;
  }

  _onMousemove(e: MouseEvent) {
    this._drag(e);
    e.preventDefault();
    e.stopPropagation();
  }

  _onMouseup() {
    this.cleanDrag();
  }

  _onScrollableParentScroll(e: Event) {
    this._drag(e);
  }

  _drag(e: Event) {
    this.dragged = true;
    if ((e as MouseWheelEvent).clientX !== undefined) {
      this.lastMouseEvent = e as MouseEvent;
    }
    this.endPoint = this._getCurrentPoint(this.lastMouseEvent);

    const selectedOptionValues: selectedOptionValues = {};
    for (const [value, option] of this.options) {
      if (!this.optionRectCache) {
        this.optionRectCache = new Map();
      }
      if (!this.optionRectCache.has(value)) {
        const optionEl = option.$el as HTMLElement;
        this.optionRectCache.set(value, {
          left: optionEl.offsetLeft,
          top: optionEl.offsetTop,
          width: optionEl.offsetWidth,
          height: optionEl.offsetHeight,
        });
      }
      const isPairRectIsIntersect = pairRectIntersect(
        this.dragSelectAreaRect!,
        this.optionRectCache.get(value) as Rect
      );
      if (isPairRectIsIntersect) {
        selectedOptionValues[value] = true;
      }
    }

    this.selectedOptionValues = selectedOptionValues;
  }

  cleanDrag() {
    this.startPoint = null;
    this.endPoint = null;
    this.autoScroll?.dispose();

    window.removeEventListener("mousemove", this._onMousemove);
    window.removeEventListener("mouseup", this._onMouseup);
    this._scrollableParent.removeEventListener("scroll", this._onScrollableParentScroll);

    this.optionRectCache = null;
  }
}
</script>
