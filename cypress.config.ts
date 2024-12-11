import {defineConfig} from "cypress";

export default defineConfig({
  e2e: {
    supportFile: "cypress/support/component.ts", // Asigură-te că calea este corectă
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
