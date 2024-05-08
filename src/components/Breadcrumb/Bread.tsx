import { Breadcrumb } from 'flowbite-react'
import { HiHome } from 'react-icons/hi'
import path from 'src/constants/path'

export default function Bread() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href={path.home} icon={HiHome}>
        Home
      </Breadcrumb.Item>
      <Breadcrumb.Item href={path.productDetail}>Projects</Breadcrumb.Item>
    </Breadcrumb>
  )
}
