// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import prettier from "eslint-config-prettier";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...storybook.configs["flat/recommended"],
  prettier,
  // 複雑度ルール（テスト・Storybook は除外）
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["**/*.test.{ts,tsx}", "**/*.stories.{ts,tsx}"],
    rules: {
      // 循環的複雑度（分岐の数）: 10 以下
      complexity: ["warn", { max: 10 }],
      // ネストの深さ: 4 以下
      "max-depth": ["warn", { max: 4 }],
      // 関数の行数: 50 行以下
      "max-lines-per-function": [
        "warn",
        { max: 50, skipBlankLines: true, skipComments: true },
      ],
      // 関数の引数: 4 つ以下
      "max-params": ["warn", { max: 4 }],
    },
  },
  // Storybook ルールの調整（@storybook/react の型インポートは許可）
  {
    files: ["**/*.stories.tsx"],
    rules: {
      "storybook/no-renderer-packages": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "storybook-static/**",
    // Playwright
    "playwright-report/**",
    "test-results/**",
    "playwright/.cache/**",
  ]),
]);

export default eslintConfig;
