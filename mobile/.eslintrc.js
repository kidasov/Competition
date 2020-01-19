module.exports = {
  root: true,
  extends: ["@react-native-community", "prettier"],
  plugins: [
    // ...
    "react-hooks",
    "prettier"
  ],
  rules: {
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
    "object-curly-spacing": ["error", "always"],
    "prettier/prettier": "error"
  }
};
