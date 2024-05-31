import axios, { AxiosError } from 'axios'
import config from 'src/constants/config'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { ErrorResponse } from 'src/types/utils.type'
import userImage from 'src/assets/image/user.svg'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntity<FormError>(error: unknown): error is AxiosError<FormError> {
  return (
    isAxiosError(error) &&
    (error.response?.status === HttpStatusCode.UnprocessableEntity ||
      error.response?.status === HttpStatusCode.Unauthorized)
  )
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error) &&
    error.response?.data?.message === 'Expired_Token'
  )
}

const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLocaleLowerCase()
}

export const perSale = (prePrice: number, curPrice: number) => {
  return Math.round((Math.abs(prePrice - curPrice) / prePrice) * 100) + '%'
}

export const getAvatarURL = (avatarName?: string) => (avatarName ? `${config.BASEURL}/file/${avatarName}` : userImage)

export const getImage = (image: ArrayBuffer | undefined) => {
  if (!image) return ''
  const imageBlob = new Blob([image], { type: 'image/jpg' })
  return URL.createObjectURL(imageBlob)
}

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}

export const dateTranfer = (time: number) => {
  let date = new Date(time)
  let day = date.getUTCDate()
  let month = date.getUTCMonth() + 1
  let year = date.getUTCFullYear()
  let formattedDate = `${day}/${month}/${year}`
  return formattedDate
}
