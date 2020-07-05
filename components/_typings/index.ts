export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface VueElement extends Element {
  __vue__: Vue;
}
