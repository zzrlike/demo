// 引入仓库
import pinia from '@/store'
import userSotre from '@/store/modules/user'

// 创建仓库实例
const useSotre = userSotre(pinia)

// 定义自定义指令方法
export const isHasButton = (app: any) => {
  // 获取对应的用户仓库
  // 全局自定义指令:实现按钮的权限
  app.directive('has', {
    // 代表使用全局自定义指令的DOM或者组件挂载完毕时执行一次
    // el:使用自定义指令所对应的DOM节点
    // options:自定义指令所对应的值
    mounted(el: any, options: any) {
      // 用户信息buttons数组当中没有,则从DOM当中干掉
      if (!useSotre.buttons.includes(options.value)) {
        el.parentNode.removeChild(el)
      }
    },
  })
}
