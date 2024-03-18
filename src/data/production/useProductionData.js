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
import { keyBy } from "../../utils/collectionFns.js";
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
 * @return {{ data: (undefined | CombinedRoutedOrder[]) }}
 */
const useCombinedRoutedOrdersByDate = ({ delivDT, useHolding=false }) => {
  const delivDate = delivDT.toFormat('yyyy-MM-dd')
  const dayOfWeek = delivDT.toFormat('EEE')
  const shouldFetch = true

  const { data:ORD } = useOrdersByDelivDate({ delivDate, shouldFetch })
  const { data:STD } = useStandingsByDayOfWeek({ dayOfWeek, shouldFetch })
  const { data:LOC } = useLocations({ shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch })
  const { data:RTE } = useRoutes({ shouldFetch })
  // const { data:OVR } = useLocationProductOverrides({ shouldFetch })
  const overrideProduct = useOverrideProduct({ shouldFetch })
  const getRoutes = useLoadedGetRouteOptions({ shouldFetch })

  const calcRoutedOrders = () => {
    if (0
      || !ORD 
      || !STD 
      || !LOC 
      || !PRD 
      || !RTE 
      || !overrideProduct 
      || !getRoutes
    ) return undefined

    const locations = keyBy(LOC, L => L.locNick) // LOC.reduce(Data._keyBy(L => L.locNick), {})
    const products = keyBy(PRD, P => P.prodNick) // PRD.reduce(Data._keyBy(P => P.prodNick), {})

    const _STD = useHolding ? STD : STD.filter(std => std.isStand === true)

    // const splitBackporchCroixOrders = order => {
    //   const shouldSplit = order.locNick === 'backporch' 
    //     && products[order.prodNick].packGroup === 'baked pastries'
    //     && products[order.prodNick].doughNick === 'Croissant'

    //   return shouldSplit
    //     ? [
    //         { ...order, qty: Math.ceil(order.qty / 2), route: 'slopick' },
    //         { ...order, qty: Math.ceil(order.qty / 2), route: 'atownpick' },
    //       ]
    //     : order
    // }

    
    const combinedRoutedOrders = combineOrders(ORD, _STD)
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
        // const product = products[order.prodNick]
        // const override = OVR.find(ovr => 
        //   ovr.locNick === location.locNick && ovr.prodNick === product.prodNick
        // )
        // const customizedProduct = overrideProduct(product, override)
        // const customizedProduct = overrideProduct(product, order.locNick)
        
        const routeOptions = getRoutes(
          location, 
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
   
    return combinedRoutedOrders
  }

  return { 
    data: useMemo(
      calcRoutedOrders, 
      [ORD, STD, LOC, PRD, RTE, overrideProduct, getRoutes]
    )
  }

}

export {
  useCombinedRoutedOrdersByDate,
  CombinedRoutedOrder,
}