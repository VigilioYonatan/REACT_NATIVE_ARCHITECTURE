module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@src": "./src",
            "@modules": "./src/modules",
            "@infrastructure": "./src/infrastructure",
            "@components": "./src/components",
            "@hooks": "./src/hooks",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
