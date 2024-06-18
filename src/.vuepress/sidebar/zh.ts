import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/zh/": [
    {
      text: "主页",
      link: "/zh/",
      icon: "home",
    },
    {
      text: "如何使用",
      icon: "laptop-code",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
      activeMatch: "^/zh/demo/",
    },
    {
      text: "文章",
      icon: "book",
      prefix: "posts/",
      children: "structure",
      activeMatch: "^/zh/posts/",
    },
    "intro",
    {
      text: "幻灯片",
      icon: "person-chalkboard",
      link: "https://plugin-md-enhance.vuejs.press/zh/guide/content/revealjs/demo.html",
    },
    {
      text: "区块链",
      icon: "/assets/images/solidity.webp",
      prefix: "blockchain/",
      link: "blockchain/",
      children: "structure",
    },
  ],
});
