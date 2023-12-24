import { useMemo } from "react"
import { isoToDT } from "../../Pages/Production/NewPages/BPBN/utils"
import { getRouteOptions, useGetRouteOptionsByLocation } from "../routing/routeAssignment"
import { useCombinedOrdersByLoc } from "./combinedOrders"




// export const useRoutedOrdersByLocNickByDelivDate = ({
//   locNick,
//   delivDate
// }) => {

//   const combinedOrders = useCombinedOrdersByLocNickByDelivDate({
//     locNick,
//     delivDate,
//     shouldFetch: true
//   })

//   const getOptions = useGetRouteOptionsByLocation(locNick)

//   if (!combinedOrders || !getOptions) return undefined

//   console.log("combinedOrders", combinedOrders)

//   const weekday = isoToDT(delivDate).toFormat('EEE')

//   return combinedOrders.map(order => ({
//     ...order,
//     routeOptions: getOptions(order.prodNick, weekday)
//   }))

// }

const weekdayMap = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}
const dayOfWeeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']


export const useRoutedOrdersByLocNick = ({
  locNick,
}) => {

  const combinedOrders = useCombinedOrdersByLoc({
    locNick,
    shouldFetch: true
  })

  const getOptions = useGetRouteOptionsByLocation(locNick)

  const calculateValue = () => {
    if (!combinedOrders || !getOptions) return undefined

    return combinedOrders.map(order => ({
      ...order,
      routeOptions: getOptions(order.prodNick, weekdayMap[order.dayOfWeek])
    }))

  }

  console.log("combinedOrders", combinedOrders)

  return useMemo(calculateValue, [combinedOrders, getOptions])


}