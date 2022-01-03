module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:9090/",
        secure: false,
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/scss/variables/main.scss";`,
      },
    },
  },
};
