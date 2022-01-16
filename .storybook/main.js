module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "framework": "@storybook/vue3",
  "core": {
    "builder": "storybook-builder-vite"
  },
  async viteFinal(config) {
    config.plugins.push(require("@vitejs/plugin-vue-jsx")());
    if (process.env.NODE_ENV === 'production') {
      config.base = 'vue-drag-select';
    }
    return config;
  },
}
