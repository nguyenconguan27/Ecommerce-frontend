import { User } from './user.type'
import { SuccessResponse } from './utils.type'

export type AuthResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
  userDTO: User
}>

export type RefreshTokenResponse = SuccessResponse<{
  accessToken: string
}>
