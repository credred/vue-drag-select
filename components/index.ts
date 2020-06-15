import Vue from "vue";

import DragSelect from "@/DragSelect.vue";
import DragSelectOption from "@/DragSelectOption.vue";

const install = (VueInstance: typeof Vue) => {
  VueInstance.component(DragSelect.name, DragSelect);
  VueInstance.component(DragSelectOption.name, DragSelectOption);
};

export default {
  install,
  DragSelect,
  DragSelectOption,
};
