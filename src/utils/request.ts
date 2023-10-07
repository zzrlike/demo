// 进行axios二次封装:使用请求与响应拦截器
import axios from 'axios'

import { ElMessage } from 'element-plus'

// 引入用户相关的仓库
import userSotre from '@/store/modules/user'

// 利用axios对象的create方法,创建axios实例(在实例中可以配置各种选项)
const request = axios.create({
  // 基础路径
  baseURL: '/api', // 注意:视频P28有其它拓展
  // 请求时间设置为5秒
  timeout: 3000,
})

// 为axios实例添加设置请求拦截器
request.interceptors.request.use((config) => {
  // 获取用户相关的小仓库:获取仓库内部的token,登陆成功以后携带给服务器
  const usersStore = userSotre()
  if (usersStore.token) {
    config.headers.token = usersStore.token
  }
  // config配置对象,headers属性请求头,给服务器携带公共参数
  // config.headers.token = '123'
  // 一定要返回config配置对象
  return config
})

// 为axios实例添加设置响应拦截器
request.interceptors.response.use(
  // 成功回调:简化数据
  (response) => {
    return response.data
  },
  // 失败回调:处理http网络错误
  (error) => {
    let message = ''
    const status = error.response.status
    switch (status) {
      case 401:
        message = 'token过期'
        break
      case 404:
        message = '地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网络出现问题'
        break
    }
    ElMessage({
      type: 'error',
      message,
    })
    return Promise.reject(error)
  },
)

export default request
