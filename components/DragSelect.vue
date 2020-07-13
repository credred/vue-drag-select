<template>
  <div class="drag-select__wrapper">
    <div ref="content" class="drag-select" style="position: relative;">
      <slot></slot>
      <div class="drag-select__area" :class="dragAreaClass" :style="dragSelectAreaStyles"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Ref, Model, Watch } from "vue-property-decorator";
import { findScrollableParent } from "./_util/findScrollableParent";
import { pairRectIntersect } from "./_util/pairRectIntersect";
import { AutoScroll } from "./_util/autoScroll";
import { setIsEqual } from "./_util/setIsEqual";
import DragSelectOption from "./DragSelectOption.vue";
import { VueElement } from "./_typings";
import { createDecorator } from "vue-class-component";
import { rafThrottle } from "./_util/rafThrottle";

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
type selectedOptionValues = selectedOptionValue[];

const withPlainSetSelectedOptionValues = createDecorator((options, key) => {
  const originalMethod = options.methods![key];

  // https://www.stephanboyer.com/post/132/what-are-covariance-and-contravariance
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  options.methods[key] = function wrapperMethod(this: DragSelect, ...args) {
    this.plainSetSelectedOptionValues = true;
    originalMethod.apply(this, args);
    this.plainSetSelectedOptionValues = false;
  };
});

const throttle = (propertyName: string, immediate = true) =>
  createDecorator((options, key) => {
    const originalMethod = options.methods![key];
    const throttledMethod = rafThrottle(originalMethod, immediate);
    // https://www.stephanboyer.com/post/132/what-are-covariance-and-contravariance
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    options.methods[key] = function wrapperMethod(...args) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[propertyName] = throttledMethod;
      throttledMethod.apply(this, args);
    };
  });

@Component({ name: "DragSelect" })
export default class DragSelect extends Vue {
  @Ref("content") contentRef!: HTMLElement;
  @Provide() dragSelect = this;
  /**
   * selected option collection
   */
  @Model("change", { required: true, default: [] }) value!: selectedOptionValue[];
  /**
   * the class names of drag area
   */
  @Prop() dragAreaClass!: string;
  /**
   * the class styles drag area
   */
  @Prop({ type: Object, default: () => ({}) }) dragAreaStyle!: Record<string, string>;
  /**
   * the class names of selected option
   */
  @Prop({ default: "" }) selectedOptionClass!: string;
  /**
   * the selected styles of styles option
   */
  @Prop({ type: Object, default: () => ({}) }) selectedOptionStyle!: Record<string, string>;
  /**
   * can draggable when dragstart event target on drag option
   */
  @Prop({ type: Boolean, default: true }) draggableOnOption!: boolean;
  /**
   * whether DragSelect is disabled
   */
  @Prop({ type: Boolean, default: false }) disabled!: boolean;
  startPoint: Point | null = null;
  endPoint: Point | null = null;
  /** mark as having triggered mousemove event. if true, prevent trigger click event */
  dragged = false;
  /** mark is touching */
  _touching = false;
  lastMouseEvent!: MouseEvent;
  autoScroll!: AutoScroll;

  _scrollableParent!: HTMLElement;
  options: Map<selectedOptionValue, DragSelectOption> = new Map();
  optionRectCache: Map<selectedOptionValue, Rect> | null = null;

  /** init on mousedown event if controlKeyActive is true,combine newSelectedOptionValues and originSelectedOptionValues into selectedOptionValues */
  originSelectedOptionValues: Set<selectedOptionValue> | null = null;

  controlKeyActive = false;
  shiftKeyActive = false;

  plainSetSelectedOptionValues = false;

  /** defineed on _onMousemove method by using throttle decorator */
  throttledMounsemoveHandler: ReturnType<typeof rafThrottle> | undefined;
  /** defineed on _onScrollableParentScroll method by using throttle decorator */
  throttledScrollHandler: ReturnType<typeof rafThrottle> | undefined;

  /** calc drag area rect by startpoint and endpoint */
  get dragSelectAreaRect(): Rect | null {
    return this._getRectByPoint(this.startPoint, this.endPoint);
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
    return new Set(this.value);
  }

  set selectedOptionValues(newSelectedOptionValues) {
    const oldSelectedOptionValues = this.selectedOptionValues;
    let actualNewSelectedOptionValues: selectedOptionValue[];
    if (this.plainSetSelectedOptionValues) {
      actualNewSelectedOptionValues = Array.from(newSelectedOptionValues);
    } else if (this.controlKeyActive && this.originSelectedOptionValues) {
      /** originSelectedOptionValues was set on mouseDown event when controlKeyActive is true */
      const originSelectedOptionValues = this.originSelectedOptionValues;
      const unionOptionValues = new Set([...originSelectedOptionValues, ...newSelectedOptionValues]);
      const differenceValues: selectedOptionValue[] = [];
      for (const value of unionOptionValues) {
        if (originSelectedOptionValues.has(value) !== newSelectedOptionValues.has(value)) {
          differenceValues.push(value);
        }
      }
      actualNewSelectedOptionValues = differenceValues;
    } else {
      const originSelectedOptionValues = this.originSelectedOptionValues || new Set();
      for (const originSelectedOptionValue of originSelectedOptionValues) {
        if (newSelectedOptionValues.has(originSelectedOptionValue)) {
          /** remove insetsect values */
          originSelectedOptionValues.delete(originSelectedOptionValue);
        }
      }
      actualNewSelectedOptionValues = Array.from(new Set([...newSelectedOptionValues, ...originSelectedOptionValues]));
    }
    if (!setIsEqual(oldSelectedOptionValues, new Set(actualNewSelectedOptionValues))) {
      this.$emit("change", actualNewSelectedOptionValues);
    }
  }

  @Watch("disabled", { immediate: true })
  onDisabledChange() {
    this.$nextTick(() => {
      if (!this.disabled) {
        this.contentRef.addEventListener("mousedown", this._onMousedown);
        this.contentRef.addEventListener("touchstart", this._onTouchStart);
        this.contentRef.addEventListener("click", this._onClick);
      } else {
        this.contentRef.removeEventListener("touchstart", this._onTouchStart);
        this.contentRef.removeEventListener("click", this._onClick);
        this.cleanDrag();
      }
    });
  }

  mounted() {
    this._scrollableParent = findScrollableParent(this.contentRef) as HTMLElement;
    window.addEventListener("keydown", this._handleKeyChange);
    window.addEventListener("keyup", this._handleKeyChange);
  }

  beforeDestroy() {
    this.contentRef.removeEventListener("mousedown", this._onMousedown);
    this.contentRef.removeEventListener("click", this._onClick);

    window.removeEventListener("mousemove", this._onMousemove);
    window.removeEventListener("mouseup", this._onMouseup);
    this._scrollableParent.removeEventListener("scroll", this._onScrollableParentScroll);

    window.removeEventListener("keydown", this._handleKeyChange);
    window.removeEventListener("keyup", this._handleKeyChange);
  }

  /**
   * select all options
   * @public
   */
  @withPlainSetSelectedOptionValues
  selectAll() {
    this.selectedOptionValues = new Set(this.options.keys());
  }

  /**
   * select certain options
   * @public
   */
  @withPlainSetSelectedOptionValues
  selectOptions(optionValues: selectedOptionValues) {
    const newSelectedOptionValues = new Set([...this.selectedOptionValues, ...optionValues]);
    this.selectedOptionValues = newSelectedOptionValues;
  }

  /**
   * deselect certain options
   * @public
   */
  @withPlainSetSelectedOptionValues
  deselectOptions(optionValues: selectedOptionValues) {
    const newSelectedOptionValues = new Set(this.selectedOptionValues);
    for (const value of optionValues) {
      if (newSelectedOptionValues.has(value)) {
        newSelectedOptionValues.delete(value);
      }
    }
    this.selectedOptionValues = newSelectedOptionValues;
  }

  /**
   * toggle select status of certain options
   * @public
   */
  @withPlainSetSelectedOptionValues
  toggleOptions(optionValues: selectedOptionValues) {
    const newSelectedOptionValues = new Set(this.selectedOptionValues);
    for (const value of optionValues) {
      if (this.options.has(value)) {
        newSelectedOptionValues.has(value) ? newSelectedOptionValues.delete(value) : newSelectedOptionValues.add(value);
      }
    }
    this.selectedOptionValues = newSelectedOptionValues;
  }

  /**
   * clear current selection
   * @public
   */
  @withPlainSetSelectedOptionValues
  clearSelection() {
    this.selectedOptionValues = new Set();
  }

  /**
   * reverse current selection
   * @public
   */
  @withPlainSetSelectedOptionValues
  reverseSelection() {
    const newSelectedOptionValues = new Set<selectedOptionValue>();
    for (const value of this.selectedOptionValues) {
      if (!this.options.has(value)) {
        newSelectedOptionValues.add(value);
      }
    }
    this.selectedOptionValues = newSelectedOptionValues;
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

  _getCurrentPoint(e: MouseEvent | Touch) {
    const { left, top, width, height } = this.contentRef.getBoundingClientRect();

    return {
      x: Math.max(0, Math.min(e.clientX - left - this.contentRef.clientLeft, width)),
      y: Math.max(0, Math.min(e.clientY - top - this.contentRef.clientTop, height)),
    };
  }

  /**
   * avoid drag when mouseEvent trigger on border or scrollbar
   */
  _isMouseEventInClientArea(e: MouseEvent | Touch) {
    const el = this.contentRef;

    if (
      e.clientX < el.getBoundingClientRect().left + el.clientLeft ||
      e.clientX > el.getBoundingClientRect().left + el.clientLeft + el.clientWidth
    ) {
      return false;
    }
    if (
      e.clientY < el.getBoundingClientRect().top + el.clientTop ||
      e.clientY > el.getBoundingClientRect().top + el.clientTop + el.clientHeight
    ) {
      return false;
    }
    return true;
  }
  //#region mouseEvent
  _onMousedown(e: MouseEvent) {
    e.preventDefault();
    this._dragStart(e);
    window.addEventListener("mousemove", this._onMousemove);
    window.addEventListener("mouseup", this._onMouseup);
  }

  @throttle("throttledMounsemoveHandler")
  _onMousemove(e: MouseEvent) {
    this._drag(e);
    e.preventDefault();
    e.stopPropagation();
  }

  _onMouseup() {
    this.cleanDrag();
  }
  //#endregion

  //#region touchEvent
  _onTouchStart(e: TouchEvent) {
    e.preventDefault();
    this._touching = true;
    this._dragStart(e.touches[0]);
    window.addEventListener("touchmove", this._onTouchMove);
    window.addEventListener("touchend", this._onTouchEnd);
  }

  @throttle("throttledMounsemoveHandler")
  _onTouchMove(e: TouchEvent) {
    this._touching && this._drag(e.touches[0]);
  }

  _onTouchEnd() {
    this._touching = false;
    this.cleanDrag();
  }
  //#endregion

  _onClick(e: MouseEvent) {
    if (this.dragged) {
      return;
    }
    const eventTargetDragSelectOption = this._getDragSelectOptionByMouseEvent(e);
    if (eventTargetDragSelectOption) {
      this.selectedOptionValues = new Set([eventTargetDragSelectOption.value]);
    }
  }

  @throttle("throttledScrollHandler")
  _onScrollableParentScroll(e: Event) {
    this._drag(e);
  }

  _dragStart(e: MouseEvent | Touch) {
    // sometime the last state was not cleaned up
    this.cleanDrag();
    this.dragged = false;

    if (!this._isMouseEventInClientArea(e)) {
      return;
    }
    if (!this.draggableOnOption && this._getDragSelectOptionByMouseEvent(e)) {
      return;
    }

    this.startPoint = this._getCurrentPoint(e);
    this.autoScroll = new AutoScroll(this.contentRef);
    this._scrollableParent.addEventListener("scroll", this._onScrollableParentScroll);

    if (this.controlKeyActive) {
      this.originSelectedOptionValues = new Set(this.selectedOptionValues);
    } else {
      this.originSelectedOptionValues = null;
    }
  }

  _drag(e: Event | Touch) {
    this.dragged = true;
    if ((e as MouseWheelEvent).clientX !== undefined) {
      this.lastMouseEvent = e as MouseEvent;
    }
    this.endPoint = this._getCurrentPoint(this.lastMouseEvent);

    this.selectedOptionValues = this._getSelectedOptionValuesByRect(this.dragSelectAreaRect!);
  }

  _dragEnd() {
    this.cleanDrag();
  }

  cleanDrag() {
    window.removeEventListener("mousemove", this._onMousemove);
    window.removeEventListener("mouseup", this._onMouseup);

    window.removeEventListener("touchmove", this._onTouchMove);
    window.removeEventListener("touchend", this._onTouchEnd);

    this.throttledMounsemoveHandler?.cancel();
    this.throttledScrollHandler?.cancel();

    this.startPoint = null;
    this.endPoint = null;
    this.autoScroll?.dispose();

    this._scrollableParent.removeEventListener("scroll", this._onScrollableParentScroll);

    this.optionRectCache = null;
  }

  _getDragSelectOptionByMouseEvent(e: MouseEvent | Touch) {
    let target = e.target;
    const optionElSet = new WeakSet(Array.from(this.options.values()).map((option) => option.$el));
    while (target instanceof Element && target !== this.contentRef) {
      if (optionElSet.has(target)) {
        return (target as VueElement).__vue__ as DragSelectOption;
      }
      target = target.parentElement;
    }
    return null;
  }

  _getRectByPoint(startPoint: Point | null, endPoint: Point | null) {
    if (!startPoint || !endPoint) return null;
    return {
      left: Math.min(startPoint.x, endPoint.x),
      top: Math.min(startPoint.y, endPoint.y),
      width: Math.abs(startPoint.x - endPoint.x),
      height: Math.abs(startPoint.y - endPoint.y),
    };
  }

  _getSelectedOptionValuesByRect(rect: Rect) {
    const selectedOptionValues: Set<selectedOptionValue> = new Set();
    for (const [value, option] of this.options) {
      this._addOptionRectCache(option);
      const isPairRectIsIntersect = pairRectIntersect(rect, this.optionRectCache!.get(value) as Rect);
      if (isPairRectIsIntersect) {
        selectedOptionValues.add(value);
      }
    }

    return selectedOptionValues;
  }

  _addOptionRectCache(option: DragSelectOption) {
    if (!this.optionRectCache) {
      this.optionRectCache = new Map();
    }
    if (!this.optionRectCache.has(option.value)) {
      const optionEl = option.$el as HTMLElement;
      this.optionRectCache.set(option.value, {
        left: optionEl.offsetLeft,
        top: optionEl.offsetTop,
        width: optionEl.offsetWidth,
        height: optionEl.offsetHeight,
      });
    }
  }

  _handleKeyChange(e: KeyboardEvent) {
    this.controlKeyActive = e.ctrlKey || e.metaKey;
    this.shiftKeyActive = e.shiftKey;
  }
}
</script>
