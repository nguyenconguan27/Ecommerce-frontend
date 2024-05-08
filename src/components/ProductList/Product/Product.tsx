import { Link } from 'react-router-dom'
import { ProductType } from 'src/types/product.type'
import { generateNameId, getImage } from 'src/utils/utils'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  return (
    <Link to={`/${generateNameId({ name: product.title, id: String(product.id) })}`}>
      <div className='p-2 bg-gray-100 rounded-sm'>
        <div className='pb-2 my-3 bg-white shadow-sm rounded-sm hover:translate-y-[-0.03rem] hover:shadow-md duration-100 transition-transform overflow-hidden'>
          <div className='w-full pt-[100%] relative'>
            <img
              src={product.imageList[0].fileName}
              className='absolute top-0 left-0 w-full h-full object-cover'
              alt=''
            />
          </div>
          <div className='px-2 py-4'>
            <div className='min-h-[2rem] text-sm text-center line-clamp-2 overflow-hidden font-bold font-mono'>
              Váy Công Chúa
            </div>
            <div className='text-center'>
              <span className='text-red-500 text-sm font-bold'>₫</span>
              <span className='text-red-500 text-sm font-bold'>{product.price}</span>
              <span className=' text-gray-400 text-xs ml-2'>₫</span>
              <span className='line-through text-gray-400 text-xs'>{product.prePrice}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}