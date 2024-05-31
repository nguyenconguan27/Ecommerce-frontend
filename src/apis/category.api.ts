import config from 'src/constants/config'
import { Category } from 'src/types/category.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = '/category/get-all'

const categoryApi = {
  getCategories() {
    return http.get<SuccessResponse<Category[]>>(`${config.BASEURL}${URL}`)
  }
}

export default categoryApi
