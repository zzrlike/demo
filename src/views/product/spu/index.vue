<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <div>
    <!-- 三级分类模块 -->
    <Category :scene="scene"></Category>
    <!-- 数据展示模块 -->
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="Plus" :disabled="!categoryStore.c3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="SPU操作">
            <template #="{ row }">
              <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
              <el-button type="primary" size="small" icon="Edit" title="修改SPU" @click="updateSpu(row)"></el-button>
              <el-button type="primary" size="small" icon="View" title="查看SPU" @click="findSku(row)"></el-button>
              <el-popconfirm :title="`你确定删除已有的${row.spuName}吗？`" width="250px" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete" title="删除SPU"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器模块 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]" :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getHasSpu" @size-change="changeSize" />
      </div>
      <!-- 添加SPU子组件 | 修改SPU子组件 -->
      <SpuForm ref="spu" v-show="scene == 1" @changScene="changScene"></SpuForm>
      <!-- 添加SKU子组件 -->
      <SkuForm ref="sku" v-show="scene == 2" @changScene="changScene"></SkuForm>
      <!-- dialog对话框:展示已有的SKU数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row }">
              <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 引入相应的子组件
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'
// 引入Vue下的组合式API
import { ref, watch, onBeforeUnmount } from 'vue'
// 引入类型
import { type HasSpuResponseData, type Records, type SpuData, type SkuInfoData, SkuData } from '@/api/product/spu/type'
// 引入接口
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
// 引入分类的仓库
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()

// 场景切换控制值: /0显示已有SPU/ /1添加或者修改已有SPU/ /2添加SKU的结构/
let scene = ref<number>(0)

// 分页器默认页码
let pageNo = ref<number>(1)
// 分页器每页展示多少条数据
let pageSize = ref<number>(3)

// 存储已有SPU的数据
let records = ref<Records>([])
// 存储已有SPU总个数
let total = ref<number>(0)

// 获取子组件SpuForm的响应式实例对象
let spu = ref<any>()
// 获取子组件SkuForm的响应式实例对象
let sku = ref<any>()

// 存储全部的SKU数据
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)

// 监听三级分类Id的变化
// 务必保证已有三级分类Id
watch(
  () => categoryStore.c3Id,
  () => {
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)

// 获取三级分类Id下的全部的已有的SPU数据方法
// 修改当前页码,默认为1
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

// 分页器下拉菜单发生变化重新获取数据方法
const changeSize = () => {
  getHasSpu()
}

// 添加SPU场景切换方法
const addSpu = () => {
  scene.value = 1
  // 点击添加SPU按钮,调用子组件方法初始化数据
  spu.value.initAddSpu(categoryStore.c3Id)
}

// 子组件spuForm绑定自定义事件:子组件传递父组件
// 子组件spuForm点击取消变为场景0:展示已有的spu
const changScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params == 'update') {
    // 更新,留在当前页
    getHasSpu(pageNo.value)
  } else {
    // 添加,回到第一页
    getHasSpu()
  }
}

// 添加sku方法
// 切换场景值为2
const addSku = (row: SpuData) => {
  scene.value = 2
  // 调用子组件方法初始化添加sku的数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 修改已有spu方法
const updateSpu = (row: SpuData) => {
  scene.value = 1
  spu.value.initHasSpuData(row)
}

// 查看已有spu方法
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code == 200) {
    skuArr.value = result.data
    // 对话框显示
    show.value = true
  }
}

// 删除已有spu方法
const deleteSpu = async (row: SpuData) => {
  let result: any = await reqRemoveSpu(row.id as number)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 重新获取剩余的已有spu数据
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 路由组件销毁前,清空仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped lang="scss"></style>
