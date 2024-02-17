import { useMemo } from "react";
import { combineOrders } from "../../../../data/cartOrder/combineOrders";
import { useLocations } from "../../../../data/location/useLocations.ts";
import { useOrdersByDelivDate } from "../../../../data/order/useOrders";
import { useProducts } from "../../../../data/product/useProducts";
import { useLoadedGetRouteOptions } from "../../../../data/routing/useRouting";
import { useStandingsByDayOfWeek } from "../../../../data/standing/useStandings";
import { Data } from "../../../../utils/dataFns";
import { DT } from "../../../../utils/dateTimeFns";
import { DateTime } from "luxon";
import { DBLocation, DBProduct } from "../../../../data/types.d.js";
import { useRoutes } from "../../../../data/route/useRoutes.js";

// These equivalences cannot be queried directly from DB records;
// better to hard code the values for now.

/** maps ProdNicks to the forBake of some representative product */
const croissantShapeTypeMap = {
  al: "Almond",
  fral: "Almond",
  ch: "ch",
  frch: "ch",
  pg: "pg",
  frpg: "frpg",
  mb: "mb",
  unmb: "mb",
  frmb: "mb",
  pl: "pl",
  frpl: "pl",
  sf: "sf",
  frsf: "sf",
  mini: "mini",
  frmni: "mini",
}
const croissantRowKeys = ["Almond", "ch", "pg", "mb", "pl", "sf", "mini"]


const useCombinedRoutedOrdersByDate = ({ delivDT }) => {
  const delivDate = delivDT.toFormat('yyyy-MM-dd')
  const dayOfWeek = delivDT.toFormat('EEE')
  const shouldFetch = true

  const { data:ORD } = useOrdersByDelivDate({ delivDate, shouldFetch })
  const { data:STD } = useStandingsByDayOfWeek({ dayOfWeek, shouldFetch })
  const { data:LOC } = useLocations({ shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch })
  const { data:RTE } = useRoutes({ shouldFetch })
  const getRoutes = useLoadedGetRouteOptions({ shouldFetch })

  const calcRoutedOrders = () => {
    if (!ORD || !STD || !LOC || !PRD || !RTE || !getRoutes) return []

    const locations = LOC.reduce(Data._keyBy(L => L.locNick), {})
    const products = PRD.reduce(Data._keyBy(P => P.prodNick), {})

    console.log(STD)
    const combinedOrders = combineOrders(
      ORD, 
      STD.filter(std => std.isStand === true)
    )

    const routedOrders = combinedOrders.map(order => {
      const location = order.isWhole
        ? locations[order.locNick]
        : {
            locNick: order.locNick,
            locName: order.locNick,
            zoneNick: order.route,
            latestFirstDeliv: 7,
            latestFinalDeliv: 11,
          }
      const product = products[order.prodNick]
      const routeOptions = getRoutes(location, product, dayOfWeek)
      const routePlan = routeOptions?.[order.route]?.[0]
      const routeNick = routeOptions?.[order.route]?.[0]?.routeNick ?? "NOT ASSIGNED"
      const route = RTE.find(R => R.routeNick === routeNick)
      return { 
        ...order, 
        meta: { 
          routePlan,
          routeNick,
          route,
          location: {
            locName: location.locName.split("__")[0]
          }
        }
      }

    })
   
    return routedOrders
  }

  return { data: useMemo(calcRoutedOrders, [ORD, STD, LOC, PRD, RTE, getRoutes])}

}

/**
 * 
 * @param {Object} input
 * @param {DateTime} input.delivDT
 * @returns 
 */
const useNorthListData = ({
  delivDT
}) => {
  const { data:LOC } = useLocations({ shouldFetch: true })
  const { data:PRD } = useProducts({ shouldFetch: true })

  const { data:T0Orders } = useCombinedRoutedOrdersByDate({ delivDT: delivDT })
  const { data:T1Orders } = useCombinedRoutedOrdersByDate({ delivDT: delivDT.plus({ days: 1 })})

  console.log("foo")
  const calcNorthLists = () => {
    if (!LOC || !PRD || !T0Orders || !T1Orders) return []

    /** @type {Object<string, DBLocation>} */
    const locations = LOC.reduce(Data._keyBy(L => L.locNick), {})

    /** @type {Object<string, DBProduct>} */
    const products = PRD.reduce(Data._keyBy(P => P.prodNick), {})

    const sortedProducts = PRD.sort(Data.compareBy(P => P.prodName))

    // ***** Croissant List *****
    console.log("T0Orders", T0Orders)
    // IMPORTANT rule: product list must be sorted (ascending) 
    // by prodName when we find by forBake
    const freezerNorthInventory = croissantRowKeys.map(forBake => {
      const productRep = sortedProducts.find(P => P.forBake === forBake)

      return {
        rowKey: forBake,
        prodNick: productRep?.prodNick ?? "",
        qty: productRep?.freezerNorth ?? 0
      }
    })
    console.log(freezerNorthInventory)

    const T0Frozen = T0Orders.filter(order => {
      const product = products[order.prodNick]
      const route = order.meta.route

      return product.packGroup === "frozen pastries" 
        && product.doughNick === "Croissant"
        && product.bakedWhere.length > 1
        && !!route && route.RouteDepart === "Carlton"

    })
    console.log("T0Frozen", T0Frozen)

    console.log("T1Orders", T1Orders)
    const T1Baked = T1Orders
      .filter(order => {
        const product = products[order.prodNick]
        const route = order.meta.route

        return product.packGroup === "baked pastries"
          && product.doughNick === "Croissant"
          && product.bakedWhere.length > 1
          && !!route && route.RouteDepart === "Carlton"

      })
      .map(order => order.prodNick === 'backporch'
        ? { ...order, qty: Math.ceil(order.qty/2) }
        : order
      )
    console.log("T1Baked", T1Baked)

    const frozensNeededbuckets = [...T0Frozen, ...T1Baked]
      .reduce(Data._bucketBy(order => croissantShapeTypeMap[order.prodNick]), [])

      console.log("frozensNeededbuckets", frozensNeededbuckets )

    const frozensNeeded = frozensNeededbuckets.map(shapeTypeGroup => {
        const rowKey = croissantShapeTypeMap[shapeTypeGroup[0].prodNick]
        const qty = shapeTypeGroup.reduce(Data._sumBy(order => 
          order.qty * products[order.prodNick].packSize), 0
        )

        return { rowKey, qty, items: shapeTypeGroup }

      })

    console.log("frozensNeeded", frozensNeeded)
  
  }

  return { data: useMemo(calcNorthLists, [LOC, PRD, T0Orders, T1Orders])}

}

export { useNorthListData }
