import DragSelect from "@/DragSelect.vue";
import DragSelectOption from "@/DragSelectOption.vue";

import Vue from "vue";

export default {
  title: "advance",
};

export const group = () =>
  Vue.extend({
    data() {
      return {
        selection: [],
      };
    },
    render() {
      return (
        <div>
          <div>selected: {this.selection.join(",")}</div>
          <DragSelect vModel={this.selection}>
            {Array(10)
              .fill(0)
              .map((v, index) => (
                <div style={{ border: "1px solid #000000", margin: "10px" }}>
                  <DragSelectOption value={2 * index}>{2 * index}</DragSelectOption>
                  <DragSelectOption value={2 * index + 1}>{2 * index + 1}</DragSelectOption>
                </div>
              ))}
          </DragSelect>
        </div>
      );
    },
  });
