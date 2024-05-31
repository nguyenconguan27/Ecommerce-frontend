import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import keyBy from 'lodash/keyBy'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from 'src/components/Button'
import path from 'src/constants/path'
import { orderStatus, paymentMethod } from 'src/constants/order'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import noproduct from 'src/assets/image/no-product.png'
import QuantitySelect from 'src/components/QuantitySelect'
import orderApi from 'src/apis/order.api'
import { AppContext } from 'src/context/app.context'
import { Order } from 'src/types/order.type'
import { Modal } from 'flowbite-react'
import shippingInfoApi from 'src/apis/shippingInfo.api'
import classNames from 'classnames'
import vnpaylogo from 'src/assets/image/vnpaylogo.svg'
import paymentlogo from 'src/assets/image/paymentlogo.png'
import { paymentApis } from 'src/apis/payment.api'
import { config } from 'process'
import e from 'cors'
import receiptApi from 'src/apis/receipt.api'

interface ExtendedPurchases extends Order {
  checked: boolean
  disable: boolean
}

export default function Cart() {
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchases[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [openAddShippingForm, setOpenAddShippingForm] = useState(false)
  const [paymentMethode, setPaymentMethod] = useState(0)
  const { isAuthenticated, profile } = useContext(AppContext)
  const [shippingIndexPicked, setShippingIndexPicked] = useState(-1)
  const [shippingInfo, setShippinInfo] = useState({ address: '', number: '', customerId: profile?.id as number })
  const { setCheckoutData } = useContext(AppContext)
  const navigate = useNavigate()

  const { data: orderInCartData, refetch } = useQuery({
    queryKey: ['cart', { status: orderStatus.INCART }],
    queryFn: () => orderApi.getCart({ customerId: profile?.id as number }),
    enabled: isAuthenticated
  })
  const { data: shippingInfoData } = useQuery({
    queryKey: ['shippingInfo', [profile?.id]],
    queryFn: () => shippingInfoApi.getShippingInfo(profile?.id as number)
  })

  const queryClient = useQueryClient()
  const updataMutation = useMutation({
    mutationFn: (body: { orderId: number; quantity: number }) => orderApi.update(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', { status: orderStatus.INCART }] })
      refetch()
    },
    onError: (error) => {
      console.log(error)
    }
  })
  const shippingInfoMutation = useMutation({
    mutationFn: (body: { address: String; number: String; customerId: number }) => shippingInfoApi.add(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shippingInfo', [profile?.id]] })
      toast.success('Thêm địa chỉ thành công', {
        autoClose: 1000
      })
    }
  })
  const deletePurchaseMutation = useMutation({
    mutationFn: (purchaseIds: number[]) => orderApi.deleteOrder(purchaseIds),
    onSuccess: () => {
      toast.info('Xoá sản phẩm thành công', {
        autoClose: 1000
      })
      refetch()
    }
  })
  const checkoutMutation = useMutation({
    mutationFn: (body: { orderIdList: number[]; shippingInfo: number; payMethod: number }) => receiptApi.checkout(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', { status: orderStatus.INCART }] })
    }
  })

  const ordersInCart = orderInCartData?.data.data
  const location = useLocation()
  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: number } | null)?.purchaseId
  // console.log(choosenPurchaseIdFromLocation)
  const isAllChecked = useMemo(
    () => extendedPurchases.every((purchase) => purchase.checked === true),
    [extendedPurchases]
  )

  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])

  const amount = useMemo(() => {
    let total = 0
    extendedPurchases.forEach((purchase) => {
      if (purchase.checked === true) {
        total += purchase.price * purchase.quantity
      }
    })
    return total
  }, [extendedPurchases])
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const exteneddpurchasesObject = keyBy(prev, '_id')
      return (
        ordersInCart?.map((order) => ({
          ...order,
          checked: choosenPurchaseIdFromLocation === order.id || Boolean(exteneddpurchasesObject[order.id]?.checked),
          disable: false
        })) || []
      )
    })
  }, [ordersInCart, choosenPurchaseIdFromLocation])

  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases((prev) =>
      prev.map((purchase, index) => {
        if (index === purchaseIndex) {
          return { ...purchase, checked: event.target.checked }
        }
        return purchase
      })
    )
  }

  const handleAllChecked = () => {
    setExtendedPurchases((prev) => prev.map((purchase) => ({ ...purchase, checked: !isAllChecked })))
  }

  const handleUpdate = (purchaseIndex: number, value: number, enable: boolean) => {
    if (value === 0) {
      value = 1
      setExtendedPurchases((prev) =>
        prev.map((purchase, index) => {
          if (index === purchaseIndex) {
            return { ...purchase, quantity: value }
          }
          return purchase
        })
      )
    } else if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases((prev) =>
        prev.map((purchase, index) => {
          if (index === purchaseIndex) {
            return { ...purchase, disable: true }
          }
          return purchase
        })
      )
      updataMutation.mutate(
        { orderId: purchase.id, quantity: value },
        {
          onError: (error) => {
            console.log(error)
          },
          onSuccess: (data) => {
            console.log(data)
          }
        }
      )
    }
  }

  const handleQuatityChange = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      setExtendedPurchases((prev) =>
        prev.map((purchase, index) => {
          if (index === purchaseIndex) {
            return { ...purchase, quantity: value }
          }
          return purchase
        })
      )
    }
  }

  const handleDelete = (purchaseId: number) => {
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeleteMultiPurchase = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase.id)
    deletePurchaseMutation.mutate(purchaseIds)
  }

  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.quantity
      }, 0),
    [checkedPurchases]
  )

  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.prePrice - current.product.price) * current.quantity
      }, 0),
    [checkedPurchases]
  )

  const createCheckoutData = async () => {
    const buyPurchases = extendedPurchases.filter((purchase) => purchase.checked)
    const orderList: number[] = []
    buyPurchases.map((purchase) => {
      orderList.push(purchase.id)
    })
    const body = { orderIdList: orderList, shippingInfo: shippingIndexPicked, payMethod: paymentMethode }
    setCheckoutData(body)
    if (checkedPurchases.length > 0) {
      await checkoutMutation.mutateAsync(body)
    }
  }

  const handleBuyPurchases = () => {
    createCheckoutData()
    if (paymentMethode === paymentMethod.ONLINE && checkedPurchases.length > 0) {
      const paymentData = paymentApis
        .createPayment(amount)
        .then((data) => {
          window.location.href = data.data.data
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      navigate(`${path.historyPurchase}?status=1&checkout=1`)
    }
  }

  const handleSelectShippingInfo = (id: number) => {
    setShippingIndexPicked(id)
  }
  const handleAddShippingInfo = () => {
    if (openAddShippingForm) {
      shippingInfoMutation.mutate(shippingInfo)
      setOpenAddShippingForm(false)
    }
    setOpenAddShippingForm(true)
  }

  const handleChangeShippingInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShippinInfo({ ...shippingInfo, [event.target.name]: event.target.value })
  }

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(Number(e.target.value))
  }

  return (
    <div className='bg-neutral-100 pb-10'>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className='bg-cyan-100'>
          <span className='text-pink2'>Chọn thông tin giao hàng</span>
        </Modal.Header>
        <Modal.Body className='bg-gray-200 grid grid-cols-2 gap-8'>
          {shippingInfoData?.data.data.map((shippingInfo) => {
            return (
              <button
                className=' bg-gray-200 col-span-1 text-left'
                onClick={() => handleSelectShippingInfo(shippingInfo.id)}
              >
                <div
                  className={classNames(
                    'border border-gray-400 text-xs rounded-md p-3 grid grid-cols-3 bg-pink3 hover:opacity-70',
                    {
                      'border-pink2 border-2': shippingIndexPicked === shippingInfo.id
                    }
                  )}
                >
                  <div className='col-span-1'>Địa chỉ:</div>
                  <div className='col-span-2'>{shippingInfo.address}</div>
                  <div className='col-span-1'>SDT:</div>
                  <div className='col-span-2'>{shippingInfo.number}</div>
                </div>
              </button>
            )
          })}
          {openAddShippingForm && (
            <div className='border col-span-2 border-gray-400 text-xs rounded-md p-3 grid grid-cols-3 hover:opacity-70'>
              <div className='col-span-1'>Địa chỉ:</div>
              <input name='address' className='col-span-2 py-3 mb-2 pl-2' onChange={handleChangeShippingInfo}></input>
              <div className='col-span-1 py-3'>SDT:</div>
              <input name='number' className='col-span-2 pl-2' onChange={handleChangeShippingInfo}></input>
            </div>
          )}
          <button
            onClick={handleAddShippingInfo}
            className='text-sm rounded-lg py-3 border border-gray-400 col-span-2 text-center bg-green-300 hover:opacity-70'
          >
            {!openAddShippingForm ? 'Thêm mới' : 'Lưu'}
          </button>
        </Modal.Body>
        <Modal.Footer className='bg-gray-200 flex justify-between'>
          <div>
            <div className='flex justify-start items-center'>
              <input
                className='w-4 h-4'
                type='radio'
                name='paymentMethod'
                value={1}
                checked={paymentMethode === 1}
                onChange={handlePaymentChange}
              />
              <label className='ml-4'>Thanh toán qua VNPay</label>
              <img className='ml-4' src={vnpaylogo} />
            </div>
            <br />
            <div className='flex justify-start items-center'>
              <input
                className='w-4 h-4'
                type='radio'
                name='paymentMethod'
                value={2}
                checked={paymentMethode === 2}
                onChange={handlePaymentChange}
              />
              <label className='ml-4'>Thanh toán khi nhận hàng</label>
              <img className='ml-4 h-14 w-14' src={paymentlogo} />
            </div>
            <br />
          </div>
          <button
            className={classNames('text-white rounded-md px-3 py-2 hover:opacity-70 ', {
              'bg-pink2': shippingIndexPicked !== -1 && paymentMethode !== 0,
              'bg-slate-500': shippingIndexPicked === -1 || paymentMethode === 0
            })}
            onClick={handleBuyPurchases}
          >
            Đặt hàng
          </button>
        </Modal.Footer>
      </Modal>
      <div className='container'>
        <div className='overflow-auto'>
          <div className='pt-8'>
            <div className='min-w-[1000px]'>
              <div className='bg-white grid grid-cols-12 py-2 px-3 shadow-sm rounded-sm border border-gray-200'>
                <div className='col-span-6'>
                  <div className='flex items-center ml-8'>
                    <input
                      type='checkbox'
                      className='accent-pink2 h-4 w-4'
                      checked={isAllChecked}
                      onChange={handleAllChecked}
                    />
                    <span className='capitalize text-sm ml-4'>sản phẩm</span>
                  </div>
                </div>
                <div className='col-span-6'>
                  <div className='text-gray-400 capitalize'>
                    <div className='grid grid-cols-6 text-center'>
                      <span className='text-sm col-span-1'>Kích cỡ</span>
                      <span className='text-sm col-span-2'>Đơn giá</span>
                      <span className='text-sm col-span-1'>Số lượng</span>
                      <span className='text-sm col-span-1'>Số tiền</span>
                      <span className='text-sm col-span-1'>Thao tác</span>
                    </div>
                  </div>
                </div>
              </div>
              {extendedPurchases.length > 0 && (
                <div className='bg-white border border-gray-200 mt-3 py-4 px-3 shadow-sm rounded-sm'>
                  {extendedPurchases.map((purchase, index) => {
                    let sizeIndex = 0
                    purchase.product.sizeList.map((size, index) => {
                      if (size.size === purchase.size) {
                        sizeIndex = index
                      }
                    })
                    return (
                      <div key={purchase.id} className='grid grid-cols-12 py-4 border shadow-sm last:mb-0 mb-4'>
                        <div className='col-span-6'>
                          <div className='flex items-center ml-8'>
                            <div className='flex items-center justify-center'>
                              <input
                                type='checkbox'
                                className='accent-pink2 h-4 w-4'
                                checked={purchase.checked}
                                onChange={handleChecked(index)}
                              />
                            </div>
                            <Link
                              to={`${path.home}${generateNameId({
                                name: purchase.product.title,
                                id: String(purchase.product.id)
                              })}`}
                              className='ml-4 flex'
                            >
                              <img
                                src={purchase.product.imageList[0].fileName}
                                alt=''
                                className='object-cover h-20 w-20'
                              />
                              <span className='line-clamp-2 text-sm max-h-[40px] max-w-[150px] pl-2 mt-2'>
                                {purchase.product.title}
                              </span>
                            </Link>
                          </div>
                        </div>
                        <div className='col-span-6'>
                          <div className='grid grid-cols-6'>
                            <div className='col-span-1 text-center text-gray-600 flex justify-center items-center'>
                              {purchase.size}
                            </div>
                            <div className='col-span-2 text-center flex justify-center items-center'>
                              <span className='line-through text-xs text-gray-400'>
                                {formatCurrency(purchase.product.prePrice)}
                              </span>
                              <span className='ml-3 text-sm text-gray-600'>
                                {formatCurrency(purchase.product.price)}
                              </span>
                            </div>
                            <div className='col-span-1'>
                              <QuantitySelect
                                productQuantity={purchase.product.sizeList[sizeIndex].quantity}
                                value={purchase.quantity}
                                disabled={purchase.disable}
                                classNameWrapper='flex justify-center'
                                increase={(value) =>
                                  handleUpdate(
                                    index,
                                    value,
                                    value <= purchase.product.sizeList[sizeIndex].quantity &&
                                      purchase.quantity !== value
                                  )
                                }
                                decrease={(value) =>
                                  handleUpdate(index, value, value >= 1 && purchase.quantity !== value)
                                }
                                onType={(value) => handleQuatityChange(index, value, true)}
                                onFocusOut={(value) =>
                                  handleUpdate(
                                    index,
                                    value,
                                    value <= purchase.product.sizeList[sizeIndex].quantity &&
                                      value >= 1 &&
                                      (ordersInCart as Order[])[index].quantity !== value
                                  )
                                }
                              />
                            </div>
                            <div className='col-span-1 justify-center text-pink2 flex items-center'>
                              {formatCurrency(purchase.price * purchase.quantity)}
                            </div>
                            <div className='col-span-1 flex justify-center items-center'>
                              <button
                                className='bg-none text-black outline-none hover:text-pink2 text-sm'
                                onClick={() => handleDelete(purchase.id)}
                              >
                                Xoá
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        {extendedPurchases.length > 0 ? (
          <div className='sticky bg-white mt-4 shadow-sm border border-gray-200 bottom-0 z-10 flex flex-col sm:flex-row sm:items-center rounded-sm px-3 py-5 text-sm'>
            <div className='flex items-center'>
              <div className='flex flex-shrink-0 justify-center'>
                <input
                  type='checkbox'
                  className='accent-pink2 h-4 w-4'
                  checked={isAllChecked}
                  onChange={handleAllChecked}
                />
              </div>
              <button className='mx-3 bg-none border-none outline-none' onClick={handleAllChecked}>
                Chọn Tất Cả
              </button>
              <button className='mx-3 bg-none border-none outline-none' onClick={handleDeleteMultiPurchase}>
                Xoá
              </button>
            </div>

            <div className='sm:flex sm:items-center sm:ml-auto'>
              <div>
                <div className='flex items-center sm:justify-center'>
                  <div>Tổng thanh toán ({checkedPurchases.length} sản phẩm)</div>
                  <div className='ml-2 text-xl text-pink2'>₫{formatCurrency(totalCheckedPurchasePrice)}</div>
                </div>
                <div className='flex items-center sm:justify-end text-sm'>
                  <div className='text-gray-500'> Tiết kiệm</div>
                  <div className='ml-2 text-sm text-pink2'>₫{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                </div>
              </div>
              <div className='flex'>
                <Button
                  className='text-center px-3 py-2 ml-auto sm:ml-4 uppercase bg-pink text-gray-600 text-sm flex-shrink-0 hover:bg-pink2 hover:text-white'
                  onClick={() => {
                    setOpenModal(true)
                  }}
                >
                  Mua Hàng
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center mt-8'>
            <img src={noproduct} alt='' className='w-24 h-24' />
            <span className='text-gray-400 text-sm capitalize mt-4'>giỏ hàng của bạn trống</span>
            <Link to={path.home} className='bg-pink px-8 py-2 mt-4 text-gray-500 hover:bg-pink/90 uppercase'>
              mua hàng
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
