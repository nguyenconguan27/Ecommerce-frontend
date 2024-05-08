import React from 'react'
import { Link } from 'react-router-dom'

export default function AsideFilter() {
  return (
    <div className='flex flex-col items-start bg-gray-100 shadow-md pb-4 px-2 font-mono'>
      <span className='font-medium text-xl'>Bộ Sưu Tập</span>
      <Link to='' className='w-full mt-2 text-gray-500 border-b-2 border-gray-100 py-1'>
        Váy
      </Link>
      <Link to='' className='w-full mt-2 text-gray-500 border-b-2 border-gray-100 py-1'>
        Mùa hè
      </Link>
      <Link to='' className='w-full mt-2 text-gray-500 border-gray-100 py-1'>
        Mùa đông
      </Link>
    </div>
  )
}
