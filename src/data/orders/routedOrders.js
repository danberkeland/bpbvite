import { useMemo } from "react"
import { isoToDT } from "../../Pages/Production/NewPages/BPBN/utils"
import { getRouteOptions, useGetRouteOptionsByLocation } from "../routing/routeAssignment"
import { useCombinedOrdersByLocNickByDelivDate } from "./combinedOrders"




export const useRoutedOrdersByLocNickByDelivDate = ({
  locNick,
  delivDate
}) => {

  const combinedOrders = useCombinedOrdersByLocNickByDelivDate({
    locNick,
    delivDate
  })

  const getOptions = useGetRouteOptionsByLocation(locNick)

  if (!combinedOrders || !getOptions) return undefined

  const weekday = isoToDT(delivDate).toFormat('EEE')

  return combinedOrders.map(order => ({
    ...order,
    routeOptions: getOptions(order.prodNick, weekday)
  }))

}