import { useMemo } from "react"
import { DateTime } from "luxon"
import { assignDelivRoute } from "../../../../functions/routeFunctions/assignDelivRoute"
import { getWeekday } from "../../../../functions/dateAndTime"

import { useCombinedOrdersByDate } from "../../../../data/productionData"
import { useLogisticsDimensionData } from "../../../../data/productionData"

const TODAY = DateTime.now().setZone("America/Los_Angeles").startOf("day")
const LOCAL_STORAGE_KEY = "sevenDayOrders"

export const useT0T7orders = ({ shouldFetch, useLocal, manualRefresh }) => {

  const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
  const dataDate = localData ? DateTime.fromISO(localData.timestamp).startOf("day") : null

  const shouldUseLocal = useLocal
    && !manualRefresh
    && !!localData
    && dataDate.toMillis() === TODAY.toMillis()

  const { data:T0orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 0 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch && !shouldUseLocal
  })
  const { data:T1orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 1 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch && !shouldUseLocal
  })
  const { data:T2orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 2 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch && !shouldUseLocal
  })
  const { data:T3orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 3 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch && !shouldUseLocal
  })
  const { data:T4orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 4 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch && !shouldUseLocal
  })
  const { data:T5orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 5 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch && !shouldUseLocal
  })
  const { data:T6orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 6 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch && !shouldUseLocal
  })
  const { data:T7orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 7 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch && !shouldUseLocal
  })
  const { data:dimensionData } = useLogisticsDimensionData(
    shouldFetch && !shouldUseLocal
  )

  const allOrders = [T0orders, T1orders, T2orders, T3orders, T4orders, T5orders, T6orders, T7orders]
  //console.log("allOrders", allOrders)

  const transformData = () => {
    if (shouldUseLocal) {
      console.log("using local data")
      return localData
    }

    if (!shouldUseLocal && allOrders.every(item => !!item) && !!dimensionData) {
      const { locations, products, routes, routeMatrix } = dimensionData
      //console.log("dimensionData", dimensionData)

      const allRoutedOrders = allOrders.map((combinedOrders, relativeDateIdx) => {
        const dayOfWeek = getWeekday(TODAY.plus({ days: relativeDateIdx }).toJSDate())
        //console.log(relativeDateIdx, dayOfWeek)

        return combinedOrders.map(order => assignDelivRoute({
          order: order, 
          locationZoneNick: order.isWhole ? locations[order.locNick]?.zoneNick : order.route, 
          dayOfWeek : dayOfWeek, 
          routeMatrix: routeMatrix
        })) // end combinedOrders.map

      }) // end allOrders.map
      //console.log("allRoutedOrders", allRoutedOrders)

      const _orderData = {
        timestamp: new Date().toISOString(),
        dimensionData, 
        T0orders: allRoutedOrders[0], 
        T1orders: allRoutedOrders[1],  
        T2orders: allRoutedOrders[2], 
        T3orders: allRoutedOrders[3],  
        T4orders: allRoutedOrders[4], 
        T5orders: allRoutedOrders[5], 
        T6orders: allRoutedOrders[6], 
        T7orders: allRoutedOrders[7], 
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(_orderData))
      return _orderData

    } // end if

    return undefined
  }
  const _data = useMemo(transformData, [shouldUseLocal, allOrders, dimensionData, localData])

  return ({ data: _data })
}