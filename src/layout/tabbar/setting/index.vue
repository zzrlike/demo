<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <!-- Popver弹出框：暗黑模式切换 -->
  <el-popover placement="bottom" title="主题设置" :width="200" trigger="click">
    <!-- 表单组件 -->
    <el-form>
      <el-form-item label="暗黑模式">
        <el-color-picker v-model="color" :predefine="predefineColors" @change="setColor" />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch size="small" inline-prompt v-model="dark" active-icon="MoonNight" inactive-icon="Sunny" @change="changeDark" />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <img :src="usersStore.avatar" style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 10px" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ usersStore.username }}
      <el-icon class="el-icon-right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useLayoutSettings from '@/store/modules/setting'
import userSotre from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'

let useSettingsStroe = useLayoutSettings()

let usersStore = userSotre()

let $router = useRouter()
let $route = useRoute()

// 取色器组件数据
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref(['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585', 'rgba(255, 69, 0, 0.68)', 'rgb(255, 120, 0)', 'hsv(51, 100, 98)', 'hsva(120, 40, 94, 0.5)', 'hsl(181, 100%, 37%)', 'hsla(209, 100%, 56%, 0.73)', '#c7158577'])

// 开关组件数据
let dark = ref<boolean>(false)

// 刷新按钮事件
const updateRefsh = () => {
  useSettingsStroe.refsh = !useSettingsStroe.refsh
}

// 全屏按钮事件(注:当前全屏只适用于谷歌,适配其他浏览器可使用插件)
const fullScreen = () => {
  // DOM对象的一个属性:可以用来判断当前是不是全屏模式:[全屏true,否则false]
  let full = document.fullscreenElement
  // 切换为全屏模式
  if (!full) {
    // 文档根节点的方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏模式
    document.exitFullscreen()
  }
}

// 退出登陆事件
const logout = async () => {
  // 1.向服务器发起请求[退出登录接口]
  // 2.仓库中相关的数据全部清空[token|username|avatar]
  // 3.跳转到登录页面
  await usersStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

// 组件暗黑模式的切换
const changeDark = () => {
  // 获取根节点
  let html = document.documentElement
  // 判断HTML标签是否有类名Dark
  dark.value ? (html.className = 'dark') : (html.className = '')
}

// 主题颜色的设置
const setColor = () => {
  // 通过js修改根节点的样式对象的属性与属性值
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped lang="scss"></style>
