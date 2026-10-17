import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";
import tailwindcss from "eslint-plugin-tailwindcss";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["watch.js", "dist/**"]),
  js.configs.recommended,
  ...nextCoreWebVitals,
  ...nextTypescript,
  tailwindcss.configs.recommended,
  {
    // The import plugin is already registered by eslint-config-next, so only its rules are added here
    rules: {
      ...importPlugin.flatConfigs.recommended.rules,
      ...importPlugin.flatConfigs.typescript.rules,
    },
  },
  // Placed before the custom rules so `curly` (compatible with Prettier when set to "all") stays enabled
  prettier,
  {
    languageOptions: {
      globals: {
        chrome: "readonly",
      },
    },
    settings: {
      tailwindcss: {
        cssConfigPath: "./src/app/globals.css",
      },
    },
    rules: {
      // ESLint rules
      "arrow-body-style": "error",
      "block-scoped-var": "error",
      curly: "error",
      "default-case-last": "error",
      "default-case": "error",
      "default-param-last": "error",
      "dot-notation": "error",
      eqeqeq: "error",
      "max-lines": ["error"],
      "multiline-comment-style": "error",
      "no-console": "warn",
      "no-duplicate-imports": "error",
      "no-else-return": "warn",
      "no-empty": "error",
      "no-extra-boolean-cast": "warn",
      "no-implicit-globals": "error",
      "no-lone-blocks": "error",
      "no-lonely-if": "error",
      "no-template-curly-in-string": "error",
      "no-unneeded-ternary": "warn",
      "no-useless-rename": "warn",
      "no-var": "error",
      "no-warning-comments": "warn",
      "operator-assignment": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "prefer-destructuring": "warn",
      "prefer-rest-params": "warn",
      "require-await": "error",
      "sort-vars": "warn",
      // React rules
      "react/react-in-jsx-scope": "off",
      // Import rules
      "import/order": [
        "warn",
        {
          groups: [
            "builtin", // Built-in imports (come from NodeJS native) go first
            "external", // <- External imports
            "internal", // <- Absolute imports
            ["sibling", "parent"], // <- Relative imports, the sibling and parent types they can be mingled together
            "index", // <- index imports
            "unknown", // <- unknown
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc", // sort in ascending order. Options: ["ignore", "asc", "desc"]
            caseInsensitive: true, // ignore case. Options: [true, false]
          },
        },
      ],
    },
  },
]);
