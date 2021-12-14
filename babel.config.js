module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  env: {
    production: {
      // remove console.logs on production
      plugins: ["transform-remove-console"],
    },
  },
};
