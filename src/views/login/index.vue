<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 登陆表单 -->
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到后台管理系统</h2>
          <el-form-item prop="username">
            <el-input type="username" :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="login_btn" type="primary" size="default" @click="Login">登陆</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import useStore from '@/store/modules/user'
import { getTime } from '@/utils/time'

let userStore = useStore()

// 获取路由器
let $router = useRouter()
let $route = useRoute()

// 获取el-form表单
let loginForms = ref()

// 定义变量控制按钮加载效果
let loading = ref(false)

let loginForm = reactive({
  username: 'admin',
  password: 'atguigu123',
})

/**
 * @author 按钮登陆操作
 */
const Login = async () => {
  // 保证全部表单校验通过再发请求
  await loginForms.value.validate()
  // 登陆成功加载效果
  loading.value = true
  try {
    await userStore.userLogin(loginForm)
    // 编程式导航跳转到路由首页
    // 判断登陆时,路由路径当中是否有query参数,如果有就往query参数跳转,否则就回到首页
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    // 登陆成功的提示信息
    ElNotification({
      type: 'success',
      message: '登陆成功',
      title: `Hi, ${getTime()}`,
    })
    // 登陆成功加载效果消失
    loading.value = false
  } catch (error) {
    // 登陆失败加载效果
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

// 自定义校验规则函数
const validatorUsername = (_rule: any, value: any, callback: any) => {
  // rule即为校验规则对象
  // value即为表单元素文本内容
  // callback函数:符合条件放行通过,不符合条件则注入错误提示信息
  if (value.length >= 5 && value.length <= 10) {
    callback()
  } else {
    callback(new Error('账号长度至少五位'))
  }
}
const validatorPassword = (_rule: any, value: any, callback: any) => {
  // rule即为校验规则对象
  // value即为表单元素文本内容
  // callback函数:符合条件放行通过,不符合条件则注入错误提示信息
  if (value.length >= 6 && value.length <= 10) {
    callback()
  } else {
    callback(new Error('密码长度至少六位'))
  }
}

// 表单校验需要配置的对象
const rules = {
  // required代表字段务必需要校验
  // message代表错误的提示信息
  // trigger代表校验表单触发的时机: chang->文本发生变化触发 / blur->失去焦点触发
  // username: [{ required: true, min: 5, max: 10, message: '账号长度至少五位', trigger: 'change' }],
  // password: [{ required: true, min: 6, max: 10, message: '密码长度至少六位', trigger: 'change' }],

  // 自定义校验规则
  username: [{ trigger: 'change', validator: validatorUsername }],
  password: [{ trigger: 'change', validator: validatorPassword }],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}

.login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url('@/assets/images/login_form.png');
  padding: 40px;

  h1 {
    color: white;
    font-size: 40px;
  }

  h2 {
    color: white;
    font-size: 20px;
    margin: 20px 0px;
  }

  .login_btn {
    width: 100%;
  }
}
</style>
