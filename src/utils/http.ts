import axios, { AxiosError, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import {
  clearLS,
  getAccessTokenFromLS,
  getProfileFromLS,
  getRefreshTokenFromLS,
  saveAccesTokenToLS,
  saveProfileToLS,
  saveRefreshTokenToLS
} from './auth'
import config from 'src/constants/config'
import { URL_LOGIN, URL_LOGOUT, URL_REGISTER } from 'src/apis/auth.api'
const URL_REFRESH_TOKEN = '/auth/refresh-token'

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
          this.accessToken = 'Bearer ' + data.data.accessToken
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
          console.log(error)
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          const configURL = error.response?.config || { headers: {}, url: '' }
          const { url } = configURL
          if (url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest
              .then((access_token) => {
                return this.instance({ ...configURL, headers: { ...configURL.headers, authorization: access_token } })
              })
              .catch((error) => {
                throw error
              })
          }
          toast.error('Vui lòng đăng nhập lại')
          clearLS()
          this.accessToken = ''
          this.refreshToken = ''
          setTimeout(() => {
            window.location.href = `http://localhost:3001/login`
          }, 1000)
        }
        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    const profile = getProfileFromLS()
    return axios
      .post<RefreshTokenResponse>(
        `${config.BASEURL}${URL_REFRESH_TOKEN}`,
        {
          refreshToken: this.refreshToken,
          username: profile.username
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then((res) => {
        let { accessToken } = res.data.data
        accessToken = 'Bearer ' + accessToken
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
