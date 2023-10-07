<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" />
    <h1>{{ setting.title }}</h1>
  </div>
</template>

<script setup lang="ts">
// 引入设置logo的标题和图片设置文件
import setting from '@/setting'
</script>

<script lang="ts">
export default {
  name: 'Logo',
}
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;

  img {
    width: 40px;
    height: 40px;
  }

  h1 {
    font-size: $base-logo-title-fontSize;
    margin-left: 5px;
  }
}
</style>
