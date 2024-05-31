import config from 'src/constants/config'
import http from 'src/utils/http'

export const paymentApis = {
  createPayment: (amount: number) => http.get(`${config.BASEURL}/payment/vn-pay?amount=${amount}&bankCode=NCB`)
}
