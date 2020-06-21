import { Rect } from "@/_typings/index";
import { findScrollableParent } from "@util/findScrollableParent";

export class AutoScroll {
  scrollGutter: number;
  maxScrollVelocity: number;
  maxScrollSpacing: number;
  scrollableParent: HTMLElement | null;
  scrollableParentRect: Rect | undefined;
  xScrollVelocity = 0;
  get needXScroll() {
    return this.xScrollVelocity !== 0;
  }
  yScrollVelocity = 0;
  get needYScroll() {
    return this.yScrollVelocity !== 0;
  }
  cancelScrollId: number | undefined;
  constructor(scrollTargetElement: HTMLElement, scrollGutter = 0, maxScrollSpacing = 15, maxScrollVelocity = 15) {
    this.scrollGutter = scrollGutter;
    this.maxScrollVelocity = maxScrollVelocity;
    this.maxScrollSpacing = maxScrollSpacing;
    this.scrollableParent = findScrollableParent(scrollTargetElement);
    if (this.scrollableParent) {
      this.scrollableParentRect = {
        left: this.scrollableParent.offsetLeft,
        top: this.scrollableParent.offsetTop,
        width: this.scrollableParent.offsetWidth,
        height: this.scrollableParent.offsetHeight,
      };
      window.addEventListener("mousemove", this._onMouseMove);
    }
  }

  public dispose() {
    window.removeEventListener("mousemove", this._onMouseMove);
    this.stopScroll();
  }

  _onMouseMove = (e: MouseEvent) => {
    this._computeScrollVelocity(e);
    if (this.needXScroll || this.needYScroll) {
      e.preventDefault();
      e.stopPropagation();
      this.startScroll();
    } else {
      this.stopScroll();
    }
  };

  _computeScrollVelocity(e: MouseEvent) {
    if (!this.scrollableParentRect) {
      this.xScrollVelocity = 0;
      this.yScrollVelocity = 0;
      return;
    }
    const scrollableEdge = {
      top: this.scrollableParentRect.top + this.scrollGutter,
      bottom: this.scrollableParentRect.top + this.scrollableParentRect.height - this.scrollGutter,
      left: this.scrollableParentRect.left + this.scrollGutter,
      right: this.scrollableParentRect.left + this.scrollableParentRect.width - this.scrollGutter,
    };

    if (e.clientY < scrollableEdge.top) {
      this.yScrollVelocity = -Math.min(
        this.maxScrollVelocity,
        (this.maxScrollVelocity * -(e.clientY - scrollableEdge.top)) / this.maxScrollSpacing
      );
    } else if (e.clientY > scrollableEdge.bottom) {
      this.yScrollVelocity = Math.min(
        this.maxScrollVelocity,
        (this.maxScrollVelocity * (e.clientY - scrollableEdge.bottom)) / this.maxScrollSpacing
      );
    } else {
      this.yScrollVelocity = 0;
    }
    if (e.clientX < scrollableEdge.left) {
      this.xScrollVelocity = -Math.min(
        this.maxScrollVelocity,
        (this.maxScrollVelocity * -(e.clientX - scrollableEdge.left)) / this.maxScrollSpacing
      );
    } else if (e.clientX > scrollableEdge.right) {
      this.xScrollVelocity = Math.min(
        this.maxScrollVelocity,
        (this.maxScrollVelocity * (e.clientX - scrollableEdge.right)) / this.maxScrollSpacing
      );
    } else {
      this.xScrollVelocity = 0;
    }
  }

  startScroll() {
    if (!this.cancelScrollId) {
      this.doScroll();
    }
  }

  doScroll = () => {
    if (this.scrollableParent) {
      if (this.needXScroll) {
        this.scrollableParent.scrollLeft += this.xScrollVelocity;
      }
      if (this.needYScroll) {
        this.scrollableParent.scrollTop += this.yScrollVelocity;
      }
    }
    this.cancelScrollId = window.requestAnimationFrame(this.doScroll);
  };

  stopScroll() {
    if (this.cancelScrollId) {
      window.cancelAnimationFrame(this.cancelScrollId);
      this.cancelScrollId = undefined;
    }
  }
}
