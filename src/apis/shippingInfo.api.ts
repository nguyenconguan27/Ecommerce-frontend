import { omit } from 'lodash'
import config from 'src/constants/config'
import { ShippingInfo } from 'src/types/shippingInfo.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const shippingInfoApi = {
  getShippingInfo: (customerId: number) =>
    http.get<SuccessResponse<ShippingInfo[]>>(`${config.BASEURL}/shipping-info/?cus_id=${customerId}`),
  add: (body: { address: String; number: String; customerId: number }) =>
    http.post<SuccessResponse<ShippingInfo>>(
      `${config.BASEURL}/shipping-info/add?cus_id=${body.customerId}`,
      omit(body, ['customerId'])
    )
}

export default shippingInfoApi
