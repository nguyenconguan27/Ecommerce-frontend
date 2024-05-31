import { Order } from './order.type'
import { ShippingInfo } from './shippingInfo.type'

export interface ReceiptType {
  id?: number
  orderDate?: number
  status?: number
  userId?: number
  orderList?: Order[]
  shippingId?: number
  shippingInfoDTO?: ShippingInfo
}
