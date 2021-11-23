module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:9090/",
        secure: false,

      },
      "^/websocket": {
        target: "ws://localhost:9090/",
        ws: true,
        secure: false,
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/scss/main.scss";`,
      },
    },
  },
};
