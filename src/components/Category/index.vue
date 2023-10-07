<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select :disabled="scene == 0 ? false : true" v-model="categoryStore.c1Id" @change="handler">
          <el-option v-for="c1 in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="scene == 0 ? false : true" v-model="categoryStore.c2Id" @change="handler1">
          <el-option v-for="c2 in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="scene == 0 ? false : true" v-model="categoryStore.c3Id">
          <el-option v-for="c3 in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()

// 接收父组件传递过来的scene值
defineProps(['scene'])

onMounted(() => {
  getC1()
})

// 通知仓库获取一级分类的方法
const getC1 = () => {
  categoryStore.getC1()
}

// 一级分类下拉菜单的change事件(选中值触发,保证一级分类ID值)
// 通知仓库获取二级分类的数据
// 一级分类数据发生变化,需将二三级分类数据框中的文本置空
const handler = () => {
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  categoryStore.getC2()
}

// 二级分类下拉菜单的change事件(选中值触发,保证一级分类ID值)
// 通知仓库获取三级分类的数据
// 同理:将三级分类数据置空
const handler1 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}
</script>

<style scoped lang="scss"></style>
