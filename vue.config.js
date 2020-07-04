// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/** @type {import("@vue/cli-service").ProjectOptions} */
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set("@", path.join(__dirname, "components"));
    config.resolve.alias.set("@util", path.join(__dirname, "components/_util"));

    // These are some necessary steps changing the default webpack config of the Vue CLI
    // that need to be changed in order for Typescript based components to generate their
    // declaration (.d.ts) files.
    //
    // Discussed here https://github.com/vuejs/vue-cli/issues/1081
    if (process.env.NODE_ENV === "production") {
      config.module.rule("ts").uses.delete("cache-loader");

      config.module
        .rule("ts")
        .use("ts-loader")
        .loader("ts-loader")
        .tap((opts) => {
          opts.transpileOnly = false;
          opts.happyPackMode = false;
          return opts;
        });

      config.externals(["vue-class-component", "vue-property-decorator"]);
    }
  },
  parallel: false,
};
