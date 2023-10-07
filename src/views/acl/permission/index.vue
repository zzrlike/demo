<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <div>
    <el-table style="width: 100%; margin-bottom: 20px" :data="PermisstionArr" row-key="id" border>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="权限值" />
      <el-table-column prop="updateTime" label="修改时间" />
      <el-table-column prop="address" label="操作">
        <template #="{ row }">
          <el-button type="primary" size="small" :disabled="row.level == 4 ? true : false" @click="addPermisstion(row)">{{ row.level == 3 ? '添加功能' : '添加菜单' }}</el-button>
          <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false" @click="updatePermisstion(row)">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.name}吗`" width="200px" @confirm="deletePermisstion(row.id)">
            <template #reference>
              <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框组件(dialog)：添加或者更新已有菜单的数据结构 -->
    <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'">
      <!-- 表单组件：用于新增已有的菜单的数据 -->
      <el-form>
        <el-form-item label="名称">
          <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
        </el-form-item>
        <el-form-item label="权限值">
          <el-input placeholder="请你输入权限数值称" v-model="menuData.code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { reqAllPermisstion, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu'
import type { PermisstionResponseData, PermisstionList, Permisstion, MenuParams } from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

let PermisstionArr = ref<PermisstionList>([])

let dialogVisible = ref<boolean>(false)

let menuData = reactive<MenuParams>({
  id: 0,
  code: '',
  level: 0,
  name: '',
  pid: 0,
})

onMounted(() => {
  getHasPermisstion()
})
const getHasPermisstion = async () => {
  let result: PermisstionResponseData = await reqAllPermisstion()
  if (result.code == 200) {
    PermisstionArr.value = result.data
  }
}

// 添加菜单按钮的回调
const addPermisstion = (row: Permisstion) => {
  Object.assign(menuData, {
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  dialogVisible.value = true
  // 收集新增的菜单的level数值
  menuData.level = row.level + 1
  // 给谁新增子菜单
  menuData.pid = row.id
}

// 编辑已有菜单按钮的事件回调
const updatePermisstion = (row: Permisstion) => {
  dialogVisible.value = true
  // 点击编辑按钮:收集已有的菜单数据进行更新
  Object.assign(menuData, row)
}

// 确定按钮的事件回调
const save = async () => {
  let result = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新成功' : '添加成功',
    })
    getHasPermisstion()
  } else {
    dialogVisible.value = false
    ElMessage({
      type: 'error',
      message: menuData.id ? '更新失败' : '添加失败',
    })
  }
}

// 删除按钮事件的回调
const deletePermisstion = async (id: number) => {
  let result = await reqRemoveMenu(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasPermisstion()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
</script>

<style scoped lang="scss"></style>
