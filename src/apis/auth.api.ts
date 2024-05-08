import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

export const URL_LOGIN = '/auth/login'
export const URL_LOGOUT = '/auth/logout'
export const URL_REGISTER = '/auth/register'
export const URL_REFRESH_TOKEN = '/auth/refresh-access-token'

const authApi = {
  registerAccount: (body: { username: string; password: string }) => http.post<AuthResponse>(URL_REGISTER, body),
  login: (body: { username: string; password: string }) => http.post<AuthResponse>(URL_LOGIN, body),
  logout: () => http.post(URL_LOGOUT)
}

export default authApi
