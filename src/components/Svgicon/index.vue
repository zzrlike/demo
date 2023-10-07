<template>
  <!-- svg标签:图标外层容器节点,内部需要与use标签配合使用 -->
  <!-- 
    use标签:
    xlink:href属性作用用哪个图标,属性值名为#icon-图标名字
    fill属性设置图标的颜色,会和svg本身的属性冲突,记得删除svg本身对应的属性
    -->
  <svg :style="{ width, height }">
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
// 接收父组件传递来的参数
defineProps({
  // 设置xlink:href属性前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  // 接收父组件传递的对应svg的名字
  name: String,
  // 接收父组件传递的对应svg的颜色
  color: {
    type: String,
    default: '',
  },
  // 接收父组件传递的对应svg的宽度和高度
  width: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: '',
  },
})
</script>

<style scoped lang="scss"></style>
