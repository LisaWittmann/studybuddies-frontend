module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:9090/",
        secure: false,
      },
      "^/websocket": {
        target: "ws://localhost:9090/messagebroker",
        ws: true,
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
