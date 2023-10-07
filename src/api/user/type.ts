// 定义用户相关数据的ts类型

// 用户登陆接口携带参数的ts类型
export interface loginFormdata {
  username: string
  password: string
}

// 定义全部接口返回数据都有ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 定义登陆接口返回的数据类型
export interface loginResponseData extends ResponseData {
  data: string
}

// 定义获取用户信息返回数据类型
export interface userInfoReponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}