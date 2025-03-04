import { DateTime } from "luxon";
import { useOrdersByDelivDate } from "../order/useOrders.jsx";
import { useStandingsByDayOfWeek } from "../standing/useStandings.jsx";
import { useLocations } from "../location/useLocations.jsx";
import { useProducts } from "../product/useProducts.jsx";
import { useRoutes } from "../route/useRoutes.js";
import { useLoadedGetRouteOptions } from "../routing/useRouting.jsx";
// import { useLocationProductOverrides } from "../locationProductOverride/useLocationProductOverrides";
import { combineOrders } from "../../core/production/combineOrders.jsx";
// import { overrideProduct } from "../locationProductOverride/overrideProduct.js";
import { useMemo } from "react";
import { groupByObject, keyBy } from "../../utils/collectionFns.js";
import { useOverrideProduct } from "../locationProductOverride/useOverrideProduct.jsx";
import { DT } from "../../utils/dateTimeFns.js";
import { DBOrder, DBRoute } from "../types.d.jsx";
import { FulfillmentPlan } from "../../core/logistics/types.d.jsx";


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
 * @param {boolean} [input.shouldFetch=true]
 * @param {boolean} [input.useRetail=true] Option to include Retail Orders
 * @param {boolean} [input.useHolding=false] Option to include Holding Orders (e.g. for production calculations)
 * @param {boolean} [input.showCustom=false] Option to include the special product "Custom Order"
 * @param {boolean} [input.showRetailBrn=false] Option to include the placeholder brownie
 * @return {{ data: (undefined | CombinedRoutedOrder[]) }}
 */
const useCombinedRoutedOrdersByDate = ({ 
  delivDT, 
  shouldFetch=true,
  useRetail=true,
  useHolding=false,
  showCustom=false,
  showRetailBrn=false,
}) => {
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

    const _ORD = useRetail ? ORD : ORD.filter(ord => ord.isWhole === true)
    const _STD = useHolding ? STD : STD.filter(std => std.isStand === true)
    
    const combinedRoutedOrders = combineOrders(_ORD, _STD, [delivDate])
      .filter(order => 1 
        && (showCustom || !(order.prodNick === 'cust'))
        && (showRetailBrn || !(order.isWhole === false && order.locNick.includes('__') && order.prodNick === 'brn'))
      )
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