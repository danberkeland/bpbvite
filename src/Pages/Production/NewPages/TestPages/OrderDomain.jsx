import React from "react"
import { getTodayDT } from "../BPBN/utils"
import { useCombinedOrdersByDelivDate, useCombinedOrdersByLoc } from "../../../../data/orders/combinedOrders"
import { useListData } from "../../../../data/_listData"
import { useRoutedOrdersByLocNickByDelivDate } from "../../../../data/orders/routedOrders"





export const OrderDomain = () => {

  const today = getTodayDT().toFormat('yyyy-MM-dd')
  // const combinedOrders = useCombinedOrdersByDelivDate({ delivDate: today })
  
  // const combinedOrders = useCombinedOrdersByLoc({ locNick: 'sotos' })
  // console.log(combinedOrders)

  // const { data:products } = useRoutedProducts({ locNick: 'slopro' })


  const routedOrders = useRoutedOrdersByLocNickByDelivDate({
    locNick: 'slopro',
    delivDate: today
  })

  console.log(routedOrders)
  
  return (
    <h1>Testing Orders</h1>
  )
}


