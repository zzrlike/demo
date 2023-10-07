// 分类相关的ts数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 分类ts类型
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}
// 相应接口返回的数据类型
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

// 属性与属性值的ts类型
// 属性值对象的ts类型
export interface AttrValue {
  id?: string
  valueName: string
  attrId?: number | string
  flag?: boolean
}
// 存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]
// 属性对象
export interface Attr {
  id?: number
  attrName: string
  attrValueList: AttrValueList
  categoryId: number | string
  categoryLevel: number
}
// 存储每一个属性对象的数组ts类型
export type AttrList = Attr[]
// 属性接口返回的数据ts类型
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}
