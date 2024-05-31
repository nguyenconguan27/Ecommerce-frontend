import Slider from 'src/pages/Home/components/Slider'
import path from 'src/constants/path'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import categoryApi from 'src/apis/category.api'
import CategoryShow from './components/CategoryList'
import Service from './components/Service'

export default function Home() {
  const { data: categoryList } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories()
  })

  return (
    <div>
      <Slider></Slider>
      <div className='container'>
        <Service></Service>
        <div className='w-full'>
          <div>
            {categoryList?.data.data.map((element, index) => {
              if (index <= 3) return <CategoryShow category={element} />
            })}
          </div>
          <div className='w-full flex justify-end m-2 hover:text-pink2'>
            <Link to={path.productList} className='text-lg flex items-center justify-center'>
              Xem thêm
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-5 h-5 ml-2'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3' />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
