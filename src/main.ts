import { createApp } from 'vue'
import App from '@/App.vue'

// 引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 配置element-plus国际化,也就是中文配置
// 注意:报错one,因为Ts无法主动发现模块(也可能是文件没有声明.ts文件类型),需要在vite-env.d.ts文件中主动配置
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// svg插件配置代码
import 'virtual:svg-icons-register'

// 引入封装的svg,注册为全局组件(需要考虑组件过多的情况下,就使用自定义插件注册全局组件)
// import Svgicon from '@/components/Svgicon/index.vue'
// app.component('Svgicon', Svgicon)

// 引入我们自己设置的自定义插件,并安装
import globalComponents from '@/components/index.ts'

// 引入模板全局样式
import '@/styles/index.scss'

// 引入模板路由
import router from './router'

// 引入pinia仓库
import pinia from './store'

// 引入路由鉴权文件
import './peermisstion'

// 引入自定义指令
import { isHasButton } from './directive/has'

// 获取应用实例对象
const app = createApp(App)

// 注册模板路由
app.use(router)

// 安装pinia仓库
app.use(pinia)

// 安装element-plus插件
app.use(ElementPlus, {
  // element-plus国际化中文配置
  locale: zhCn,
})

// 安装使用后,会自动调用自定义插件里的install方法
app.use(globalComponents)

// 使用自定义指令
isHasButton(app)

// 将应用挂载到挂载点上
app.mount('#app')
