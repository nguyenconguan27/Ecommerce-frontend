import 'aos/dist/aos.css'
import { useQuery } from '@tanstack/react-query'
import { Category } from 'src/types/category.type'
import productApi from 'src/apis/pruduct.api'
import Product from 'src/components/ProductList/Product/Product'
import { useEffect } from 'react'
import Aos from 'aos'

interface Props {
  category: Category
}

export default function CategoryShow({ category }: Props) {
  useEffect(() => {
    Aos.init({ duration: 3000, delay: 0 })
  }, [])

  const { data: productData } = useQuery({
    queryKey: ['products', 'category', category.id],
    queryFn: () => productApi.getProducts({ category_id: category.id }),
    // keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })
  return (
    <div className='mb-10 grid grid-cols-8 gap-10' data-aos='fade-up'>
      <div className='col-span-8 text-center uppercase text-2xl font-medium'>{category.name}</div>
      <div className='col-span-3  rounded-md overflow-hidden'>
        <img src={category.image} className='w-full h-full' alt='' />
      </div>
      <div className='col-span-5'>
        <div className='grid grid-cols-3'>
          {productData?.data.data.productList.map((element, index) => {
            if (index <= 3)
              return (
                <div className='col-span-1 h-1/2' id={index.toString()}>
                  <Product product={element} />
                </div>
              )
          })}
        </div>
      </div>
      <div className='col-start-2   col-span-6 border'></div>
    </div>
  )
}
