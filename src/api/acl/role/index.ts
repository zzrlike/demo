// 角色管理模块接口
import request from '@/utils/request'
import type { RoleData, RoleResponseData, MenuResponseData } from './type'

enum API {
  // 获取全部已有职位角色信息的接口地址
  ALLROLE_URL = '/admin/acl/role/',
  // 添加新职位角色信息的接口地址
  ADDROLE_URL = '/admin/acl/role/save',
  // 更新已有职位角色信息的接口地址
  UPDATEROLE_URL = '/admin/acl/role/update',
  // 获取全部菜单与按钮的接口地址
  ALLRERMISSTION_URL = '/admin/acl/permission/toAssign/',
  // 相应职位分配权限的接口地址
  SETPERMISTION_URL = '/admin/acl/permission/doAssign/?',
  // 删除角色职位的接口地址
  DELETEROLE_URL = '/admin/acl/role/remove/',
}

// 获取全部已有角色信息接口地址方法
export const reqAllRoleList = (page: number, limit: number, roleName: string) => request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`)
// 添加新角色职位与更新已有角色职位信息接口地址方法
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}
// 获取全部菜单与按钮的数据接口方法
export const reqAllrermisstion = (roleId: number) => request.get<any, MenuResponseData>(API.ALLRERMISSTION_URL + roleId)
// 相应职位分配权限的接口方法
export const reqSetPermisston = (roleId: number, permissionId: number[]) => request.post<any, any>(API.SETPERMISTION_URL + `roleId=${roleId}&permissionId=${permissionId}`)
// 删除角色职位的接口方法
export const reqDeleteRole = (roleId: number) => request.delete<any, any>(API.DELETEROLE_URL + roleId)
