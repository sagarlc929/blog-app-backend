import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Retain browser globals if needed
        ...globals.node,    // Add Node.js globals
      },
      ecmaVersion: 2021, // Ensure support for modern JavaScript
    },
  },
  pluginJs.configs.recommended, // Use ESLint's recommended rules
];

