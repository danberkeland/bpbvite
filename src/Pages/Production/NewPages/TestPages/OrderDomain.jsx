import React from "react"
import { getTodayDT, isoToDT } from "../BPBN/utils"
import { useOrdersByLocNickByDelivDate } from "../../../../data/order/useOrders"
import { useStandingsByLocNickByDayOfWeek } from "../../../../data/standing/useStandings"
import { combineOrders } from "../../../../data/cartOrder/combineOrders"
import { useProducts } from "../../../../data/product/useProducts"
import { useLocation } from "../../../../data/location/useLocations.ts"
import { useLocationProductOverridesByLocNick } from "../../../../data/locationProductOverride/useLocationProductOverrides"
import { useLoadedGetRouteOptions } from "../../../../data/routing/useRouting"
import { overrideProduct } from "../../../../data/locationProductOverride/overrideProduct.js"
import { DateTime } from "luxon"

export const OrderDomain = () => {


  
  const todayDT = getTodayDT().plus({ days: 1 })
  const shouldFetch = true
  const locNick = 'lincoln'
  const delivDate = todayDT.toFormat('yyyy-MM-dd')
  const dayOfWeek = todayDT.toFormat('EEE')

  const foofoo = DateTime.fromFormat(delivDate, 'yyyy-MM-dd', { zone: 'America/Los_Angeles' }).weekday
  console.log('FOOFOO', foofoo)

  
  const { data:location } = useLocation({ locNick, shouldFetch })
  console.log("FETCHED LOCATION", location)

  const OVR = useLocationProductOverridesByLocNick({ locNick, shouldFetch })
  const overrides = 
    Object.fromEntries((OVR.data ?? []).map(ovr => [ovr.prodNick, ovr]))
  
  const PRD = useProducts({ shouldFetch })
  // const products = 
  //   Object.fromEntries((PRD.data ?? []).map(P => [P.prodNick, P]))

  const customProducts = Object.fromEntries(
    (PRD.data ?? []).map(P => 
      [P.prodNick, overrideProduct(P, overrides[P.prodNick])]
    )
  )

  const getOptions = useLoadedGetRouteOptions({ shouldFetch })


  const { data:orders } = 
    useOrdersByLocNickByDelivDate({
      shouldFetch,
      locNick,
      delivDate,
    })
  const { data:standing } = 
    useStandingsByLocNickByDayOfWeek({
      shouldFetch,
      locNick,
      dayOfWeek,
    })
  const combinedOrders = !!orders && !!standing
    ? combineOrders(
        /**@type {DBOrder[]}*/ orders, 
        /**@type {DBStanding[]}*/ standing,
        [delivDate]
      )
    : []
  console.log("orders", orders, standing, combinedOrders)

  const routedOrders = combinedOrders.map(order => {
    const orderProduct = customProducts[order.prodNick]
    console.log("PRODUCT", orderProduct)

    return {
      ...order,
      routeOptions: !!location && !!PRD.data && !!getOptions
        ? getOptions(
            location, 
            orderProduct, 
            isoToDT(order.delivDate).toFormat('EEE')  
          )
        : []
    }
  })

  // console.log(orders, standing)
  // console.log(combinedOrders)

  console.log("ROUTED ORDERS:", routedOrders)


  return (
    <h1>Testing Orders</h1>
  )
}
