import { useEffect } from 'react'
import Product from './Product/Product'
import Aos from 'aos'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/pruduct.api'
import { ProductListConfig } from 'src/types/product.type'

export default function ProductList() {
  return (
    <div className='container'>
      {/* <div className='grid grid-cols-4 gap-8' data-aos='fade-up'>
        {productData?.data.data.productList.map((element, index) => {
          return (
            <div>
              <div className='col-span-1'>
                <Product product={element} />
              </div>
            </div>
          )
        })}
      </div> */}
    </div>
  )
}
