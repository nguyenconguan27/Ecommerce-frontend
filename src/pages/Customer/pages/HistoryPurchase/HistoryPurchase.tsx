import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Helmet } from 'react-helmet-async'
import { Link, createSearchParams } from 'react-router-dom'

import path from 'src/constants/path'
import { receiptStatus } from 'src/constants/order'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import { AppContext } from 'src/context/app.context'
import receiptApi from 'src/apis/receipt.api'
import Button from 'src/components/Button'

const purchaseTabs = [
  { status: receiptStatus.CHECKEDOUT, name: 'Chờ xác nhận' },
  { status: receiptStatus.INSHIPPING, name: 'Đang giao' },
  { status: receiptStatus.RECEIVED, name: 'Đã giao' },
  { status: receiptStatus.CANCEL, name: 'Đã hủy' }
]

export default function HistoryPurchase() {
  const params: { status?: string; checkout?: string } = useQueryParams()
  const status = Number(params.status) || receiptStatus.CHECKEDOUT
  var isCheckout = params.checkout === '1'
  const { profile } = useContext(AppContext)

  const { data: receiptData } = useQuery({
    queryKey: ['receipt', { status: status }],
    queryFn: () => receiptApi.getReceiptByUser(status, profile?.id as number)
  })

  console.log(receiptData)
  useEffect(() => {
    if (isCheckout) {
      toast.success('Đặt mua hàng thành công', {
        autoClose: 1000
      })
    }
  }, [])

  const purchaseTapLinks = purchaseTabs.map((tap) => (
    <Link
      key={tap.status}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({ status: String(tap.status) }).toString()
      }}
      className={classNames('text-center py-3 flex-1', {
        'text-pink2 border-b border-b-pink2': status === tap.status,
        'text-gray-600': status !== tap.status
      })}
    >
      {tap.name}
    </Link>
  ))

  return (
    <div>
      <title>Đơn mua | Shopee</title>
      <meta name='description' content='Đơn mua' />
      <div className='sticky top-0'>
        <div className='flex bg-white rounded-sm shadow-sm'>{purchaseTapLinks}</div>
        <div className=' bg-white rounded-sm shadow-sm mt-5'>
          {receiptData?.data.data.map((receipt) => {
            let amount = 0
            let save = 0
            return (
              <div className='border p-3'>
                {receipt.orderList?.map((order) => {
                  amount += order.quantity * order.price
                  save += order.quantity * (order.prePrice - order.price)
                  return (
                    <div
                      className={classNames('grid items-center justify-center mt-4', {
                        'grid-cols-5': receipt.status === receiptStatus.RECEIVED,
                        'grid-cols-4': receipt.status !== receiptStatus.RECEIVED
                      })}
                    >
                      <img src={order.product.imageList[0].fileName} alt='' className='w-28 h-28' />
                      <div>{order.product.title}</div>
                      <div className='text-center'>{order.size}</div>
                      <div className='text-center'>x{order.quantity}</div>
                      {receipt.status === receiptStatus.RECEIVED && (
                        <div className='col-span-1'>
                          <Button className='text-center px-3 py-2 rounded-sm uppercase bg-pink text-gray-600 text-sm flex-shrink-0 hover:bg-pink2 hover:text-white'>
                            Đánh giá
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
                <div className='flex justify-end items-center'>
                  {receipt.status !== receiptStatus.RECEIVED && (
                    <div className='mr-10'>
                      <div className='flex items-center justify-end'>
                        <div className='ml-2 text-xl text-pink2'>₫{formatCurrency(amount)}</div>
                      </div>
                      <div className='flex items-center text-sm justify-end'>
                        <div className='text-gray-500'> Tiết kiệm</div>
                        <div className='ml-2 text-sm text-pink2'>₫{formatCurrency(save)}</div>
                      </div>
                    </div>
                  )}

                  {receipt.status === receiptStatus.CHECKEDOUT && (
                    <div>
                      <Button className='text-center px-3 py-2 rounded-sm uppercase bg-pink text-gray-600 text-sm flex-shrink-0 hover:bg-pink2 hover:text-white'>
                        Huỷ đặt hàng
                      </Button>
                    </div>
                  )}
                  {receipt.status === receiptStatus.INSHIPPING && (
                    <div>
                      <Button className='text-center px-3 py-2 rounded-sm uppercase bg-pink text-gray-600 text-sm flex-shrink-0 hover:bg-pink2 hover:text-white'>
                        Đã nhận
                      </Button>
                    </div>
                  )}
                  {receipt.status === receiptStatus.CANCEL && (
                    <div>
                      <Button className='text-center px-3 py-2 rounded-sm uppercase bg-pink text-gray-600 text-sm flex-shrink-0 hover:bg-pink2 hover:text-white'>
                        Mua lại
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
