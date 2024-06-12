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
          <div
            className={classNames('w-full flex items-center mt-2 text-gray-500 border-b-2 border-gray-100 py-1', {
              'text-pink2': isActive,
              'hover:text-pink2': !isActive
            })}
          >
            {isActive && (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='size-4 mr-2'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5'
                />
              </svg>
            )}
            <Link
              to={{
                pathname: path.productList,
                search: createSearchParams({ ...queryConfig, category_id: String(element.id) }).toString()
              }}
            >
              {element.name}
            </Link>
          </div>
        )
      })}
    </div>
  )
}
