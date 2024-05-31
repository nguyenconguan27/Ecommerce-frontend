import classNames from 'classnames'
import { omit } from 'lodash'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { Category } from 'src/types/category.type'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

export default function AsideFilter({ queryConfig, categories }: Props) {
  const navigate = useNavigate()
  const { category_id } = queryConfig
  const removeFilter = () => {
    navigate({
      pathname: path.productList,
      search: createSearchParams(omit({ ...queryConfig }, ['category_id'])).toString()
    })
  }
  return (
    <div className='flex flex-col items-start bg-gray-100 shadow-md pb-4 px-2'>
      <span className='font-medium text-xl'>Bộ Sưu Tập</span>
      <button
        onClick={removeFilter}
        className={classNames('text-left w-full mt-2 text-gray-500 border-b-2 border-gray-100 py-1 hover:text-pink2')}
      >
        Tất cả
      </button>
      {categories.map((element) => {
        const isActive = element.id === (Number(category_id) as number)
        return (
          <Link
            to={{
              pathname: path.productList,
              search: createSearchParams({ ...queryConfig, category_id: String(element.id) }).toString()
            }}
            className={classNames('w-full mt-2 text-gray-500 border-b-2 border-gray-100 py-1', {
              'text-pink2': isActive,
              'hover:text-pink2': !isActive
            })}
          >
            {element.name}
          </Link>
        )
      })}
    </div>
  )
}
