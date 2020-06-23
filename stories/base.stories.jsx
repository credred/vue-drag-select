import DragSelect from "../components/DragSelect.vue";
import DragSelectOption from "../components/DragSelectOption.vue";
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
    methods: {
      handleChange(value) {
        this.value = value;
      },
    },
    render() {
      return (
        <div>
          <div>selected: {this.value.join(",")}</div>
          <DragSelect value={this.value} onChange={this.handleChange}>
            {Array(20)
              .fill(0)
              .map((v, index) => (
                <DragSelectOption itemKey={index}>{index}</DragSelectOption>
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
          <DragSelect value={this.value} style={{ height: "300px", overflow: "auto" }} onChange={this.handleChange}>
            {Array(30)
              .fill(0)
              .map((v, index) => (
                <DragSelectOption itemKey={index}>{index}</DragSelectOption>
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
          <DragSelect value={this.value} onChange={this.handleChange}>
            {Array(30)
              .fill(0)
              .map((v, index) => (
                <DragSelectOption itemKey={index}>{index}</DragSelectOption>
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
          <DragSelect
            value={this.value}
            style={{ height: "300px", overflow: "auto", border: "20px solid #d83512" }}
            onChange={this.handleChange}
          >
            {Array(30)
              .fill(0)
              .map((v, index) => (
                <DragSelectOption itemKey={index}>{index}</DragSelectOption>
              ))}
          </DragSelect>
        </div>
      );
    },
  });
