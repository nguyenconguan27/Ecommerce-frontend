import { ProductListConfig } from 'src/types/product.type'
import useQueryParams from './useQueryParams'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function useQueryConfig() {
  const queryParams = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page_num: queryParams.page_num || 1,
      page_size: queryParams.page_size || 12,
      sort_field: queryParams.sort_field,
      sort_dir: queryParams.sort_dir,
      title: queryParams.title,
      category_id: queryParams.category_id
    },
    isUndefined
  )
  return queryConfig
}
