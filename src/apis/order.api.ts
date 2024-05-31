import { omit } from 'lodash'
import config from 'src/constants/config'
import { Order } from 'src/types/order.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const ADD_TO_CART = '/add-to-cart'
const UPDATE_ORDER = '/update'

const orderApi = {
  addToCart: (data: { productId: number; quantity: number; size: string; cartId: number }) =>
    http.post(`${config.BASEURL}/cart${ADD_TO_CART}?cartId=${data.cartId}`, omit(data, ['cartId'])),
  getCart: (param: { customerId: number }) => {
    return http.get<SuccessResponse<Order[]>>(`${config.BASEURL}/cart/?customerId=${param.customerId}`)
  },
  update: (body: { orderId: number; quantity: number }) => http.put(`${config.BASEURL}/order${UPDATE_ORDER}`, body),
  deleteOrder: (orderIds: number[]) =>
    http.delete(`${config.BASEURL}/order/delete`, {
      data: orderIds
    })
}

export default orderApi
