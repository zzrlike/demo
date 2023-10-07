// 引入项目中全部的需要注册全局的组件
import Svgicon from './Svgicon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'

// 引入全部的element-plus图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 全局组件对象
const allGloablComponent: any = {
  Svgicon,
  Pagination,
  Category,
}

// 对外暴露自定义插件对象
export default {
  // 方法务必要叫做install
  install(app: any) {
    // 利用以下方法将所有组件注册为全局组件
    Object.keys(allGloablComponent).forEach((key) => {
      app.component(key, allGloablComponent[key])
    })
    // 将element-plus提供的图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
