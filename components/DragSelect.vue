<template>
  <div class="drag-select" style="position: relative;" @mousedown="_onMousedown">
    <slot></slot>
    <div class="drag-select__area" :class="dragAreaClass" :style="dragSelectAreaStyles"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from "vue-property-decorator";
import { findScrollableParent } from "@util/findScrollableParent";
import { pairRectIntersect } from "@util/pairRectIntersect";
import { AutoScroll } from "@util/autoScroll";
import DragSelectOption from "@/DragSelectOption.vue";
import { getDocument } from "./_util/getDocument";

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
export type selectedOptionKey = string | number;
type selectedOptionKeys = Record<selectedOptionKey, boolean>;

@Component
export default class DragSelect extends Vue {
  @Provide() dragSelect = this;
  @Prop({ default: () => [] }) value!: selectedOptionKey[];
  @Prop() dragAreaClass!: string;
  @Prop({ type: Object, default: () => ({}) }) dragAreaStyle!: Record<string, string>;
  @Prop({ default: "" }) SelecteditemClass!: string;
  startPoint: Point | null = null;
  endPoint: Point | null = null;
  lastMouseEvent!: MouseEvent;
  autoScroll!: AutoScroll;

  _scrollableParent!: HTMLElement;
  options: Map<selectedOptionKey, DragSelectOption> = new Map();
  optionRectCache: Map<selectedOptionKey, Rect> | null = null;
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
  get selectedOptionKeys() {
    const selectedOptionKeys: selectedOptionKeys = {};
    this.value.forEach((v) => {
      selectedOptionKeys[v] = true;
    });
    return selectedOptionKeys;
  }

  set selectedOptionKeys(selectedOptionKeys) {
    this.$emit("change", Object.keys(selectedOptionKeys));
  }

  mounted() {
    this._scrollableParent = findScrollableParent(this.$el as HTMLElement) as HTMLElement;
  }

  beforeDestroy() {
    window.removeEventListener("mousemove", this._onMousemove);
    window.removeEventListener("mouseup", this._onMouseup);
    this._scrollableParent.removeEventListener("scroll", this._onScrollableParentScroll);
  }

  _getSelfRect() {
    const el = this.$el as HTMLElement;
    return {
      left: el.offsetLeft,
      top: el.offsetTop,
      width: el.scrollWidth,
      height: el.scrollHeight,
    };
  }

  _getCurrentPoint(e: MouseEvent) {
    const selfRect = this._getSelfRect();
    const { left, top } = this.$el.getBoundingClientRect();

    return {
      x: Math.max(0, Math.min(e.clientX - left - this.$el.clientLeft + this.$el.scrollLeft, selfRect.width)),
      y: Math.max(0, Math.min(e.clientY - top - this.$el.clientTop + this.$el.scrollTop, selfRect.height)),
    };
  }

  /**
   * avoid drag when mouseEvent trigger on border or scrollbar
   */
  _isMouseEventInClientArea(e: MouseEvent) {
    const ownDocument = getDocument(this.$el as HTMLElement);
    const [pageScrollTop = 0, pageScrollLeft = 0] = [
      ownDocument?.scrollingElement?.scrollTop,
      ownDocument?.scrollingElement?.scrollLeft,
    ];
    const el = this.$el as HTMLElement;

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
    this.autoScroll = new AutoScroll(this.$el as HTMLElement);
    window.addEventListener("mousemove", this._onMousemove);
    window.addEventListener("mouseup", this._onMouseup);
    this._scrollableParent.addEventListener("scroll", this._onScrollableParentScroll);
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
    if ((e as MouseWheelEvent).clientX !== undefined) {
      this.lastMouseEvent = e as MouseEvent;
    }
    this.endPoint = this._getCurrentPoint(this.lastMouseEvent);

    const selectedOptionKeys: selectedOptionKeys = {};
    const selectedOptionKeysForDiff: selectedOptionKeys = {};
    for (const [itemKey, option] of this.options) {
      if (!this.optionRectCache) {
        this.optionRectCache = new Map();
      }
      if (!this.optionRectCache.has(itemKey)) {
        const optionEl = option.$el as HTMLElement;
        this.optionRectCache.set(itemKey, {
          left: optionEl.offsetLeft,
          top: optionEl.offsetTop,
          width: optionEl.offsetWidth,
          height: optionEl.offsetHeight,
        });
      }
      const isPairRectIsIntersect = pairRectIntersect(
        this.dragSelectAreaRect!,
        this.optionRectCache.get(itemKey) as Rect
      );
      if (isPairRectIsIntersect) {
        selectedOptionKeys[itemKey] = true;
        selectedOptionKeysForDiff[itemKey] = true;
      }
    }

    let needToUpdate = false;

    if (!needToUpdate) {
      for (const key in this.selectedOptionKeys) {
        delete selectedOptionKeysForDiff[key];
        if (this.selectedOptionKeys[key] !== selectedOptionKeys[key]) {
          needToUpdate = true;
          break;
        }
      }
    }

    for (const key in selectedOptionKeysForDiff) {
      if (this.selectedOptionKeys[key] !== selectedOptionKeys[key]) {
        needToUpdate = true;
        break;
      }
    }

    if (needToUpdate) {
      this.selectedOptionKeys = selectedOptionKeys;
    }
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
