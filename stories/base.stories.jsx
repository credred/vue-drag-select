import DragSelect from "../components/DragSelect.vue";
import DragSelectOption from "../components/DragSelectOption.vue";

import Vue from "vue";

export default {
  title: "base",
};

export const base = () =>
  Vue.extend({
    render() {
      return (
        <DragSelect>
          <DragSelectOption></DragSelectOption>
        </DragSelect>
      );
    },
  });
