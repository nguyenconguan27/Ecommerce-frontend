import config from 'src/constants/config'
import { ReceiptType } from 'src/types/receipt.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const receiptApi = {
  getReceiptByUser: (status: number, userId: number) => {
    return http.get<SuccessResponse<ReceiptType[]>>(`${config.BASEURL}/receipt/?status=${status}&user_id=${userId}`)
  },
  checkout: (body: { orderIdList: number[]; shippingInfo: number; payMethod: number }) =>
    http.post<SuccessResponse<ReceiptType>>(`${config.BASEURL}/receipt/check-out`, body)
}

export default receiptApi
