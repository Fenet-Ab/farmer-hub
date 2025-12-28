import React from 'react'
import Orders from '../../pages/User/Orders.jsx'
import SupplierOrders from '../../pages/supplier/Orders.jsx'

const OrdersWrapper = () => {
  const role = localStorage.getItem('role')
  
  if (role === 'supplier') {
    return <SupplierOrders />
  }
  
  return <Orders />
}

export default OrdersWrapper

