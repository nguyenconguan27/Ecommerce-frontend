import ProductList from 'src/components/ProductList'
import Filter from './Components/Filter'
import AsideFilter from './Components/AsideFilter'
import { useEffect } from 'react'
import useQueryConfig from 'src/hooks/useQueryConfig'
import Aos from 'aos'
import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/pruduct.api'
import { ProductListConfig } from 'src/types/product.type'
import Product from 'src/components/ProductList/Product/Product'
import categoryApi from 'src/apis/category.api'
import { Category } from 'src/types/category.type'

export default function ProductFilter() {
  const queryConfig = useQueryConfig()
  useEffect(() => {
    Aos.init({ duration: 2000, delay: 0 })
    window.scrollTo({ top: 0 })
  }, [queryConfig])
  console.log(queryConfig)
  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
    // keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })
  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories()
  })
  return (
    <div className='container'>
      <div className='grid grid-cols-12 gap-4 mt-10 mb-2'>
        <div className='col-span-2'></div>
        <div className='col-span-10'>
          <Filter queryConfig={queryConfig}></Filter>
        </div>
      </div>
      <div className='grid grid-cols-12 gap-4'>
        <div className='col-span-2'>
          {categoryData && (
            <AsideFilter queryConfig={queryConfig} categories={categoryData?.data.data as Category[]}></AsideFilter>
          )}
        </div>
        <div className='col-span-10'>
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
      </div>
    </div>
  )
}
