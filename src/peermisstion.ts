// 路由鉴权:项目当中路由能不能被权限的设置(某个路由哪些条件允许访问,哪些不允许)
import router from './router'
import setting from './setting'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })

// 获取用户相关的小仓库中的token数据,判断用户是否登陆成功
import pinia from './store'
import userSotre from './store/modules/user'
const usersSotre = userSotre(pinia)

// 全局前置守卫
router.beforeEach(async (to: any, _from: any, next: any) => {
  document.title = `${setting.title}-${to.meta.title}`
  // to:代表你访问的路由对象
  // from:你从哪个路由而来
  // next:路由放行函数
  nprogress.start()
  // 获取token,去判断用户登陆,还是未登录
  const token = usersSotre.token
  // 获取用户名字
  const username = usersSotre.username
  // 登陆成功
  if (token) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 登陆成功访问其他6个路由
      if (username) {
        next()
      } else {
        try {
          await usersSotre.userInfo()
          // 注意:刷新异步路由时,有可能获取到用户信息,但异步路由还未加载完毕,页面就会出现空白现象
          next({ ...to, replace: true })
        } catch (error) {
          // token过期
          // 用户手动修改本地存储token
          await usersSotre.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
    // 登陆失败
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局后置守卫
router.afterEach(() => {
  nprogress.done()
})
