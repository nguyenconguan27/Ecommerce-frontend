export interface User {
  id: number
  role: string
  email: string
  username: string
  fullName: string
  image?: string
  phone?: string
}

export interface Customer extends User {
  cartId: number
}
