import { DateTime } from "luxon";
import { useOrdersByDelivDate } from "../order/useOrders";
import { useStandingsByDayOfWeek } from "../standing/useStandings";
import { useLocations } from "../location/useLocations";
import { useProducts } from "../product/useProducts";
import { useRoutes } from "../route/useRoutes";
import { useLoadedGetRouteOptions } from "../routing/useRouting";
// import { useLocationProductOverrides } from "../locationProductOverride/useLocationProductOverrides";
import { combineOrders } from "../../core/production/combineOrders.js";
// import { overrideProduct } from "../locationProductOverride/overrideProduct.js";
import { useMemo } from "react";
import { groupByObject, keyBy } from "../../utils/collectionFns.js";
import { useOverrideProduct } from "../locationProductOverride/useOverrideProduct.js";
import { DT } from "../../utils/dateTimeFns.js";
import { DBOrder, DBRoute } from "../types.d.js";
import { FulfillmentPlan } from "../../core/logistics/types.d.js";


/**
 * @typedef {Object} CombinedOrderMeta
 * @property {string} routeNick
 * @property {FulfillmentPlan} routePlan
 * @property {DBRoute | undefined} route
 * @property {{ locName: string }} location
 */

/**
 * @typedef {DBOrder & { meta:CombinedOrderMeta }} 
*/
let CombinedRoutedOrder 

/**
 * @param {Object} input
 * @param {DateTime} input.delivDT 
 * @param {boolean} input.useHolding
 * @param {boolean} input.shouldFetch
 * @return {{ data: (undefined | CombinedRoutedOrder[]) }}
 */
const useCombinedRoutedOrdersByDate = ({ delivDT, useHolding=false, shouldFetch=true }) => {
  const delivDate = delivDT.toFormat('yyyy-MM-dd')
  const dayOfWeek = delivDT.toFormat('EEE')

  const { data:ORD } = useOrdersByDelivDate({ delivDate, shouldFetch })
  const { data:STD } = useStandingsByDayOfWeek({ dayOfWeek, shouldFetch })
  const { data:LOC } = useLocations({ shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch })
  const { data:RTE } = useRoutes({ shouldFetch })
  // const { data:OVR } = useLocationProductOverrides({ shouldFetch })

  const { 
    overrideProduct,
    overrideLocation,
  } = useOverrideProduct({ shouldFetch })
  const getRoutes = useLoadedGetRouteOptions({ shouldFetch })

  const calcRoutedOrders = () => {
    if (0
      || !ORD 
      || !STD 
      || !LOC 
      || !PRD 
      || !RTE 
      || !overrideProduct 
      || !overrideLocation
      || !getRoutes
    ) return undefined

    const locations = keyBy(LOC, L => L.locNick) // LOC.reduce(Data._keyBy(L => L.locNick), {})
    const products = keyBy(PRD, P => P.prodNick) // PRD.reduce(Data._keyBy(P => P.prodNick), {})

    const _STD = useHolding ? STD : STD.filter(std => std.isStand === true)
    
    const combinedRoutedOrders = combineOrders(ORD, _STD, [delivDate])
      .filter(order => order.prodNick !== 'cust')
      .map(order => {
        const location = order.isWhole
          ? locations[order.locNick]
          : {
              locNick: order.locNick,
              locName: order.locNick,
              zoneNick: order.route,
              latestFirstDeliv: 7,
              latestFinalDeliv: 11,
            }
        
        const routeOptions = getRoutes(
          overrideLocation(location, order.prodNick), 
          overrideProduct(products[order.prodNick], order.locNick), 
          dayOfWeek
        )
        const routePlan = routeOptions?.[order.route ?? 'deliv']?.[0]
        const datedRoutePlan = {
          ...routePlan,
          steps: routePlan.steps.map(step => ({
            ...step,
            begin: { ...step.begin, date: DT.fromIso(order.delivDate).plus({ days: step.begin.relDate }).toFormat('yyyy-MM-dd')},
            end:   { ...step.end,   date: DT.fromIso(order.delivDate).plus({ days: step.end.relDate }).toFormat('yyyy-MM-dd')},
          }))
        }
        

        const routeNick = routeOptions?.[order.route ?? 'deliv']?.[0]?.routeNick ?? "NOT ASSIGNED"
        const route = RTE.find(R => R.routeNick === routeNick)
        
        /** @type {CombinedRoutedOrder} */
        const combinedRoutedOrder = { 
          ...order, 
          meta: { 
            routeNick,
            routePlan: datedRoutePlan,
            route,
            location: {
              locName: location.locName.split("__")[0]
            }
          }
        }

        
        return combinedRoutedOrder
      })

    const { true:unassignedOrders, false:routedOrders=[] } = groupByObject(
      combinedRoutedOrders,
      order => !order.meta.route
    )
    if (!!unassignedOrders) {
      console.warn("Routes not assigned to the following: ", unassignedOrders)
    }
   
    return routedOrders
  }

  

  return { 
    data: useMemo(
      calcRoutedOrders, 
      [useHolding, delivDate, dayOfWeek, ORD, STD, LOC, PRD, RTE, overrideProduct, overrideLocation, getRoutes]
    )
  }

}

export {
  useCombinedRoutedOrdersByDate,
  CombinedRoutedOrder,
}