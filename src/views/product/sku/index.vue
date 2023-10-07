<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <el-card>
    <el-table border style="margin: 10px 0px" :data="skuArr">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="200px" prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="200px" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="200px">
        <template #="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="重量(G)" width="200px" prop="weight"></el-table-column>
      <el-table-column label="价格(元)" width="200px" prop="price"></el-table-column>
      <el-table-column label="操作" width="278px" fixed="right">
        <template #="{ row }">
          <el-button type="primary" size="small" :icon="row.isSale == 1 ? 'Bottom' : 'Top'" @click="updateSale(row)"></el-button>
          <el-button type="primary" size="small" icon="Edit" @click="EditSku"></el-button>
          <el-button type="primary" size="small" icon="InfoFilled" @click="findSku(row)"></el-button>
          <el-popconfirm :title="`你确定要删除${row.skuName}吗?`" width="200px" @confirm="deleteSku(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]" :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getHasSku" @size-change="SizeChange" />
    <!-- 抽屉组件:展示商品详情 -->
    <el-drawer v-model="drawer">
      <!-- 标题 -->
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <!-- 主体 -->
      <template #default>
        <!-- 通过span属性设置占用大小:共24 -->
        <el-row style="margin: 10px 0px">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 2px" v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{ item.valueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 2px" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{ item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" style="width: 100%; height: 100%" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqSkuList, reqSaleSku, reqCancelSaleSku, reqSkuInfo, reqDeleteSku } from '@/api/product/sku'

import type { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'

// 分页器当前页码
let pageNo = ref<number>(1)
// 每页展示多少条数据
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])

// 控制抽屉组件显示隐藏
let drawer = ref<boolean>(false)

let skuInfo = ref<any>({})

// 组件挂载完毕
onMounted(() => {
  getHasSku()
})

const getHasSku = async (pager = 1) => {
  // 当前分页器的页码
  pageNo.value = pager
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}

// 分页器下拉菜单发生变化事件方法
const SizeChange = () => {
  getHasSku()
}

// 商品上架与下架按钮事件方法
const updateSale = async (row: SkuData) => {
  // 如果当前商品isSale值为1,状态为上架 -> 更新为下架,否则为上架
  if (row.isSale == 1) {
    await reqCancelSaleSku(row.id as number)
    ElMessage({
      type: 'success',
      message: '下架成功',
    })
    getHasSku(pageNo.value)
  } else {
    await reqSaleSku(row.id as number)
    ElMessage({
      type: 'success',
      message: '上架成功',
    })
    getHasSku(pageNo.value)
  }
}

// 更新已有的SKU
const EditSku = () => {
  ElMessage({
    type: 'success',
    message: '程序员在努力更新',
  })
}

// 查看商品详情按钮的事件方法
const findSku = async (row: SkuData) => {
  drawer.value = true
  // 获取已有商品的详情数据
  let result: SkuInfoData = await reqSkuInfo(row.id as number)
  skuInfo.value = result.data
}

// 删除对应商品按钮的事件方法
const deleteSku = async (id: number) => {
  let result = await reqDeleteSku(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '系统数据,删除失败',
    })
  }
}
</script>

<style scoped lang="scss">
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
