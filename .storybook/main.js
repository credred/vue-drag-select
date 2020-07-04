const presetVue = require("@storybook/vue/dist/server/framework-preset-vue");
// override babelDefault to ignore babel-preset-vue
// use @vue/babel-preset-vue instead of babel-preset-vue
presetVue.babelDefault = config => config;

module.exports = {
    stories: ["../stories/base.stories.jsx", "../stories/advance.stories.jsx"],
    /**
     * @param storybookConfig {import("webpack").Configuration}
     */
    webpackFinal (storybookConfig) {
        /** @type {import("webpack").Configuration} */
        storybookConfig.devtool = "source-map";
        const vueCliServiceConfig = require("@vue/cli-service/webpack.config");
        // keep storybook md loader
        const mdRule = storybookConfig.module.rules.find(rule => rule.test.source === "\\.md$");
        vueCliServiceConfig.module.rules.push(mdRule);
        
        storybookConfig.module = vueCliServiceConfig.module;
        storybookConfig.optimization = vueCliServiceConfig.optimization;
        storybookConfig.resolveLoader = vueCliServiceConfig.resolveLoader;
        // avoid override storybookConfig.resolve.alias.vue$,use runtimeCompiler version
        delete vueCliServiceConfig.resolve.alias.vue$;
        Object.assign(storybookConfig.resolve.alias, vueCliServiceConfig.resolve.alias);
        storybookConfig.resolve.plugins = vueCliServiceConfig.resolve.plugins;
        storybookConfig.resolve.extensions = vueCliServiceConfig.resolve.extensions;
        storybookConfig.resolve.modules = vueCliServiceConfig.resolve.modules;

        const vueCliServiceConfigPlugins = vueCliServiceConfig.plugins.filter(plugin => {
            if (["html", "copy", "preload", "prefetch"].includes(plugin.__pluginName)) return false;
            return true;
        });
        const storybookConfigPlugin = storybookConfig.plugins.filter(plugin => {
            if (plugin instanceof require("vue-loader/lib/plugin")) return false;
            return true;
        })
        storybookConfig.plugins = [].concat(vueCliServiceConfigPlugins, storybookConfigPlugin);
        
        if (process.env.NODE_ENV === "production") {
            /** override externals */
            storybookConfig.externals = {
                vue: "Vue",
                'react': 'React',
                'react-dom': 'ReactDOM',
            }
        }

        return storybookConfig;
    }
}