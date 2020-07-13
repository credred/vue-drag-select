# vue-drag-select
A drag select component for Vue.js

## 🔧Installation
```bash
npm i @coleqiu/vue-drag-select
```

```bash
yarn add @coleqiu/vue-drag-select
```

## 📘Demo
[Online Demo](https://credred.github.io/vue-drag-select/)

## 🧭Quick Guide
### ⚙Import
```javascript
import Vue from "vue";
import VueDragSelect from "@coleqiu/vue-drag-select";

Vue.use(VueDragSelect);
```

### 🚀Usage
```vue
<template>
  <drag-select v-model="selection">
    <drag-select-option v-for="item in options" :value="item" :key="item"></drag-select-option>
  </drag-select>
</template>

<script>
export default {
  data() {
    return {
      selection: [],
      optons: [ "item1", "item2", "item3" ],
    };
  },
};
</script>
```

## 📖Ducumentation
### DragSelect Attributes
Attribute | Description | Type | Default
-|-|-|-
value / v-model | binding value | Array<string \| index> | --(required)
background | background color of drag area, 'none' represent hide this style to avoid override background color of class | string | rgba(66, 153, 225, 0.5 |
disabled | whether DragSelect is disabled | boolean | false
draggableOnOption | can draggable when dragstart event target on DragSelectOption | boolean | true
dragAreaClass | the class names of drag area | string | --
dragAreaStyle | the class styles of drag area | string | --
selectedOptionClass | the class names of selected DragSelectOption | string | --
selectedOptionStyle | the selected styles of selected DragSelectOption | string | --

### DragSelect Methods
Method | Description | Parameters
-|-|-
selectAll | select all options | --
selectOptions | select certain options | Array<string \| index>
deselectOptions | deselect certain options | Array<string \| index>
toggleOptions | toggle select status of certain options | Array<string \| index>
clearSelection | clear current selection | --
reverseSelection | reverse current selection | --

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
drag-select__option | the className of dragSelectOption component
drag-select__option--selected | the className of dragSelectOption component which are selected
drag-select__option--disabled | the className of dragSelectOption component which are disabled