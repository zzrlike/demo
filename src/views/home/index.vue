<template>
  <div>
    <el-card>
      <div class="home-box">
        <img class="home-avatar" :src="userStoreData.avatar" />
        <div class="home-bottom">
          <h3 class="home-title">{{ getTime() }} {{ userStoreData.username }}</h3>
          <p class="home-subtitle">Vite后台管理系统</p>
        </div>
      </div>
    </el-card>
    <div class="svg-bottom">
      <Svgicon name="welcome" width="500px" height="500px"></Svgicon>
    </div>
  </div>
</template>

<script setup lang="ts">
import Svgicon from '@/components/Svgicon/index.vue'
// 引入用户相关的仓库,获取当前用户的头像.昵称数据
import userSotre from '@/store/modules/user'
import { getTime } from '@/utils/time'
// 获取存储用户信息的仓库对象
let userStoreData = userSotre()
</script>

<style scoped lang="scss">
.home-box {
  display: flex;

  .home-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .home-bottom {
    margin-left: 10px;

    .home-title {
      font-size: 25px;
      font-weight: 900;
      margin-bottom: 15px;
    }

    .home-subtitle {
      font-size: initial;
    }
  }
}

.svg-bottom {
  display: flex;
  justify-content: center;
}
</style>
