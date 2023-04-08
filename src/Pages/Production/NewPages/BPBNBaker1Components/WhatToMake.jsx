import React from "react"

import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"

import { useOrderReportByDate } from "../../../../data/productionData"

import { groupBy } from "../../../../functions/groupBy"
import { sumBy } from "lodash"



// ****************
// * FILTER TESTS *
// ****************

/** Is a rustic bread shaped at the Carlton */
const isCarltonRustic = (product) => {
  const { bakedWhere, packGroup } = product
  return (
    bakedWhere.includes("Carlton")
    && ["rustic breads", "retail"].includes(packGroup)
  )
}

/** Assumes the route is associated with an order for a product baked at the Carlton */
const canBakeAndDeliverCarltonProductSameDay = (route) => {
  const { routeStart, RouteDepart, routeNick } = route

  return (
    (RouteDepart === "Carlton" || ["Pick up Carlton", "Pick up SLO"].includes(routeNick))
    || (RouteDepart === "Prado" && routeStart >= 8)
  )
}

/**Is a delivery route that starts and ends at the Carlton */
const isNorthRoute = (route) => {
  const { RouteDepart, RouteArrive } = route

  return RouteDepart === 'Carlton' 
    && RouteArrive === 'Carlton'
}

const isNotCarltonPickup = (location, fulfillment) => {
  const { zoneNick } = location

  return zoneNick !== "Carlton Retail"
    && zoneNick !== 'atownpick'
    && fulfillment !== 'atownpick' // <<< this condition not in original test?
}



// *************
// * COMPONENT *
// *************

export const WhatToMake = ({ reportDate }) => {
  const { routedOrderData:T0orders } = useOrderReportByDate({
    delivDateJS: reportDate.plus({ days: 0 }).toJSDate(), 
    includeHolding: false, 
    shouldFetch: true 
  })

  const { routedOrderData:T1orders } = useOrderReportByDate({
    delivDateJS: reportDate.plus({ days: 1 }).toJSDate(), 
    includeHolding: false, 
    shouldFetch: true 
  })

  const T0ordersToBake = T0orders?.filter(order => {
    //console.log(order)
    return (
      isCarltonRustic(order.product)
      && canBakeAndDeliverCarltonProductSameDay(order.route)
    )
  }) ?? []
  const T1ordersToBake = T1orders?.filter(order =>
    isCarltonRustic(order.product)
    && !canBakeAndDeliverCarltonProductSameDay(order.route)
  ) ?? []
  
  const bakeList = T0ordersToBake.concat(T1ordersToBake)
  const GroupedBakeList = Object.values(groupBy(bakeList, ['product.forBake']))
    .sort((grpA, grpB) => {
      let forBakeA = grpA[0].product.forBake
      let forBakeB = grpB[0].product.forBake
      return forBakeA > forBakeB ? -1
        : forBakeA < forBakeB ? 1
        : 0
    })

  const bakeTotals = GroupedBakeList.map(productGroup => {
    const bakeQty = sumBy(productGroup, order => order.qty * order.product.packSize)

    // the following targets one of potentially several products belonging to 
    // a forBake category -- do all products in the category get assigned the
    // same preshaped qty?
    const pocketCount = productGroup[0].product.preshaped
    const surplus = pocketCount - bakeQty
    const shortText = surplus > 0 ? `Over ${surplus}`
      : surplus < 0 ? `Short ${surplus * -1}`
      : ''

    const ordersNeededEarly = productGroup.filter(order => {
      const { route, location, fulfillment } = order

      return isNorthRoute(route) && isNotCarltonPickup(location, fulfillment) 
    })
    const qtyNeededEarly = sumBy(ordersNeededEarly, order => order.qty * order.product.packSize)

    return({
      forBake: productGroup[0].product.forBake,
      qty: bakeQty,
      shaped: pocketCount,
      shortText: shortText,
      needEarly: qtyNeededEarly
    })
  })

  return (<>
    <h2>{`What to Bake ${reportDate.toLocaleString()}`}</h2>

    <DataTable 
      value={bakeTotals}
      size="small"
    >
      <Column header="Product" field="forBake"/>
      <Column header="Qty" field="qty"/>
      <Column header="Shaped" field="shaped"/>
      <Column header="Short" field="shortText"/>
      <Column header="Need Early" field="needEarly"/>
    </DataTable>
  </>)

}