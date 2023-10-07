<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <el-form label-width="70px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input type="number" placeholder="价格(元)" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input type="number" placeholder="重量(克)" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input type="textarea" placeholder="SKU描述" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="item in attrArr" :key="item.id" :label="item.attrName">
          <el-select v-model="item.attrIdAndValueId">
            <el-option :value="`${item.id}:${attrValue.id}`" v-for="attrValue in item.attrValueList" :key="attrValue.id" :label="attrValue.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="item in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select v-model="item.saleIdAndValueId">
            <el-option :value="`${item.id}:${saleAttrValue.id}`" v-for="saleAttrValue in item.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="80ox" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #="{ row }">
            <img :src="row.imgUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button type="primary" size="default" @click="itemClick(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
// 引入请求API
import { reqAttr } from '@/api/product/attr'
import { reqAllImage, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu'

import type { SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

// 平台属性
let attrArr = ref<any>([])
// 销售属性
let saleArr = ref<any>([])
// 照片墙
let imgArr = ref<any>([])

// 获取table组件实例
let table = ref<any>()

// 收集Sku的参数
// 父组件传递过来的数据
let skuParams = reactive<SkuData>({
  // 三级分类的ID
  category3Id: '',
  // 已有的SPU的ID
  spuId: '',
  // SPU品牌的ID
  tmId: '',
  // v-model收集
  // sku名字
  skuName: '',
  // sku价格
  price: '',
  // sku重量
  weight: '',
  // sku的描述
  skuDesc: '',
  // 平台属性的收集
  skuAttrValueList: [],
  // 销售属性
  skuSaleAttrValueList: [],
  // sku图片地址
  skuDefaultImg: '',
})

// 自定义事件方法
let $emit = defineEmits(['changScene'])

// 保存按钮方法
const save = async () => {
  // 整理参数:平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })
      return prev
    }
  }, [])
  // 整理属性:销售属性
  skuParams.skuAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleAttrId,
        saleAttrValueId,
      })
      return prev
    }
  }, [])
  // 添加SKU的请求
  let result: any = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加sku成功',
    })
    // 通知父组件切换场景值为0
    $emit('changScene', {
      flag: 0,
      parmas: '',
    })
  } else {
    ElMessage({
      type: 'error',
      message: '添加sku失败',
    })
  }
}

// 取消按钮方法
const cancel = () => {
  $emit('changScene', { flag: 0, params: '' })
}

// 设置默认按钮事件方法
const itemClick = (row: any) => {
  // 点击时,所有复选框不勾选
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })
  // 复选框选中
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}

// 当前子组件方法对外暴露
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  // 获取平台属性
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)
  // 获取对应的销售属性
  let result1: any = await reqSpuHasSaleAttr(spu.id)
  // 获取照片墙的数据
  let result2: any = await reqAllImage(spu.id)
  // 数据保存
  attrArr.value = result.data
  saleArr.value = result1.data
  imgArr.value = result2.data
}
defineExpose({
  initSkuData,
})
</script>

<style scoped lang="scss"></style>
