import { ProductType } from './product.type'

export type OrderStatus = 0 | 1 | 2

export type OrderListStatus = OrderStatus | 0

export interface Order {
  id: number
  quantity: number
  price: number
  prePrice: number
  status: OrderStatus
  cartId: number
  size: String
  product: ProductType
}

export interface ExtendedOrders extends Order {
  checked: boolean
  disable: boolean
}
