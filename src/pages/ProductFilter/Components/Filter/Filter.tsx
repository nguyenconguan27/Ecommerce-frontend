import { Link } from 'react-router-dom'

export default function Filter() {
  return (
    <div className='bg-gray-100 container py-2'>
      <div className='flex justify-between'>
        <div className='flex'>
          <button className='p-2 bg-white hover:bg-pink rounded-sm'>Mới nhất</button>
          <button className='p-2 bg-white hover:bg-pink rounded-sm ml-4'>Bán chạy nhất</button>
          <div className='p-2 bg-white ml-4 rounded-sm'>
            <select name='' id='' className='outline-none'>
              <option value='' disabled>
                Giá
              </option>
              <option value='' className='hover:bg-pink py-2'>
                Thấp đến cao
              </option>
              <option>Cao đến Thấp</option>
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
