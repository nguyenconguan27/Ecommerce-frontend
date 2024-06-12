import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { profile } from 'console'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import orderApi from 'src/apis/order.api'
import productApi from 'src/apis/pruduct.api'
import { reviewApi } from 'src/apis/review.api'
import ProductRating from 'src/components/ProductRating'
import QuantitySelect from 'src/components/QuantitySelect'
import { orderStatus } from 'src/constants/order'
import { ProductType } from 'src/types/product.type'
import { getProfileFromLS } from 'src/utils/auth'
import { dateTranfer, formatCurrency, getAvatarURL, getIdFromNameId, getImage, perSale } from 'src/utils/utils'

export default function ProductDetail() {
  const imageRef = useRef<HTMLImageElement>(null)
  const [currentIndexImages, setCurrentIndexImage] = useState([0, 5])
  const [buyCount, setBuyCount] = useState(1)
  const [activeImage, setActiveImage] = useState('')
  const [sizeIndexPiecked, setSizeIndexPicked] = useState(-1)
  const [sizePicked, setSizePicked] = useState('')
  const profile = getProfileFromLS()
  const { nameId } = useParams()
  const id = nameId && getIdFromNameId(nameId as string)
  const navigate = useNavigate()

  const queryClient = useQueryClient()
  const { data: productData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', { productId: id }],
    queryFn: () => reviewApi.getByProduct(Number(id) as number)
  })
  const orderMutation = useMutation({
    mutationFn: (data: { productId: number; quantity: number; size: string; cartId: number }) =>
      orderApi.addToCart(data)
  })
  const product = productData?.data.data
  useEffect(() => {
    if (product && product.imageList.length > 0) {
      setActiveImage(product.imageList[0].fileName)
    }
  }, [product])

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  const handleActiveImage = (image: string) => {
    setActiveImage(image)
  }

  const handleChangeQuantity = (value: number) => {
    setBuyCount(value)
  }

  const handleFocusOut = (value: number) => {
    if (value === 0) {
      setBuyCount(1)
    }
  }

  const currentImages: string[] = useMemo(
    () =>
      product
        ? product.imageList.slice(...currentIndexImages).map((image) => {
            return image.fileName
          })
        : [],
    [product, currentIndexImages]
  )

  const next = () => {
    if (currentIndexImages[1] < (product as ProductType).imageList.length) {
      setCurrentIndexImage((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const pre = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImage((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleChangePickedSize = (sizeNum: number, size: string) => {
    setSizePicked(size)
    setSizeIndexPicked(sizeNum)
  }

  const handleAddToCart = () => {
    orderMutation.mutate(
      { productId: product?.id as number, quantity: buyCount, size: sizePicked, cartId: profile.cartId },
      {
        onSuccess: () => {
          toast.success('Thêm giỏ hàng thành công', {
            autoClose: 1000
          })
          queryClient.invalidateQueries({ queryKey: ['cart', { status: orderStatus.INCART }] })
          queryClient.invalidateQueries({ queryKey: ['product', id] })
        }
      }
    )
  }

  return (
    <div className='bg-gray-50'>
      <div className='container pt-10'>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-5 col-start-2'>
            <div
              className='relative w-full pt-[100%] shadow overflow-hidden cursor-zoom-in'
              onMouseMove={handleZoom}
              onMouseLeave={handleRemoveZoom}
            >
              <img src={activeImage} className='object-cover absolute left-0 top-0 w-full h-full' ref={imageRef} />
            </div>
            <div className='grid grid-cols-5 gap-4 mt-3 relative'>
              <button
                className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 text-white bg-black/20'
                onClick={pre}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </button>
              <button
                className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 text-white bg-black/20'
                onClick={next}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </button>
              {currentImages.map((image) => {
                const isActive = image === activeImage
                return (
                  <div key={image} className='relative pt-[100%]' onMouseEnter={() => handleActiveImage(image)}>
                    <img className='absolute left-0 top-0 w-full h-full object-cover' src={image} alt='' />
                    {isActive && <div className='absolute inset-0 border-[2px] border-pink2'></div>}
                  </div>
                )
              })}
            </div>
          </div>
          <div className='m-10 col-span-6'>
            <div className='flex items-center'>
              <span className='uppercase font-bold mr-4'>Sản phẩm mới</span>
              <ProductRating rating={product?.rate as number} />
              <span className='ml-1'>{product?.rate == 0 ? 'Chưa có đánh giá' : product?.rate}</span>
            </div>
            <div>
              <span className='text-xs text-gray-600 mr-2'>Đã bán:</span>
              <span className='text-gray-600'>{product?.sold}</span>
            </div>
            <div className='mt-6 flex items-center'>
              <span className='line-through text-gray-400 text-sm'>₫{formatCurrency(product?.prePrice as number)}</span>
              <span className='text-pink2 ml-4'>₫</span>
              <span className='text-pink2 text-2xl'>{formatCurrency(product?.price as number)}</span>
              <div className='rounded-sm bg-pink  text-gray-500 uppercase text-sm ml-2 px-1 py-1'>
                {perSale(product?.prePrice as number, product?.price as number)}
              </div>
            </div>
            <div className='mt-3'>
              <span>Kích thước:</span>
              <div className='mt-3 flex w-[40%] justify-start'>
                {product?.sizeList.map((size, index) => {
                  return (
                    <button
                      className={classNames('mr-5 bg-gray-200 px-4 py-2 rounded-md text-sm hover:bg-pink', {
                        'bg-pink': sizeIndexPiecked === index,
                        'pointer-events-none opacity-70 text-gray-500': size.quantity === 0
                      })}
                      onClick={() => handleChangePickedSize(index, size.size)}
                    >
                      {size.size}
                    </button>
                  )
                })}
              </div>
              {sizeIndexPiecked !== -1 && (
                <span className='text-sm font-light'>số lượng: {product?.sizeList[sizeIndexPiecked].quantity}</span>
              )}
            </div>
            <div
              className='mt-5'
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(productData?.data.data.des || '')
              }}
            ></div>
            <div className='mt-10 flex items-center'>
              <div>
                <QuantitySelect
                  classNameWrapper='flex'
                  value={buyCount}
                  productQuantity={
                    (sizeIndexPiecked !== -1 && (product?.sizeList[sizeIndexPiecked].quantity as number)) || 1
                  }
                  onType={(value) => handleChangeQuantity(value)}
                  decrease={(value) => handleChangeQuantity(value)}
                  increase={(value) => handleChangeQuantity(value)}
                  onFocusOut={(value) => handleFocusOut(value)}
                />
              </div>

              {sizeIndexPiecked !== -1 && (
                <span className='ml-5'>{product?.sizeList[sizeIndexPiecked].quantity} sản phẩm có sẵn</span>
              )}
            </div>
            <div className='mt-5 flex'>
              <button
                onClick={handleAddToCart}
                className='px-3 py-3 bg-pink3 border border-pink2 hover:opacity-90 text-gray-500 rounded-sm'
              >
                Thêm vào giỏ
              </button>
              <button className='ml-10 px-5 py-3 bg-pink hover:opacity-90 text-gray-500 rounded-sm'>Mua ngay</button>
            </div>
          </div>
          <div className='shadow-sm col-start-2 col-span-11 my-8 mt-10'>
            <div className='uppercase mb-4'>Đánh giá từ khách hàng</div>
            {reviewsData?.data.data.map((reivew) => {
              return (
                <div className='border-y py-3'>
                  <div className='flex ml-5 items-top'>
                    <div className='flex w-7 h-7 ml-4 mr-2 flex-shrink-0'>
                      <img
                        src={getAvatarURL(reivew.userImage)}
                        alt=''
                        className='rounded-full w-full h-full object-cover bg-pink'
                      />
                    </div>
                    <div className='mr-4 grid'>
                      <div>{reivew.username}</div>
                      <div className='text-gray-400 text-xs'>{dateTranfer(reivew.commentDate as number)}</div>
                    </div>
                    <ProductRating rating={reivew.rate as number} />
                    <span className='text-gray-400 text-sm'>{reivew?.rate}</span>
                  </div>
                  <div className='mt-2 ml-16'>{reivew.content}</div>
                </div>
              )
            })}
          </div>
        </div>
        <div className='pt-8 shadow-sm'>
          <div className='uppercase'>Sản phẩm liên quan</div>
          <div className='grid grid-cols-4 gap-8'>
            {/* <div className='col-span-1'>
              <Product product={}/>
            </div>
            <div className='col-span-1'>
              <Product />
            </div>
            <div className='col-span-1'>
              <Product />
            </div>
            <div className='col-span-1'>
              <Product />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
