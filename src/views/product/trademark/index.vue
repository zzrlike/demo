<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加按钮 -->
      <el-button type="primary" size="default" icon="Plus" @click="addTrademark" v-has="`btn.Trademark.add`">添加品牌</el-button>
      <!-- 表格组件:展示平台已有数据 -->
      <el-table style="margin: 10px 0px" border :data="trademarkArr">
        <el-table-column label="序号" align="center" type="index" width="80"></el-table-column>
        <el-table-column label="品牌名称" width="180">
          <template #="{ row }">
            <pre>{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{ row }">
            <img :src="row.logoUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row }">
            <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>
            <el-popconfirm :title="`确定删除已有品牌${row.tmName}吗`" width="250px" icon="Delete" @confirm="removeTradeMark(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件 -->
      <el-pagination @size-change="sizeChange" @current-change="getTrademark" :pager-count="9" v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true" layout="prev, pager, next, jumper, ->,  total, sizes" :total="total" />
    </el-card>
    <!-- 对话框组件:添加品牌与修改已有品牌业务时候使用结构 -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width: 80%" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="80px" prop="tmName">
          <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="92px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽:footer -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-button type="primary" size="default" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { ElMessage, UploadProps } from 'element-plus'
import { reqTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark'
import type { Records, TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type'

// 当前页码
let pageNo = ref<number>(1)
// 每页展示数据个数
let limit = ref<number>(3)

// 存储已有品牌数据总数
let total = ref<number>(0)

// 存储已有品牌的数据
let trademarkArr = ref<Records>([])

// 控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)

// 定义收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})

// 获取el-form组件实例
let formRef = ref()

// 表单品牌自定义校验规则方法
const validatorTmName = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称大于等于两位'))
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validatorLogoUrl = (_rule: any, value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('上传图片为空'))
  }
}

// 表单校验规则对象
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}

// 获取已有品牌的接口封装为一个函数
// 当前每页数据量分生变化时,页码值为1
const getTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqTrademark(pageNo.value, limit.value)
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}

// 组件挂载完毕,发起请求获取品牌数据
onMounted(() => {
  getTrademark()
})

// 分页器当前页码发生变化时触发
// 对于当前页码发生变化自定义事件,组件pagination回传了数据(当前的页码值)
// 当前页码发生变化的时候再次发请求,获取对应的已有品牌的数据
// const changePageNo = () => {
//   getTrademark()
// }

// 当下拉菜单发生变化时发起请求方法
// 当前自定义事件,分页器会将下拉菜单选中的数据返回
const sizeChange = () => {
  getTrademark()
}

// 添加品牌按钮框的点击事件
const addTrademark = () => {
  dialogFormVisible.value = true
  // 收集数据清空
  trademarkParams.id = undefined
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''

  // 第一种写法Ts?号写法验证
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')

  nextTick(() => {
    formRef.value?.clearValidate('tmName')
    formRef.value?.clearValidate('logoUrl')
  })
}

// 修改品牌按钮框的点击事件
// 对话框显示
// 展示已有品牌的数据
// ES6语法合并对象
const updateTrademark = (row: TradeMark) => {
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
  dialogFormVisible.value = true
  Object.assign(trademarkParams, row)
}

// 对话框底部取消与确定按钮的点击事件
const cancel = () => {
  dialogFormVisible.value = false
}
const confirm = async () => {
  // 发起请求之前,对整个表单进行校验
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    // 再次发请求获取已有全部的品牌数据
    getTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
    dialogFormVisible.value = false
  }
}

// 上传图片组件 -> 上传图片之前触发的钩子函数
// 钩子是在图片上传成功之前触发,上传文件之前可以约束文件类型与大小
// 文件上传要求: png | jgp | gif 4M
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg') {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小应小于4M',
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必是png或者jpeg',
    })
    return false
  }
}

// 图片上传成功钩子
// response: 即为当前这次上传图片post请求服务器返回的数据
// 收集上传图片的地址,添加一个新的品牌的时候带给服务器
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  trademarkParams.logoUrl = response.data
  formRef.value.clearValidate('logoUrl')
}

// 气泡确认框回调函数
// 点击确认按钮删除已有品牌请求
// 删除成功失败提示信息
const removeTradeMark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    getTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
