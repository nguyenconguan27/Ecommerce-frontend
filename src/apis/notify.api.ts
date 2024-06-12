import config from 'src/constants/config'
import { Notify } from 'src/types/notify.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const notifyApis = {
  getByUser: (userId: number) => http.get<SuccessResponse<Notify[]>>(`${config.BASEURL}/notify/?userId=${userId}`),
  updateStatus: (userId: number) => http.put(`${config.BASEURL}/notify/update-status?userId=${userId}`)
}

export default notifyApis
