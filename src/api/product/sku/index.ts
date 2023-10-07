// SKU管理模块接口
import request from '@/utils/request'
import type { SkuResponseData, SkuInfoData } from './type'

enum API {
  // 获取已有SKU的数据接口地址
  SKU_URL = '/admin/product/list/',
  // 上架SKU商品的接口地址
  SALE_URL = '/admin/product/onSale/',
  // 下架SKU商品的接口地址
  CANCElSAlE_URL = '/admin/product/cancelSale/',
  // 获取商品详情的接口地址
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  // 删除对应SKU商品的接口地址
  DELETESKU_URL = '/admin/product/deleteSku/',
}

// 获取SKU的接口
export const reqSkuList = (page: number, limit: number) => request<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
// 上架SKU商品的接口
export const reqSaleSku = (skuId: number) => request.get<any, any>(API.SALE_URL + skuId)
// 下架SKU商品的接口
export const reqCancelSaleSku = (skuId: number) => request.get<any, any>(API.CANCElSAlE_URL + skuId)
// 获取商品详情的接口
export const reqSkuInfo = (skuId: number) => request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)
// 删除对应SKU商品的接口
export const reqDeleteSku = (skuId: number) => request.delete<any, any>(API.DELETESKU_URL + skuId)
