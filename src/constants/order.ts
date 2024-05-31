export const receiptStatus = {
  CHECKEDOUT: 1,
  INSHIPPING: 2,
  RECEIVED: 3,
  CANCEL: 4
} as const

export const orderStatus = {
  INCART: 0,
  CHECKEDOUT: 1,
  REVIEWED: 2
}

export const paymentMethod = {
  ONLINE: 1,
  OFFLINE: 2
}
