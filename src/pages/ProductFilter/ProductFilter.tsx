import ProductList from 'src/components/ProductList'
import Filter from './Components/Filter'
import AsideFilter from './Components/AsideFilter'

export default function ProductFilter() {
  return (
    <div className='container'>
      <div className='grid grid-cols-12 gap-4 mt-10 mb-2'>
        <div className='col-span-2'></div>
        <div className='col-span-9'>
          <Filter></Filter>
        </div>
      </div>
      <div className='grid grid-cols-12 gap-4'>
        <div className='col-span-2'>
          <AsideFilter></AsideFilter>
        </div>
        <div className='col-span-9'>
          <ProductList></ProductList>
        </div>
      </div>
    </div>
  )
}
