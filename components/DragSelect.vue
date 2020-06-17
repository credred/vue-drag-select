<template>
  <div class="drag-select-wrapper" @mousedown="_onMousedown">
    <slot></slot>
    <div class="drag-select-area" :style="dragSelectAreaStyles"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { findScrollableParent } from "@util/findScrollableParent";

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

@Component
export default class DragSelect extends Vue {
  startPoint: Point | null = null;
  endPoint: Point | null = null;
  lastMouseEvent!: MouseEvent;

  _scrollableParent!: HTMLElement;

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
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  }

  _getSelfRect() {
    const el = this.$el as HTMLElement;
    return {
      left: el.offsetLeft,
      top: el.offsetTop,
      width: el.getBoundingClientRect().width,
      height: el.getBoundingClientRect().height,
    };
  }

  _getCurrentPoint(e: MouseEvent) {
    const selfRect = this._getSelfRect();
    return {
      x: Math.max(
        0,
        Math.min(e.clientX - (this.$el as HTMLElement).offsetLeft + this._scrollableParent.scrollLeft, selfRect.width)
      ),
      y: Math.max(
        0,
        Math.min(e.clientY - (this.$el as HTMLElement).offsetTop + this._scrollableParent.scrollTop, selfRect.height)
      ),
    };
  }

  mounted() {
    this._scrollableParent = findScrollableParent(this.$el as HTMLElement) as HTMLElement;
  }

  _onMousedown(e: MouseEvent) {
    this.startPoint = this._getCurrentPoint(e);
    window.addEventListener("mousemove", this._onMousemove);
    window.addEventListener("mouseup", this._onMouseup);
    this._scrollableParent.addEventListener("scroll", this._onScrollableParentScroll);
  }

  _onMousemove(e: MouseEvent) {
    this._drag(e);
  }

  _onMouseup() {
    this.startPoint = null;
    this.endPoint = null;

    window.removeEventListener("mousemove", this._onMousemove);
    window.removeEventListener("mouseup", this._onMouseup);
  }

  _onScrollableParentScroll(e: Event) {
    this._drag(e);
  }

  _drag(e: Event) {
    if ((e as MouseWheelEvent).clientX !== undefined) {
      this.lastMouseEvent = e as MouseEvent;
    }
    this.endPoint = this._getCurrentPoint(this.lastMouseEvent);
  }
}
</script>

<style lang="scss">
.drag-select-wrapper {
  position: relative;
}
.drag-select-area {
  position: absolute;
}
</style>
