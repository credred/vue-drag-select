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

## 📖Ducumentation
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
    <drag-select-option item-key="uniqueKey"></drag-select-option>
  </drag-select>
</template>

<script>
export default {
  data() {
    return {
      selection: [],
    };
  },
};
</script>
```
