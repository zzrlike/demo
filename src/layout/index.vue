<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo></Logo>
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu :collapse="layoutSettingStore.fold" :default-active="$route.path" background-color="#001529" text-color="white">
          <!-- 根据路由动态生成菜单 -->
          <Menus :menuList="usersStore.menuRoutes"></Menus>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: layoutSettingStore.fold ? true : false }">
      <!-- layout组件顶部的Tabbar组件 -->
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区域 -->
    <div class="layout_main" :class="{ fold: layoutSettingStore.fold ? true : false }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入路由对象
import { useRoute } from 'vue-router'
// 引入左侧菜单栏Logo组件
import Logo from './logo/index.vue'
// 引入菜单组件
import Menus from './menus/index.vue'
// 引入右侧内容展示区域
import Main from './main/index.vue'
// 引入顶部tabbar
import Tabbar from './tabbar/index.vue'
// 引入用户相关的小仓库
import userSotre from '@/store/modules/user'
import useLayoutSettings from '@/store/modules/setting'

// 获取layout配置仓库
let layoutSettingStore = useLayoutSettings()

// 获取路由对象
let $route = useRoute()

// 获取用户相关的小仓库
let usersStore = userSotre()
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  .layout_slider {
    color: white;
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.3s;

    .scrollbar {
      widows: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }
  }
  .layout_tabbar {
    position: fixed;
    top: 0px;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
