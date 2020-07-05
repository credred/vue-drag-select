import DragSelect from "@/DragSelect.vue";
import DragSelectOption from "@/DragSelectOption.vue";
import "./base.scss";
import Vue from "vue";

export default {
  title: "base",
};

export const base = () =>
  Vue.extend({
    data() {
      return {
        value: [],
      };
    },
    render() {
      return (
        <div>
          <div>try drag or click</div>
          <div>selected: {this.value.join(",")}</div>
          <DragSelect vModel={this.value}>
            {Array(20)
              .fill(0)
              .map((v, index) => (
                <DragSelectOption value={index}>{index}</DragSelectOption>
              ))}
          </DragSelect>
        </div>
      );
    },
  });

export const scroll = () =>
  Vue.extend({
    data() {
      return {
        value: [],
      };
    },
    methods: {
      handleChange(value) {
        this.value = value;
      },
    },
    render() {
      return (
        <div>
          <div>scroll on dragSelect compoent itself</div>
          <div>selected: {this.value.join(",")}</div>
          <DragSelect vModel={this.value} style={{ height: "300px", overflow: "auto" }}>
            {Array(30)
              .fill(0)
              .map((v, index) => (
                <DragSelectOption value={index}>{index}</DragSelectOption>
              ))}
          </DragSelect>
        </div>
      );
    },
  });

export const scrollOnParent = () =>
  Vue.extend({
    data() {
      return {
        value: [],
      };
    },
    methods: {
      handleChange(value) {
        this.value = value;
      },
    },
    render() {
      return (
        <div style={{ height: "300px", overflow: "auto" }}>
          <div>scroll on dragSelect compoent parent</div>
          <div>selected: {this.value.join(",")}</div>
          <DragSelect vModel={this.value}>
            {Array(30)
              .fill(0)
              .map((v, index) => (
                <DragSelectOption value={index}>{index}</DragSelectOption>
              ))}
          </DragSelect>
        </div>
      );
    },
  });

export const dragOnlyInRect = () =>
  Vue.extend({
    data() {
      return {
        value: [],
      };
    },
    methods: {
      handleChange(value) {
        this.value = value;
      },
    },
    render() {
      return (
        <div>
          <div>drag only in client(mousedown event will not trigger on scrollbar or border)</div>
          <div>selected: {this.value.join(",")}</div>
          <DragSelect vModel={this.value} style={{ height: "300px", overflow: "auto", border: "20px solid #d83512" }}>
            {Array(30)
              .fill(0)
              .map((v, index) => (
                <DragSelectOption value={index}>{index}</DragSelectOption>
              ))}
          </DragSelect>
        </div>
      );
    },
  });
