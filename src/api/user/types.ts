// 登录接口携带参数的ts类型
export interface loginForm {
  username: string
  password: string
}

// 注:登录接口data对应的数据类型
interface dataType {
  token?: string
  message?: string
}
// 登录接口返回的数据类型
export interface loginResponseData {
  code: number
  data: dataType
}

interface userInfo {
  userId: number
  avatar: string
  username: string
  password: string
  desc: string
  roles: string[]
  buttons: string[]
  routes: string[]
  token: string
}
interface user {
  checkUser: userInfo
}
// 定义服务器返回用户信息相关的数据类型
export interface userResponseData {
  code: number
  data: user
}
