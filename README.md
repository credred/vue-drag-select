<h1 align="center">vue-drag-select</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@coleqiu/vue-drag-select">
    <img src="https://img.shields.io/npm/v/@coleqiu/vue-drag-select"/>
  </a>
  <a href="https://codecov.io/gh/credred/vue-drag-select">
    <img src="https://codecov.io/gh/credred/vue-drag-select/branch/master/graph/badge.svg?token=HRF6OPQ1SB"/>
  </a>
  <a href="https://github.com/credred/vue-drag-select/actions/workflows/test.yml">
    <img src="https://github.com/credred/vue-drag-select/actions/workflows/test.yml/badge.svg"/>
  </a>
  <a href="https://bundlephobia.com/package/@coleqiu/vue-drag-select">
    <img src="https://img.shields.io/bundlephobia/minzip/@coleqiu/vue-drag-select"/>
  </a>
</p>

## 🔧Installation
```bash
npm i @coleqiu/vue-drag-select
```

```bash
yarn add @coleqiu/vue-drag-select
```

## 📘Demo
[Storybook](https://credred.github.io/vue-drag-select/)

[![Edit vue-drag-select-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vue-drag-select-example-3d0cof?fontsize=14&hidenavigation=1&theme=dark)

## 🧭Quick Guide
### ⚙Import
```javascript
import { createApp } from "vue";
import VueDragSelect from "@coleqiu/vue-drag-select";

const app = createApp(App);
app.use(VueDragSelect);
```

### 🚀Usage
```vue
<script setup lang="ts">
import { ref } from 'vue';

const selection = ref([]);
const options = [ "item1", "item2", "item3" ];
</script>

<template>
  <drag-select v-model="selection">
    <drag-select-option v-for="item in options" :value="item" :key="item">{{item}}</drag-select-option>
  </drag-select>
</template>

<style>
.drag-select-option {
  width: 100px;
  height: 100px;
  color: #ffffff;
  background: #E37E26;
}

.drag-select-option--selected {
  color: #000000;
  background: #5fdddc;
}
</style>
```

## 📖Ducumentation
### DragSelect Attributes
Attribute | Description | Type | Default
-|-|-|-
modelValue / v-model | binding value | Array<string> \| Set<string \| number> | --(required)
background | background color of drag area, 'none' represent hide this style to avoid override background color of class | string | rgba(66, 153, 225, 0.5 |
draggableOnOption | can draggable when dragstart event target on DragSelectOption | boolean | true
dragAreaClass | the class names of drag area | string | --
dragAreaStyle | the class styles of drag area | string | --
selectedOptionClass | the class names of selected DragSelectOption | string | --
selectedOptionStyle | the selected styles of selected DragSelectOption | string | --
<!-- disabled | whether DragSelect is disabled | boolean | false -->

<!-- ### DragSelect Methods
Method | Description | Parameters
-|-|-
selectAll | select all options | --
selectOptions | select certain options | Array<string \| index>
deselectOptions | deselect certain options | Array<string \| index>
toggleOptions | toggle select status of certain options | Array<string \| index>
clearSelection | clear current selection | --
reverseSelection | reverse current selection | -- -->

### DragSelectOption Attributes
Attribute | Description | Type | Default
-|-|-|-
value | binding value | string \| index | --(required)
disabled | whether DragSelectOption is disabled | boolean | false
selectedClass | the class names of selected option | boolean | --

### Component classNames
this package havn't enough styles,you can use following classNames to add styles.
name | Description
-|-
drag-select__wrapper | the className of DragSelect itself
drag-select | the className of the container of dragSelectOption
drag-select__area | the className of drag area
drag-select-option | the className of dragSelectOption component
drag-select-option--selected | the className of dragSelectOption component which are selected
drag-select-option--disabled | the className of dragSelectOption component which are disabled