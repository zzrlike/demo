<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请你输入SPU名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option v-for="item in AllSpuData" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请你输入SPU名称" v-model="SpuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <el-upload v-model:file-list="ImgList" action="/api/admin/product/fileUpload" list-type="picture-card" :on-preview="yulan" :on-remove="onRemove">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单模块 -->
      <el-select v-model="saleAttrIdAndValueName" :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'">
        <el-option :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name"></el-option>
      </el-select>
      <el-button @click="addSaleAttr" :disabled="saleAttrIdAndValueName ? false : true" style="margin-left: 10px" type="primary" size="default" icon="Plus">添加属性值</el-button>
      <!-- 展示销售属性与属性值模块 -->
      <el-table border style="margin: 10px 0px" :data="AttrList">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="属性名" width="100px" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值">
          <!-- row即为当前SPU已有的销售属性对象 -->
          <template #="{ row }">
            <el-tag style="margin: 0px 5px" @close="row.spuSaleAttrValueList.splice(index, 1)" closable v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id">
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag == true" placeholder="请你输入属性值" size="small" style="width: 100px" ref="InputRef"></el-input>
            <el-button @click="toEdit(row)" v-else type="primary" size="small" icon="Plus"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template #="{ $index }">
            <el-button type="primary" size="small" icon="Delete" @click="AttrList.splice($index, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save" :disabled="AttrList.length > 0 ? false : true">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { reqAllTradeMark, reqAllImage, reqSpuHasSaleAttr, reqSpuAllSalerAttr, reqAddOrUpdateSpu } from '@/api/product/spu'
import type { TradeMark, SpuData, AllTradeMark, SpuHasImg, SaleAttrResponseData, SpuImg, SaleAttr, HasSaleAttr, SaleAttrValue, HasSaleAttrResponseData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

// 子组件接收父组件传递的数据
let $emit = defineEmits(['changScene'])

// 存储对应SPU接口返回的数据
let AllSpuData = ref<TradeMark[]>([])
let ImgList = ref<SpuImg[]>([])
let AttrList = ref<SaleAttr[]>([])
let AllAttrList = ref<HasSaleAttr[]>([])

// 存储已有SPU的数据
let SpuParams = ref<SpuData>({
  //收集三级分类的ID
  category3Id: '',
  //SPU的名字
  spuName: '',
  //SPU的描述
  description: '',
  //品牌的ID
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
})

// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 存储预览图片的地址
let dialogImageUrl = ref<string>('')

// 收集将来还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>('')

// 点击取消按钮,通知父组件切换场景为1的方法
const cancel = () => {
  $emit('changScene', { flag: 0, params: 'update' })
}

// 文本框
let InputRef = ref()

// 子组件书写一个方法并对外暴露,接收父组件传递过来的SPU对象[不完整]
const initHasSpuData = async (spu: SpuData) => {
  // 存储已有SPU的数据
  SpuParams.value = spu
  // 调用对应接口获取对应接口的数据
  let markdata: AllTradeMark = await reqAllTradeMark()
  let imgdata: SpuHasImg = await reqAllImage(spu.id as number)
  let attrdata: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  let allattrdata: HasSaleAttrResponseData = await reqSpuAllSalerAttr()
  // 存储对应接口的对应数据
  AllSpuData.value = markdata.data
  ImgList.value = imgdata.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  AttrList.value = attrdata.data
  AllAttrList.value = allattrdata.data
}

// 照片墙点击预览按钮的时候触发的钩子
const yulan = (file: any) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
// 照片墙删除文件触发的钩子
const onRemove = () => {
  alert('删除成功')
}

// 计算属性:计算当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  let unSelectArr = AllAttrList.value.filter((item) => {
    return AttrList.value.every((itema) => {
      return item.name != itema.saleAttrName
    })
  })
  return unSelectArr
})

// 添加销售属性的方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  // 准备一个新的销售属性对象:将来带给服务器
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  // 追加到数组当中
  AttrList.value.push(newSaleAttr)
  // 清空收集的数据
  saleAttrIdAndValueName.value = ''
}

// 属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
  // 点击按钮后,通过flag值的设置,转换编辑模式
  row.flag = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
  row.saleAttrValue = ''
}

// 表单元素失去焦点的事件回调
const toLook = (row: SaleAttr) => {
  // 整理收集到的属性ID和属性值名字
  const { baseSaleAttrId, saleAttrValue } = row
  // 整理成服务器需要的格式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue,
  }
  // 非法情况判断: 不能为空
  if (saleAttrValue?.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  // 确定是否有重复值
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  // 判断是否有重复值
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复！',
    })
    return
  }
  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 切换为查看模式
  row.flag = false
}

// 保存按钮的点击事件
const save = async () => {
  // 整理参数
  // 1.照片墙的数据
  SpuParams.value.spuImageList = ImgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  // 2.整理销售属性的数据
  SpuParams.value.spuSaleAttrList = AttrList.value
  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    })
    // 通知父组件切换场景
    $emit('changScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' })
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新失败' : '添加失败',
    })
  }
}

// 添加一个新SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  Object.assign(SpuParams.value, {
    id: '',
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: [],
  })
  ImgList.value = []
  AttrList.value = []
  saleAttrIdAndValueName.value = ''
  SpuParams.value.category3Id = c3Id
  let markdata: AllTradeMark = await reqAllTradeMark()
  let allattrdata: HasSaleAttrResponseData = await reqSpuAllSalerAttr()
  AllSpuData.value = markdata.data
  AllAttrList.value = allattrdata.data
}

// 对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped lang="scss"></style>
