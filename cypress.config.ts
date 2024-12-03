import {defineConfig} from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // URL-ul serverului local
    supportFile: false,
  },
});
