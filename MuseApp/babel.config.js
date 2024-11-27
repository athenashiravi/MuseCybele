module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          alias: {
            "@assets": "./assets", // Alias for the assets directory
            "@components": "./components", // Alias for the components directory
            "@app": "./app", // Alias for the app directory
          },
        },
      ],
    ],
  };
};
