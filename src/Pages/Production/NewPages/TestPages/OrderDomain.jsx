import React from "react"
import { getTodayDT } from "../BPBN/utils"
import { useCombinedOrdersByLoc } from "../../../../data/orders/combinedOrders"
import { useRoutedOrdersByLocNick } from "../../../../data/orders/routedOrders"





export const OrderDomain = () => {

  const today = getTodayDT().toFormat('yyyy-MM-dd')
  // const combinedOrders = useCombinedOrdersByDelivDate({ delivDate: today })
  
  // const combinedOrders = useCombinedOrdersByLoc({ locNick: 'sotos' })
  // console.log(combinedOrders)

  // const { data:products } = useRoutedProducts({ locNick: 'slopro' })


  const routedOrders = useRoutedOrdersByLocNick({
    locNick: 'backporch',
    shouldFetch: true
  })

  console.log(routedOrders)
  
  return (
    <h1>Testing Orders</h1>
  )
}


