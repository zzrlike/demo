/// <reference types="vite/client" />

// 注意:ts文件类型不匹配,配置下列语句
declare module 'element-plus/dist/locale/zh-cn.mjs'
declare module 'nprogress'
declare module 'lodash/cloneDeep'

// 注意:找不到.vue文件的声明,配置下列语句
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
