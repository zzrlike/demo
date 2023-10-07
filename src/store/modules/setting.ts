// 关于layout组件配置的仓库
import { defineStore } from 'pinia'

const useLayoutSettings = defineStore('useLayoutSettings', {
  state: () => {
    return {
      // 控制菜单折叠
      fold: false,
      // 控制刷新效果
      refsh: false,
    }
  },
})

export default useLayoutSettings
