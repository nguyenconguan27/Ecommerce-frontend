import { Customer, User } from './user.type'
import { SuccessResponse } from './utils.type'

export type AuthResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
  userDTO: Customer
}>

export type RefreshTokenResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
}>
