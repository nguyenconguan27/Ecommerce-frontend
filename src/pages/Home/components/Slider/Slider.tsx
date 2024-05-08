import { Carousel } from 'flowbite-react'
import logo from 'src/assets/image/logo.png'

export default function Slider() {
  return (
    <div className='h-[500px]'>
      <Carousel slideInterval={2000}>
        <img src={logo} alt='...' />
        <img
          src='https://firebasestorage.googleapis.com/v0/b/ecommerce-project-9b901.appspot.com/o/Picture48.png?alt=media'
          alt='...'
        />
        <img src={logo} alt='...' />
        <img src={logo} alt='...' />
        <img src={logo} alt='...' />
      </Carousel>
    </div>
  )
}
