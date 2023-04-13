import { sumBy } from "lodash";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";

import { useOrderReportByDate } from "../../../../data/productionData"
import { groupBy } from "../../../../functions/groupBy";



// ****************
// * FILTER TESTS *
// ****************

/**
 * Would it make more sense to give these products a category we can look for,
 * so that we don't have to obtain them by excluding everything else?
 */


const isExclusiveCarltonItem = (product) => {
  return product.bakedWhere.includes("Carlton") 
    && product.bakedWhere.length === 1
}

const isNonexclusiveCarltonItem = (product) => {
  return product.bakedWhere.includes("Carlton") 
    && product.bakedWhere.length > 1
}

const isPrepItem = (product) => {
  const { packGroup, doughNick } = product

  return packGroup !== "rustic breads"
    && doughNick !== "Croissant"
    && packGroup !== "retail"
    && packGroup !== "cafe menu"
}

const isFulfilledFromCarlton = (route) => {
  return route.RouteDepart === "Carlton" || route.routeNick === "Pick up Carlton"
}


export const WhatToPrep = ({ reportDate }) => {

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

  const T0ordersToPrep = T0orders?.filter(order => {
    const { product, route } = order

    return product.readyTime < 14 && isPrepItem(product) && (
      (isNonexclusiveCarltonItem(product) && isFulfilledFromCarlton(route))
      || isExclusiveCarltonItem(product)
    )

  }) ?? []

  const T1ordersToPrep = T1orders?.filter(order => {
    const { product, route } = order

    return product.readyTime > 14 && isPrepItem(product) && (
      (isNonexclusiveCarltonItem(product) && isFulfilledFromCarlton(route))
      || isExclusiveCarltonItem(product)
    )

  }) ?? []

  const ordersToPrep = T0ordersToPrep.concat(T1ordersToPrep)
  const ordersToPrepByProdName = Object.values(groupBy(ordersToPrep, ['prodNick']))

  const prepTotals = ordersToPrepByProdName.map(productGroup => {
    const totalQty = sumBy(productGroup, order => order.qty * order.product.packSize)

    return({
      prodName: productGroup[0].product.prodName,
      qty: totalQty
    })

  })

  return (<>
    <h2>{`What to Prep ${reportDate.toLocaleString()}`}</h2>

    <DataTable 
      value={prepTotals}
      size="small"
    >
      <Column header="Product" field="prodName"/>
      <Column header="Qty" field="qty"/>
    </DataTable>
  </>)
}