// 服务器全部接口返回的数据的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU数据的ts类型
export interface SpuData {
  category3Id: string | number
  id?: number | string
  spuName: string
  tmId?: number | string
  description: string
  spuImageList: null | SpuImg[]
  spuSaleAttrList: null | SaleAttr[]
}
// 数组:元素都是已有SPU数据类型
export type Records = SpuData[]
// 定义获取已有的SPU接口返回的数据的ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 所有品牌数据的ts类型
export interface TradeMark {
  id: number
  tmName: string
  logoUrl: string
}
// 品牌接口返回的数据的ts类型
export interface AllTradeMark extends ResponseData {
  data: TradeMark[]
}
// 商品图片的ts类型
export interface SpuImg {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  imgName?: string
  imgUrl?: string
  name?: string
  url?: string
}
// 已有的SPU的照片墙数据的ts类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

// 已有的销售属性值对象的ts类型
export interface SaleAttrValue {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  baseSaleAttrId?: number | string
  saleAttrValueName?: string
  saleAttrName?: string
  isChecked?: null
}
// 储存已有的销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]
// 销售属性对象的ts类型
export interface SaleAttr {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}
// SPU已有销售属性接口返回数据的ts类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 已有的全部的SPU的返回数据的ts类型
export interface HasSaleAttr {
  id: number
  name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}
export interface Attr {
  attrId: number | string
  valueId: number | string
}

export interface saleArr {
  saleAttrId: number | string
  saleAttrValueId: number | string
}
export interface SkuData {
  category3Id: string | number
  spuId: string | number
  tmId: string | number
  skuName: string
  price: string | number
  weight: string | number
  skuDesc: string
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: saleArr[]
  skuDefaultImg: string
}

//获取SKU数据接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
