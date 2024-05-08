import { useEffect } from 'react'
import Product from './Product/Product'
import Aos from 'aos'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/pruduct.api'
import { ProductListConfig } from 'src/types/product.type'

export default function ProductList() {
  const queryConfig = useQueryConfig()
  useEffect(() => {
    Aos.init({ duration: 2000, delay: 0 })
    window.scrollTo({ top: 0 })
  }, [queryConfig])
  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
    // keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })
  console.log(productData)
  return (
    <div className='container'>
      <div className='grid grid-cols-4 gap-8' data-aos='fade-up'>
        {productData?.data.data.productList.map((element, index) => {
          return (
            <div>
              <div className='col-span-1'>
                <Product product={element} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
