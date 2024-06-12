import Slider from 'src/pages/Home/components/Slider'
import path from 'src/constants/path'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import categoryApi from 'src/apis/category.api'
import CategoryShow from './components/CategoryList'
import Service from './components/Service'
import useQueryConfig from 'src/hooks/useQueryConfig'

export default function Home() {
  const { data: categoryList } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories()
  })

  const queryConfig = useQueryConfig()
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
          <div className='w-full flex justify-end m-2 hover:text-pink2'></div>
        </div>
      </div>
    </div>
  )
}
