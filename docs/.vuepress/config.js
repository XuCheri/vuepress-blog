import { blogPlugin } from '@vuepress/plugin-blog'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
//Oh my live2d插件
import { oml2dPlugin } from 'vuepress-plugin-oh-my-live2d';
//docsearch插件
import { searchProPlugin } from "vuepress-plugin-search-pro";
//分享插件
import { socialSharePlugin } from 'vuepress-plugin-social-share'

export default defineUserConfig({
  lang: 'zh-ch',
  base: '/vuepress-blog/',
  title: 'Sherry',
  description: 'Blog Site',

  theme: defaultTheme({
    logo: '/images/Maltese.jpg',

    navbar: [
      {
        text: '主页',
        link: '/',
      },
      {
        text: '随笔',
        link: '/article/',
      },
      {
        text: '分类',
        link: '/category/',
      },
      {
        text: '标签',
        link: '/tag/',
      },
      {
        text: '时间线',
        link: '/timeline/',
      },
    ],
  }),

  plugins: [
    blogPlugin({
      // Only files under posts are articles
      filter: ({ filePathRelative }) =>
        filePathRelative ? filePathRelative.startsWith('posts/') : false,

      // Getting article info
      getInfo: ({ frontmatter, title, data }) => ({
        title,
        author: frontmatter.author || '',
        date: frontmatter.date || null,
        category: frontmatter.category || [],
        tag: frontmatter.tag || [],
        excerpt:
          // Support manually set excerpt through frontmatter
          typeof frontmatter.excerpt === 'string'
            ? frontmatter.excerpt
            : data?.excerpt || '',
      }),

      // Generate excerpt for all pages excerpt those users choose to disable
      excerptFilter: ({ frontmatter }) =>
        !frontmatter.home &&
        frontmatter.excerpt !== false &&
        typeof frontmatter.excerpt !== 'string',

      category: [
        {
          key: 'category',
          getter: (page) => page.frontmatter.category || [],
          layout: 'Category',
          itemLayout: 'Category',
          frontmatter: () => ({
            title: 'Categories',
            sidebar: false,
          }),
          itemFrontmatter: (name) => ({
            title: `Category ${name}`,
            sidebar: false,
          }),
        },
        {
          key: 'tag',
          getter: (page) => page.frontmatter.tag || [],
          layout: 'Tag',
          itemLayout: 'Tag',
          frontmatter: () => ({
            title: 'Tags',
            sidebar: false,
          }),
          itemFrontmatter: (name) => ({
            title: `Tag ${name}`,
            sidebar: false,
          }),
        },
      ],

      type: [
        {
          key: 'article',
          // Remove archive articles
          filter: (page) => !page.frontmatter.archive,
          layout: 'Article',
          frontmatter: () => ({
            title: 'Articles',
            sidebar: false,
          }),
          // Sort pages with time and sticky
          sorter: (pageA, pageB) => {
            if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
              return pageB.frontmatter.sticky - pageA.frontmatter.sticky

            if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky) return -1

            if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky) return 1

            if (!pageB.frontmatter.date) return 1
            if (!pageA.frontmatter.date) return -1

            return (
              new Date(pageB.frontmatter.date).getTime() -
              new Date(pageA.frontmatter.date).getTime()
            )
          },
        },
        {
          key: 'timeline',
          // Only article with date should be added to timeline
          filter: (page) => page.frontmatter.date instanceof Date,
          // Sort pages with time
          sorter: (pageA, pageB) =>
            new Date(pageB.frontmatter.date).getTime() -
            new Date(pageA.frontmatter.date).getTime(),
          layout: 'Timeline',
          frontmatter: () => ({
            title: 'Timeline',
            sidebar: false,
          }),
        },
      ],
      hotReload: true,
    }),
    oml2dPlugin({
      // 在这里配置选项
      models: [
        {
          path: 'https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/Live2D/Senko_Normals/senko.model3.json',
          scale: 0.12,
          position: [-10, 50],
          stageStyle: {
            width: 350
          }
        },
        {
          "path": "https://model.oml2d.com/Senko_Normals/senko.model3.json",
          "position": [-10, 20]
        },
        {
          "path": "https://model.oml2d.com/Pio/model.json",
          "scale": 0.4,
          "position": [0, 50],
          "stageStyle": {
            "height": 300
          }
        },
        {
          "path": "https://model.oml2d.com/shizuku/shizuku.model.json",
          "scale": 0.2,
          "volume": 0,
          "position": [70, 70],
          "stageStyle": {
            "height": 370,
            "width": 400
          }
        },
        {
          "path": "https://model.oml2d.com/shizuku_pajama/index.json",
          "scale": 0.2,
          "volume": 0,
          "position": [40, 10],
          "stageStyle": {
            "height": 350,
            "width": 330
          }
        },
        {
          "path": "https://model.oml2d.com/HK416-1-normal/model.json",
          "position": [0, 60],
          "scale": 0.08,
          "stageStyle": {
            "height": 450
          }
        },
        {
          "path": "https://model.oml2d.com/cat-black/model.json",
          "scale": 0.15,
          "position": [0, 20],
          "stageStyle": {
            "height": 350
          }
        }
      ]
    }),
    searchProPlugin({
      // 配置选项
    }),
    socialSharePlugin()
  ],

  bundler: viteBundler(),
})
