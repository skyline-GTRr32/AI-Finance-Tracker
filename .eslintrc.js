module.exports = {
  extends: ["react-app", "react-app/jest"],
  rules: {
    // Prevent specific warnings from causing build failures
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/anchor-is-valid": "warn"
  }
};
