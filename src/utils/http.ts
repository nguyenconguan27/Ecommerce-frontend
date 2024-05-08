import axios, { AxiosError, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  saveAccesTokenToLS,
  saveProfileToLS,
  saveRefreshTokenToLS
} from './auth'
import config from 'src/constants/config'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from 'src/apis/auth.api'
import { isAxiosExpiredTokenError } from './utils'
import { ErrorResponse } from 'src/types/utils.type'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: config.BASEURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.authorization = this.accessToken
        return config
      }
      return config
    })
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.accessToken
          this.refreshToken = data.data.refreshToken
          saveRefreshTokenToLS(this.refreshToken)
          saveAccesTokenToLS(this.accessToken)
          saveProfileToLS(data.data.userDTO)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }
        return response
      },
      (error: AxiosError) => {
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        // l
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          if (isAxiosExpiredTokenError<ErrorResponse<{ name: string; message: string }>>(error)) {
            const config = error.response.config
            const { url } = config
            if (url !== URL_REFRESH_TOKEN) {
              this.refreshTokenRequest = this.refreshTokenRequest
                ? this.refreshTokenRequest
                : this.handleRefreshToken().finally(() => {
                    this.refreshTokenRequest = null
                  })
              return this.refreshTokenRequest
                .then((access_token) => {
                  config.headers.Authorization = access_token
                  return this.instance(config)
                })
                .catch((error) => {
                  throw error
                })
            }

            clearLS()
            this.accessToken = ''
            this.refreshToken = ''
            toast.error(error.response.data.data?.message)
          }
        }
        return Promise.reject(error)
      }
    )
  }

  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { accessToken } = res.data.data
        saveAccesTokenToLS(accessToken)
        this.accessToken = accessToken
        return accessToken
      })
      .catch((error) => {
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const http = new Http().instance

export default http
