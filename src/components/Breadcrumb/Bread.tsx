import { Breadcrumb } from 'flowbite-react'
import { HiHome } from 'react-icons/hi'
import path from 'src/constants/path'

interface Props {
  tag?: String
}

export default function Bread({ tag }: Props) {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href={path.home}>
        <span className='flex justify-between items-center hover:text-gray-400 hover:opacity-80'>
          <HiHome className='mr-1' />
          Trang chủ
        </span>
      </Breadcrumb.Item>
      {tag && (
        <Breadcrumb.Item href='/'>
          <span className='flex justify-between items-center hover:text-gray-400 hover:opacity-80'>{tag}</span>
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  )
}
