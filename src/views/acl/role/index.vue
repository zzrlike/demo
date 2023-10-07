<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <div>
    <!-- 表单框区域 -->
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="职位搜索">
          <el-input placeholder="请输入职位名称" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="searchRole">搜索</el-button>
          <el-button type="primary" size="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 主要内容区域 -->
    <el-card style="margin: 10px 0px">
      <el-button type="primary" size="default" icon="Plus" @click="addRole">添加职位</el-button>
      <!-- 展示角色信息 -->
      <el-table border style="margin: 10px 0px" :data="allRole">
        <el-table-column label="#" align="center" width="50px" type="index"></el-table-column>
        <el-table-column label="ID" align="center" width="80px" prop="id"></el-table-column>
        <el-table-column label="职位名称" prop="roleName"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="300px" show-overflow-tooltip>
          <template #="{ row }">
            <el-button type="primary" size="small" icon="User" @click="setPermisstion(row)">分配权限</el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.roleName}吗`" width="260px" @confirm="removeRole(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]" :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @size-change="getHasRole" @current-change="getHasRole" />
    </el-card>
    <!-- 添加职位与更新已有职位的账号结构 -->
    <el-dialog v-model="dialogVisite" :title="RoleParams.id ? '编辑职位' : '添加职位'">
      <el-form :model="RoleParams" :rules="rules" ref="form">
        <el-form-item label="职位名称" prop="roleName">
          <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="default" @click="dialogVisite = false">取消</el-button>
        <el-button type="primary" size="default" @click="save">确定</el-button>
      </template>
    </el-dialog>
    <!-- 抽屉组件:分配职位的菜单权限与按钮权限 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配菜单与按钮权限</h4>
      </template>
      <template #default>
        <!-- 树形组件(Tree) -->
        <el-tree ref="treeRef" :data="menuArr" show-checkbox default-expand-all node-key="id" highlight-current :default-checked-keys="selectArr" :props="defaultProps" />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import useLayoutSettings from '@/store/modules/setting'
import { reqAllRoleList, reqAddOrUpdateRole, reqAllrermisstion, reqSetPermisston, reqDeleteRole } from '@/api/acl/role'
import type { RoleResponseData, Records, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let keyword = ref<string>('')
let allRole = ref<Records>([])

let drawer = ref<boolean>(false)

let dialogVisite = ref<boolean>(false)

let treeRef = ref<any>()

// 树形控件数据
const defaultProps = {
  children: 'children',
  label: 'name',
}

// 存储用于勾选的节点的ID(四级)
let selectArr = ref<number[]>([])

// 收集新增岗位的数据
let RoleParams = reactive({
  id: 0,
  roleName: '',
})

// 定义数组存储用户权限的数据
let menuArr = ref<MenuList>([])

let form = ref<any>()

const settingStore = useLayoutSettings()

onMounted(() => {
  getHasRole()
})

const getHasRole = async (pager = 1) => {
  pageNo.value = pager
  let result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}
const searchRole = () => {
  getHasRole()
  keyword.value = ''
}
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}

// 添加职位按钮回调
const addRole = () => {
  dialogVisite.value = true
  Object.assign(RoleParams, {
    id: 0,
    roleName: '',
  })
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

// 编辑职位按钮回调
const updateRole = (row: RoleData) => {
  dialogVisite.value = true
  Object.assign(RoleParams, row)
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

// 自定义校验规则方法
const validatorRoleName = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称至少两位'))
  }
}
// 职位相关的校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}

// 确定按钮的回调
const save = async () => {
  // 表单校验通过,允许发起请求,则不允许发起请求
  await form.value.validate()
  // 添加职位 | 更新职位的请求
  let result = await reqAddOrUpdateRole(RoleParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功',
    })
    dialogVisite.value = false
    getHasRole(RoleParams.id ? pageNo.value : 1)
  }
}

// 分配权限按钮事件方法
const setPermisstion = async (row: RoleData) => {
  drawer.value = true
  // 收集当前分类权限的职位的数据
  Object.assign(RoleParams, row)
  let result: MenuResponseData = await reqAllrermisstion(RoleParams.id)
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}

// 确定按钮事件方法
const confirmClick = async () => {
  // 职位Id
  const roleId = RoleParams.id
  // 选中节点Id
  const arr = treeRef.value.getCheckedKeys()
  // 半选的节点Id
  let arrs = treeRef.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arrs)
  // 下发权限
  let result = await reqSetPermisston(roleId, permissionId)
  if (result.code == 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: '权限分配成功',
    })
    window.location.reload()
  }
}

// 删除角色事件方法
const removeRole = async (id: number) => {
  let result: any = await reqDeleteRole(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
  }
  getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
