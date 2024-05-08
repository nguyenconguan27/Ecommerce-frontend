import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'file'

const fileApi = {
  getImageFile: (id: string) =>
    http.get<ArrayBuffer>(`${URL}/?image_id=${id}`, {
      responseType: 'arraybuffer'
    })
}

export default fileApi
