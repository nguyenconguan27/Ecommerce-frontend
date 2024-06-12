import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { SearchSchema, searchSchema } from 'src/utils/rules'
import useQueryConfig from './useQueryConfig'
import omit from 'lodash/omit'
import path from 'src/constants/path'

export default function useSearchProduct() {
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()
  const { register, handleSubmit } = useForm<SearchSchema>({
    defaultValues: {
      searchString: ''
    },
    resolver: yupResolver(searchSchema)
  })

  const onSubmit = handleSubmit((data) => {
    const config = queryConfig.sort_dir
      ? createSearchParams(
          omit({ ...queryConfig, title: data.searchString }, ['sort_dir', 'sort_field', 'page_num'])
        ).toString()
      : createSearchParams(omit({ ...queryConfig, title: data.searchString }, ['page_num'])).toString()
    navigate({
      pathname: path.productList,
      search: config
    })
  })
  return { register, onSubmit }
}
