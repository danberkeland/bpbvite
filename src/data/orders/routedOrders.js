import { useMemo } from "react"
import { isoToDT } from "../../Pages/Production/NewPages/BPBN/utils"
import { getRouteOptions, useGetRouteOptionsByLocation } from "../routing/routeAssignment"
import { useCombinedOrdersByLoc } from "./combinedOrders"

const weekdayMap = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}
// const dayOfWeeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']


export const useRoutedOrdersByLocNick = ({
  locNick,
}) => {

  const [combinedOrders, duplicateOrders] = useCombinedOrdersByLoc({
    locNick,
    shouldFetch: true
  }) ?? []

  // function is "loaded" with location/route/zoneRoute data
  const getOptions = useGetRouteOptionsByLocation(locNick)

  const calculateValue = () => {
    if (!combinedOrders || !getOptions) return undefined

    return combinedOrders.map(order => {
      const routeOptions = 
        getOptions(order.prodNick, weekdayMap[order.dayOfWeek])
    
      const selectedOption = 
        order.route === 'deliv' ? routeOptions?.deliv[0]
          : order.route === 'slopick' ? routeOptions?.['Pick up SLO']?.routeNick
          : routeOptions?.['Pick up Carlton']

      const assignedRoute = (!selectedOption || !!selectedOption.error)
        ? 'NOT ASSIGNED'
        : selectedOption.routeNick

      return { 
        ...order, 
        assignedRoute, 
        routeOptions 
      }
    })

  }

  console.log("combinedOrders", combinedOrders)

  return useMemo(calculateValue, [combinedOrders, getOptions])


}