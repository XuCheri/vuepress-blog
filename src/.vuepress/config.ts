import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
export default defineUserConfig({
  base: "/vuepress-blog/",

  locales: {
    "/": {
      lang: "en-US",
      title: "Cherii",
      description: "Cheri's little home",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "Cherii",
      description: "Cheri的小窝",
    },
  },

  theme,
  plugins: [
  ],

  // Enable it with pwa
  // shouldPrefetch: false,
});
