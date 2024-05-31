import { Carousel } from 'flowbite-react'
import logo from 'src/assets/image/logo.png'
import img1 from 'src/assets/image/fairytale-03-2048x1024.jpg'
import img2 from 'src/assets/image/1.jpg'
export default function Slider() {
  return (
    <div className='h-[500px]'>
      <Carousel slideInterval={2000}>
        <img src={logo} alt='...' />

        <img src={img1} alt='...' />
        <img src={img2} alt='...' />
      </Carousel>
    </div>
  )
}
