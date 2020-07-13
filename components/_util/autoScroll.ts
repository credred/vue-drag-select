import { findScrollableParent } from "./findScrollableParent";

export class AutoScroll {
  scrollGutter: number;
  maxScrollVelocity: number;
  maxScrollSpacing: number;
  scrollableParent: HTMLElement | null;
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
      window.addEventListener("mousemove", this._onMouseMove);
      window.addEventListener("touchmove", this._onMouseMove, { passive: false });
    }
  }

  public dispose() {
    window.removeEventListener("mousemove", this._onMouseMove);
    window.removeEventListener("touchmove", this._onMouseMove, true);
    this.stopScroll();
  }

  _onMouseMove = (e: MouseEvent | TouchEvent) => {
    this._computeScrollVelocity(e instanceof TouchEvent ? e.touches[0] : e);
    e.preventDefault();
    e.stopPropagation();
    if (this.needXScroll || this.needYScroll) {
      this.startScroll();
    } else {
      this.stopScroll();
    }
  };

  _computeScrollVelocity(e: MouseEvent | Touch) {
    if (!this.scrollableParent) {
      this.xScrollVelocity = 0;
      this.yScrollVelocity = 0;
      return;
    }
    const rect = this.scrollableParent.getBoundingClientRect();
    const scrollableEdge = {
      top: rect.top + this.scrollGutter,
      bottom: rect.top + this.scrollableParent.clientHeight - this.scrollGutter,
      left: rect.left + this.scrollGutter,
      right: rect.left + this.scrollableParent.clientWidth - this.scrollGutter,
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
