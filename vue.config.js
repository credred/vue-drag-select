// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/** @type {import("@vue/cli-service").ProjectOptions} */
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set("@", path.join(__dirname, "components"));
    config.resolve.alias.set("@util", path.join(__dirname, "components/_util"));
  },
};
