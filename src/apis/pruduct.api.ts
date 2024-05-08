import { ProductType, ProductList, ProductListConfig } from 'src/types/product.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = '/product'
const GET_ALL = '/get_all'
const GET_DETAIL = '/detail'

const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>(URL + GET_ALL, {
      params: params
    })
  },
  getProductDetail(id: string) {
    return http.get<SuccessResponse<ProductType>>(`${URL}${GET_DETAIL}/${id}`)
  }
}

export default productApi
