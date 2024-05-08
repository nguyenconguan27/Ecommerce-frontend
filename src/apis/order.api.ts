import { omit } from 'lodash'
import config from 'src/constants/config'
import http from 'src/utils/http'

const ADD_TO_CART = '/add-to-cart'

const orderApi = {
  addToCart: (data: { productId: number; quantity: number; size: string; cartId: number }) =>
    http.post(`${config.BASEURL}${ADD_TO_CART}/?cartId=${data.cartId}`, omit(data, ['cartId']))
  
}

export default orderApi
