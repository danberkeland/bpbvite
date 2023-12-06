import React from "react"
import { getTodayDT } from "../BPBN/utils"
import { useCombinedOrdersByDelivDate, useCombinedOrdersByLoc } from "../../../../data/orders/combinedOrders"





export const OrderDomain = () => {

  const today = getTodayDT().toFormat('yyyy-MM-dd')
  // const combinedOrders = useCombinedOrdersByDelivDate({ delivDate: today })
  const combinedOrders = useCombinedOrdersByLoc({ locNick: 'sotos' })
  
  console.log(combinedOrders)
  
  return (
    <h1>Testing Orders</h1>
  )
}