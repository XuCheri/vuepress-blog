import comp from "D:/work/vuepress-blog/docs/.vuepress/.temp/pages/tag/wwii/index.html.vue"
const data = JSON.parse("{\"path\":\"/tag/wwii/\",\"title\":\"Tag WWII\",\"lang\":\"zh-ch\",\"frontmatter\":{\"title\":\"Tag WWII\",\"sidebar\":false,\"blog\":{\"type\":\"category\",\"name\":\"WWII\",\"key\":\"tag\"},\"layout\":\"Tag\"},\"headers\":[],\"git\":{},\"filePathRelative\":null,\"excerpt\":\"\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}