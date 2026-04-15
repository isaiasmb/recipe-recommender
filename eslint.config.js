// eslint.config.js
import js from "@eslint/js"
import globals from "globals"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import jsxA11y from "eslint-plugin-jsx-a11y"
import prettierRecommended from "eslint-plugin-prettier/recommended"
import tseslint from "typescript-eslint"
import standard from "eslint-config-standard"
import standardTypescript from "eslint-config-standard-with-typescript"
import { FlatCompat } from "@eslint/eslintrc"
import { defineConfig, globalIgnores } from "eslint/config"

const __dirname = import.meta.dirname
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default defineConfig([
  globalIgnores(["node_modules/**", "dist/**"]),
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      react,
      "jsx-a11y": jsxA11y,
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
        es2021: true,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/self-closing-comp": "error",
      ...prettierRecommended.rules,
      "prettier/prettier": [
        "error",
        {
          printWidth: 80,
          tabWidth: 2,
          singleQuote: true,
          trailingComma: "all",
          arrowParens: "always",
          semi: false,
          endOfLine: "auto",
        },
      ],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "jsx-a11y/alt-text": [
        "warn",
        {
          elements: ["img"],
          img: ["Image"],
        },
      ],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
      "react/no-unknown-property": "error",
    },
  },
  ...compat.extends(
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "standard",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ),
  reactRefresh.configs.vite,
])
