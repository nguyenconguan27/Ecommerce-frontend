import config from 'src/constants/config'
import { Review } from 'src/types/review.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const GET_REVIEW = '/review'
const ADD_REVIEW = '/review/add'

export const reviewApi = {
  getByProduct: (productId: number) => {
    return http.get<SuccessResponse<Review[]>>(`${config.BASEURL}${GET_REVIEW}/?productId=${productId}`)
  },
  addReivew: (body: { rate: number; content: string }, userId: number, orderId: number) =>
    http.post(`${config.BASEURL}${ADD_REVIEW}?userId=${userId}&orderId=${orderId}`, body)
}
