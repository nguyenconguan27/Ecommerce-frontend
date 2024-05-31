import React, { useContext } from 'react'
import { AppContext } from 'src/context/app.context'

export default function Payment() {
  const { checkoutData } = useContext(AppContext)
  return <div>Payment</div>
}
