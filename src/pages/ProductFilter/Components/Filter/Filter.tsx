import { Link } from 'react-router-dom'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { omit } from 'lodash'
import { ProductListConfig } from 'src/types/product.type'
import path from 'src/constants/path'
import { sortField, dir } from 'src/constants/productFilter'
import classNames from 'classnames'

interface Props {
  queryConfig: QueryConfig
}

export default function Filter({ queryConfig }: Props) {
  const { sort_field = '', sort_dir, page_num = '1' } = queryConfig
  const navigate = useNavigate()
  const isActiveFilter = (sortByValue: Exclude<ProductListConfig['sort_field'], undefined>) => {
    return sort_field === sortByValue
  }
  const handleSort = (sortFieldValue: Exclude<ProductListConfig['sort_field'], undefined>) => {
    navigate({
      pathname: path.productList,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_field: sortFieldValue
          },
          ['sort_dir']
        )
      ).toString()
    })
  }
  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['sort_dir'], undefined>) => {
    navigate({
      pathname: path.productList,
      search: createSearchParams({
        ...queryConfig,
        sort_dir: orderValue,
        sort_field: sortField.price
      }).toString()
    })
  }
  return (
    <div className='bg-gray-100 container py-2'>
      <div className='flex justify-between'>
        <div className='flex'>
          <button
            className={classNames('p-2 rounded-sm', {
              'bg-pink': isActiveFilter(sortField.release_date),
              'bg-white hover:bg-pink ': !isActiveFilter(sortField.release_date)
            })}
            onClick={() => handleSort(sortField.release_date)}
          >
            Mới nhất
          </button>
          <button
            className={classNames('p-2 rounded-sm ml-4', {
              'bg-pink': isActiveFilter(sortField.sold),
              'bg-white hover:bg-pink ': !isActiveFilter(sortField.sold)
            })}
            onClick={() => handleSort(sortField.sold)}
          >
            Bán chạy nhất
          </button>
          <div className=' bg-white ml-4 rounded-sm hover:bg-pink'>
            <select
              name=''
              id=''
              className={classNames('outline-none w-full h-full p-2', {
                'bg-pink': isActiveFilter(sortField.price),
                'hover:bg-pink': !isActiveFilter(sortField.price)
              })}
              value={sort_dir || ''}
              onChange={(event) =>
                handlePriceOrder(event.target.value as Exclude<ProductListConfig['sort_dir'], undefined>)
              }
            >
              <option className='bg-gray-200 py-2' value='' disabled>
                Giá
              </option>
              <option value={dir.asc} className='bg-gray-200 py-2'>
                Thấp đến cao
              </option>
              <option value={dir.desc} className='bg-gray-200 py-2'>
                Cao đến Thấp
              </option>
            </select>
          </div>
        </div>
        <div className='flex justify-between'>
          <Link to='' className='bg-gray-200 hover:opacity-80 border-2 border-gray-200 px-2 pt-2 rounded-sm'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='w-4 h-4'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
            </svg>
          </Link>
          <Link to='' className='ml-1 bg-gray-200 hover:opacity-80 border-2 border-gray-200 px-2 pt-2 rounded-sm'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='w-4 h-4'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
