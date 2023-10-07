<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" v-if="flag"></component>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import useLayoutSettings from '@/store/modules/setting'
import { ref, watch, nextTick } from 'vue'
let useMainStroe = useLayoutSettings()
// 监听仓库内部数据是否变化,如果发生变化,说明用户点击过刷新按钮
watch(
  () => useMainStroe.refsh,
  () => {
    // 点击刷新按钮:路由组件消毁
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)

// 控制当前组件是否消毁创建
let flag = ref(true)
</script>

<script lang="ts">
export default {
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Main',
}
</script>

<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 1s;
}

.fade-enter-to {
  opacity: 1;
}
</style>
