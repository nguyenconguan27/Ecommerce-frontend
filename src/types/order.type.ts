import { ProductType } from './product.type'

export type OrderStatus = -1 | 1 | 2 | 3 | 4 | 5

export type OrderListStatus = OrderStatus | 0

export interface Order {
  _id: string
  buy_count: number
  price: number
  price_before_discount: number
  status: OrderStatus
  user: string
  product: ProductType
  createdAt: string
  updatedAt: string
}

export interface ExtendedOrders extends Order {
  checked: boolean
  disable: boolean
}
