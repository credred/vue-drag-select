import { addons, setOptions } from "@storybook/addons";
import { create } from "@storybook/theming";
import "./addon-title";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "vue-drag-select",
    brandUrl: "https://github.com/credred/vue-drag-select/",
  }),
});
