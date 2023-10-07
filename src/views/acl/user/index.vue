<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <div>
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名：">
          <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="searchUser">搜索</el-button>
          <el-button type="primary" size="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0px">
      <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
      <el-button type="primary" size="default" :disabled="selectIdArr.length >= 2 ? false : true" @click="DeleteUserList">批量删除</el-button>
      <!-- 展示用户信息 -->
      <el-table @selection-change="selectChange" border style="margin: 10px 0px" :data="userArr">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="#" align="center" width="50px" type="index"></el-table-column>
        <el-table-column label="ID" align="center" width="80px" prop="id"></el-table-column>
        <el-table-column label="用户名字" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户角色" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="300px" show-overflow-tooltip>
          <template #="{ row }">
            <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.username}吗`" width="200px" @confirm="DeleteUser(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]" :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getHasUser" @size-change="SizeChange" />
    </el-card>
    <!-- 抽屉组件: 完成添加用户账号 | 更新已有的账号 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉组件: 用于某个角色职位分配 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名" prop="username">
            <el-input v-model="userParams.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
            <!-- 显示职位的复选框 -->
            <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="(item, index) in allRole" :key="index" :label="item">{{ item.roleName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import useLayoutSettings from '@/store/modules/setting'
import { reqUserInfo, reqAddOrUpdateUser, reqRole, reqSetRole, reqDeleteUser, reqDeleteUserList } from '@/api/acl/user'
import type { UserResponseData, Records, User, AllRoleResponseData, AllRole, SetRoleData } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)

let userArr = ref<Records>([])

let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)

let formRef = ref<any>()

// 收集用户搜索关键字
let keyword = ref<string>('')

// 收集用户信息数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})

// 存储全部职位的数据
let allRole = ref<AllRole>([])
// 当前用户已有的职位
let userRole = ref<AllRole>([])

// 批量删除用户的ID
let selectIdArr = ref<User[]>([])

// 获取模板setting仓库
let settingStore = useLayoutSettings()

onMounted(() => {
  getHasUser()
})

// 全选矿复选框数据
const checkAll = ref<boolean>(false)
const isIndeterminate = ref<boolean>(true)
// 顶部全选复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
// 多选复选框的change事件
const handleCheckedCitiesChange = (value: string[]) => {
  checkAll.value = value.length === allRole.value.length
  isIndeterminate.value = value.length > 0 && value.length < allRole.value.length
}

// 校验用户名字方法
const validatorUsername = (_rule: any, value: any, callBack: any) => {
  // 用户名称长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名至少五位'))
  }
}
const validatorName = (_rule: any, value: any, callBack: any) => {
  // 用户昵称长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
const validatorPassword = (_rule: any, value: any, callBack: any) => {
  // 用户密码长度至少六位
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
// 表单自定义检验规则对象
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  // 收集当前页码
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

// 搜索按钮事件方法
const searchUser = () => {
  getHasUser()
  keyword.value = ''
}

// 重置按钮事件方法
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}

// 分页器下拉菜单方法
const SizeChange = () => {
  getHasUser()
}

// 添加用户按钮方法
const addUser = () => {
  drawer.value = true
  // 清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  // 清除上一次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

// 分配角色按钮方法
const setRole = async (row: User) => {
  drawer1.value = true
  Object.assign(userParams, row)
  let result: AllRoleResponseData = await reqRole(userParams.id as number)
  if (result.code == 200) {
    allRole.value = result.data.allRolesList
    userRole.value = result.data.assignRoles
  }
}

// 编辑用户按钮方法
// row:即为已有用户账号信息
const updateUser = (row: User) => {
  drawer.value = true
  // 存储收集已有的账号信息
  Object.assign(userParams, row)
  // 清除上一次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

// 添加用户或者修改用户确定按钮方法
const save = async () => {
  // 点击确定按钮,首先保证表单校验规则全部通过
  formRef.value.validate()
  let result: any = await reqAddOrUpdateUser(userParams)
  if (result.code == 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    // getHasUser(userParams.id ? pageNo.value : 1)
    // 浏览器自动刷新一次
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}

// 取消按钮方法
const cancel = () => {
  drawer.value = false
}

// 删除某一个用户按钮方法
const DeleteUser = async (userId: number) => {
  let result: any = await reqDeleteUser(userId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
// 批量删除用户按钮方法
const DeleteUserList = async () => {
  // 整理批量删除的参数
  let idList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  let result: any = await reqDeleteUserList(idList)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
// table复选框勾选触发事件方法
const selectChange = (value: any) => {
  selectIdArr.value = value
}

// 确定按钮方法(分配职位)
const confirmClick = async () => {
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  let result: any = await reqSetRole(data)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配职务成功',
    })
    drawer1.value = false
    getHasUser(pageNo.value)
  } else {
    ElMessage({
      type: 'error',
      message: '分配职务失败',
    })
  }
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
