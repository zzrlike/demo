// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入路由
import router from '@/router'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入变量类型
import type { loginFormdata, loginResponseData, userInfoReponseData } from '@/api/user/type'
import type { UserState } from './types/type'
// 引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由(常量路由, 异步路由, 任意路由)
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
// 引入lodash库:深拷贝方法
import cloneDeep from 'lodash/cloneDeep'

// 用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

// 创建用户小仓库(组合式API小仓库)
const userSotre = defineStore('User', {
  // 小仓库存储数据
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
      // 存储当前用户是否包含哪些按钮
      buttons: [],
    }
  },
  actions: {
    // 用户登录方法
    async userLogin(data: loginFormdata) {
      // 登录请求
      const result: loginResponseData = await reqLogin(data)
      // 登陆请求:200 -> token
      // 登陆失败:201 -> 登陆失败错误的信息
      if (result.code == 200) {
        // 注:pinia|vuex存储数据是利用js对象,存储数据并不持久
        this.token = result.data as string
        // 持久化存储数据方法
        // pinia插件:pinia-plugin-persistedstate可以实现仓库永久化存储
        // localStorage.setItem('TOKEN', result.data.token as string)
        SET_TOKEN(result.data as string)
        // 能保证async函数能返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },

    // 获取用户信息方法
    async userInfo() {
      // 获取用户信息存储仓库之中[用户头像,名字]
      const result: userInfoReponseData = await reqUserInfo()
      // 如果获取用户信息成功,则存储用户信息
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        // 计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes)
        // 菜单需要的数据整理完毕
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        // 目前路由器管理的只有常量路由:用户计算完毕的异步路由,任意路由得动态追加
        ;[...userAsyncRoute, anyRoute].forEach((route: any) => {
          router.addRoute(route)
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },

    // 退出登录方法
    async userLogout() {
      const result: any = await reqLogout()
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

export default userSotre
