import Vue from "vue";

import DragSelect from "./DragSelect.vue";
import DragSelectOption from "./DragSelectOption.vue";

const install = (VueInstance: typeof Vue) => {
  VueInstance.component("DragSelect", DragSelect);
  VueInstance.component("DragSelectOption", DragSelectOption);
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  DragSelect,
  DragSelectOption,
};
