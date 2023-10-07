// 用户管理模块接口
import request from '@/utils/request'
import type { UserResponseData, User, AllRoleResponseData, SetRoleData } from './type'

enum API {
  // 获取全部已有用户账号信息接口地址
  ALLUSER_URL = '/admin/acl/user/',
  // 新增一个用户账号接口地址
  ADDUSER_URL = '/admin/acl/user/save',
  // 修改当前用户账号接口地址
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 获取全部职位,及当前帐号职位的接口地址
  ALLROLE_URL = '/admin/acl/user/toAssign/',
  // 给已有用户分配角色接口地址
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除某一个账号接口地址
  DELETEUSER_URL = '/admin/acl/user/remove/',
  // 删除批量账号接口方法
  DELETEUSERLIST_URL = '/admin/acl/user/batchRemove',
}

//获取全部已有用户账号信息接口方法
export const reqUserInfo = (page: number, limit: number, username: string) => request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}/?username=${username}`)
// 添加用户与更新用户接口方法
export const reqAddOrUpdateUser = (data: User) => {
  // 无id添加,则更新
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}
// 获取全部职位,及当前帐号职位的接口方法
export const reqRole = (userId: number) => request.get<any, AllRoleResponseData>(API.ALLROLE_URL + userId)
// 给已有用户分配角色接口方法
export const reqSetRole = (data: SetRoleData) => request.post<any, any>(API.SETROLE_URL, data)
// 删除某一个账号接口方法
export const reqDeleteUser = (userId: number) => request.delete<any, any>(API.DELETEUSER_URL + userId)
// 删除批量账号接口方法
export const reqDeleteUserList = (idList: number[]) => request.delete<any, any>(API.DELETEUSERLIST_URL, { data: idList })
