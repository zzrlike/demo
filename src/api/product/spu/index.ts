// SPU模块接口
import request from '@/utils/request'
import type { HasSpuResponseData, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData, SpuData, SkuData, SkuInfoData } from './type'

enum API {
  // 获取已有SPU的数据接口地址
  HASSPU_URL = '/admin/product/',
  // 获取全部品牌的数据接口地址
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某个SPU下的全部的售卖商品图片的数据接口地址
  IMAGE_URL = '/admin/product/spuImageList/',
  // 获取某个SPU下的已有的销售属性的数据接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性[颜色/版本/尺码]接口地址
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 追加一个新的SPU数据的接口地址
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 修改一个SPU数据的接口地址
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 追加一个新的SKU的接口地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 查看某个已有SPU下全部信息的接口地址
  SKUINFO_URL = '/admin/product/findBySpuId/',
  // 删除已有的SPU的接口地址
  DELETE_URL = '/admin/product/deleteSpu/',
}

// 获取某个三级分类下已有的SPU数据的接口方法
export const reqHasSpu = (page: number, limit: number, category3Id: string | number) => request.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)
// 获取全部的SPU数据的接口方法
export const reqAllTradeMark = () => request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)
// 获取某个已有SPU下全部商品的图片的接口方法
export const reqAllImage = (spuId: number) => request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)
// 获取某个SPU下的已有的销售属性的数据接口方法
export const reqSpuHasSaleAttr = (spuId: number) => request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)
// 获取整个项目全部的销售属性[颜色/版本/尺码]接口方法
export const reqSpuAllSalerAttr = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
// 添加一个新SPU数据的接口方法
// 修改一个SPU数据的接口方法
// 如果SPU对象拥有id,更新已有的SPU,否则添加新的SPU
export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}
// 追加一个新的SKU地址的接口方法
export const reqAddSku = (data: SkuData) => request.post<any, any>(API.ADDSKU_URL, data)
// 查看某个已有SPU下全部信息的接口方法
export const reqSkuList = (spuId: number | string) => request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)
// 删除已有的SPU的接口方法
export const reqRemoveSpu = (spuId: number | string) => request.delete<any, any>(API.DELETE_URL + spuId)
