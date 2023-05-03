import React, { useMemo } from "react"
import dynamicSort from "../../../functions/dynamicSort"
import { groupBy } from "lodash"
import { DateTime } from "luxon"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { sumBy } from "lodash"

import { set } from "lodash"
import { sum } from "lodash"
import { flattenDeep } from "lodash"
import { useT0T7orders } from "./_hooks/dataHooks"

const TODAY = DateTime.now().setZone("America/Los_Angeles").startOf("day")

export const CroixToMake = () => {
  const { data:T0T7data } = useT0T7orders({ 
    shouldFetch: true, 
    useLocal: true 
  })

  const composeData = () => {
    if (!T0T7data) return undefined

    const { timestamp, dimensionData } = T0T7data

    const T0T7array = [0, 1, 2, 3, 4, 5, 6, 7]
      .map(N => T0T7data[`T${N}orders`])

    // ***************************************
    // * Get Qtys Pulled From Freezer By Day *
    // ***************************************

    // the final data structure will preserve the sources 
    // of qtys pulled, eg for north/south setout or
    // for a frozen croix delivery

    let pradoSetouts = []
    for (let dayIdx = 0; dayIdx < 5; dayIdx++) {
      const setoutTotals = countSetout({ 
        prodLocation: "Prado", 
        dimensionData,
        T1T3orders: T0T7array.slice(dayIdx + 1, dayIdx + 4), // setout count for a given date (T+0) comes from T+1 to T+3 orders
        relativeDate: "T" + dayIdx,
      })
      pradoSetouts = pradoSetouts.concat(setoutTotals)
    }

    let carltonSetouts = []
    for (let dayIdx = 0; dayIdx < 5; dayIdx++) {
      const setoutTotals = countSetout({ 
        prodLocation: "Carlton", 
        dimensionData,
        T1T3orders: T0T7array.slice(dayIdx + 1, dayIdx + 4),
        relativeDate: "T" + dayIdx,
      })
      
      carltonSetouts = carltonSetouts.concat(setoutTotals)
    }

    let frozenDeliveries = []
    for (let dayIdx = 0; dayIdx < 5; dayIdx++) {
      const frCroixTotals = countFrCroix({ 
        orders: T0T7array[dayIdx],
        products: dimensionData.products,
        relativeDate: "T" + dayIdx,
      })
      
      frozenDeliveries = frozenDeliveries.concat(frCroixTotals)
    }

    // Adding relative-date and type attributes to items let us concatenate
    // all data as a flat list, then construct any hierarchies we like.
    // we use lodash's groupBy, set, and sum functions.
    const pullList = pradoSetouts.concat(carltonSetouts).concat(frozenDeliveries)
  
    // get smallest "chunks". We insert 'pull' as a nested attribute so that we can later
    // add 'stock' and 'make' data under T0 while grouping it separately. 
    const _byCompoundKey = groupBy(pullList, item => `${item.prodNick}#${item.relativeDate}#pull#${item.type}`)

    // compound keys imply a nesting structure;
    // categorical data gets emdedded as attribute names -- we only need qty as the value
    const nestedData = {}
    for (let key in _byCompoundKey) {
      const originalValue = _byCompoundKey[key]
      set(nestedData, key.split('#'), originalValue[0].qty * -1)
    }

    // "flatten the top" to make rows for each prodNick
    const pullData = Object.keys(nestedData).map(key => ({
      prodNick: key,
      ...nestedData[key]
    }))

    // *************************
    // * Get opening/make qtys *
    // *************************

    // These qtys are just product attributes. 
    // freezerCount represents the start of day qty
    // sheetMake is multiplied by batchSize to get the qty shaped
    // the end of day count is a total of 
    //    freezerCount + (sheetMake * batchSize) - <Qty Pulled>
    // where qty pulled is calculated for T0 in the previous section.

    const { products } = dimensionData

    const projection = pullData.map(rowData => {
      const { prodNick, T0 } = rowData
      const { freezerCount, sheetMake, batchSize } = products[prodNick]
      const makeTotal = batchSize * (sheetMake ?? 0)

      return({
        ...rowData,
        T0: {
          ...T0,
          stock: { freezerCount: freezerCount ?? 0 },
          make: { total: makeTotal}
        }
      })
    })
    return projection.sort(dynamicSort("prodNick"))

  }

  const tableData = useMemo(composeData, [T0T7data])
  console.log("tableData", tableData)



  return(
    <div>
      <h1>{`Croissant Production ${TODAY.toLocaleString()}`}</h1>

      <Button label="Print Croix Shape List" />

      <DataTable value={tableData}>
        <Column header="Product" field="prodNick" />
        <Column header="freezerCount" field="T0.stock.freezerCount" />
        <Column header="Σ T+0" body={rowData => cumulativeColumnTemplate(rowData, 0)} />
        <Column header="Σ T+1" body={rowData => cumulativeColumnTemplate(rowData, 1)} />
        <Column header="Σ T+2" body={rowData => cumulativeColumnTemplate(rowData, 2)} />
        <Column header="Σ T+3" body={rowData => cumulativeColumnTemplate(rowData, 3)} />
        <Column header="Σ T+4" body={rowData => cumulativeColumnTemplate(rowData, 4)} />
      </DataTable>
    </div>
  )
}



// *********************
// * Compose Functions *
// *********************

const countSetout = ({ prodLocation, dimensionData, T1T3orders, relativeDate }) => {
  const { products, routes } = dimensionData
  const [T1prodOrders, T2prodOrders, T3prodOrders] = T1T3orders

  // ***Counts for both Prado and Carlton***

  // only need to look at production orders for tomorrow. That is,
  //   we only bake and deliver same day.
  const T0setoutOrders = T1prodOrders.filter(order => {
    const { locNick, prodNick, routeNick } = order
    const { packGroup, doughNick } = products[prodNick]
    const { RouteDepart } = routes[routeNick] ?? { RouteDepart: null } // fallback for "NOT ASSIGNED" cases

    const pickupAtLocation = 
      (prodLocation === "Prado" && routeNick === "Pick up SLO")
      || (prodLocation === "Carlton" && routeNick=== "Pick up Carlton")

    return (
      RouteDepart === prodLocation 
      || pickupAtLocation 
      || locNick === "backporch"
    ) && (
      locNick !== "bpbextras"
      && prodNick !== "al"
      && packGroup === "baked pastries"
      && doughNick === "Croissant"
    )

  }).map(order => order.locNick === "backporch" 
      ? { ...order, qty: Math.ceil(order.qty/2) }
      : order

  ).map(order => order.prodNick === "unmb" // need to count unmb and mb together as mb
    ? { ...order, prodNick: "mb" }
    : order
  )

  const T0setoutOrdersByProduct = Object.values(
    groupBy(T0setoutOrders, order => order.prodNick)
  )
  const T0setoutTotals = T0setoutOrdersByProduct.map(group => {
    return ({
      prodNick: group[0].prodNick,
      qty: sumBy(group, order => order.qty),
      relativeDate,
      type: "setout" + prodLocation
    })
  })

  // ***Counts for Prado only***
  // pl setout on T0 to prep for al/fral orders on t2 or t3
  
  let T0pradoTotals
  if (prodLocation === "Prado") {
    // all fral orders have a 2 day lead time
    const T2fralOrders = T2prodOrders.filter(order => 
      order.prodNick === "fral" && order.locNick !=="bpbextras"
    )
    .map(order => order.locNick === "backporch" 
      ? { ...order, qty: Math.ceil(order.qty / 2) }
      : order
    )

    // al orders fulfilled from the Prado hub have a 2 day lead
    const T2alOrdersPrado = T2prodOrders.filter(order => {
      const { locNick, prodNick, routeNick } = order
      const { RouteDepart } = routes[routeNick] || { RouteDepart: null }

      return (RouteDepart === "Prado" || locNick === "backporch")
        && prodNick === "al" && locNick !=="bpbextras"
    
    })
    .map(order => order.locNick === "backporch" 
      ? { ...order, qty: Math.ceil(order.qty / 2) }
      : order
    )

    // al orders fulfilled from the Carlton hub have a 3 day lead
    const T3alOrdersCarlton = T3prodOrders.filter(order => {
      const { locNick, prodNick, routeNick } = order
      const { RouteDepart } = routes[routeNick] || { RouteDepart: null }

      return (RouteDepart === "Carlton" || locNick === "backporch")
        && prodNick === "al" && locNick !=="bpbextras"
    
    })
    .map(order => order.locNick === "backporch" 
      ? { ...order, qty: Math.ceil(order.qty / 2) }
      : order
    )
    
    const totalPlainSetoutForAlmonds = sumBy(
      T2fralOrders.concat(T2alOrdersPrado).concat(T3alOrdersCarlton),
      order => order.qty
    )

    T0pradoTotals = T0setoutTotals.map(item => item.prodNick === "pl"
      ? { ...item, qty: (item.qty + totalPlainSetoutForAlmonds)}
      : item
    )
  }

  return prodLocation === "Prado" ? T0pradoTotals : T0setoutTotals
}

const countFrCroix = ({ orders, products, relativeDate }) => {
  // filter to frozen products
  const frCroixOrders = orders.filter(order => {
    const { packGroup, doughNick } = products[order.prodNick]
    return order.prodNick.startsWith("fr") // making a new rule!
      && doughNick === "Croissant"
      && packGroup === "frozen pastries" 
      && order.prodNick !== "fral"
  })

  // group by prodNick
  const frCroixGroups = Object.values(
    groupBy(frCroixOrders, order => order.prodNick)
  )

  // get total; map frozen item's prodNick to its baked equivalent. We are 
  // following an implicit rule that the prodNicks of the frozen and baked
  // items are the same, except the frozen item is prefixed with "fr". Thus,
  // ex: mb and frmb for morning bun and frozen morning bun.
  const frCroixTotals = frCroixGroups.map(group => {
    const total = sumBy(group, order => order.qty)
    return ({
      prodNick: group[0].prodNick.slice(2), // remove the "fr"
      qty: total,
      relativeDate,
      type: "frozenDeliv"
    })
  })

  return frCroixTotals

}

// ***********************
// * Component Templates *
// ***********************

const cumulativeColumnTemplate = (rowData, dayIdx) => {
  const byRelDate = ['T0', 'T1', 'T2', 'T3', 'T4']
    .map(TN => rowData[TN])
    .slice(0, dayIdx + 1)

  // break down the nested structure and sum on qty values.
  // 'byRelDate' ('TN' attributes) have 'type' object-values.
  // 'type' ('make/pull/stock' attributes) have 'qtyItem' object values.
  // 'qtyItems' are simple key/value pairs with
  // 'frozenDeliv/setoutPrado/setoutCarlton' attributes and qty values.
  //
  // These qtys are what we're ultimately after and want to sum up.
  const qtys = flattenDeep(Object.values(byRelDate).map(type => 
    Object.values(type).map(qtyItem => 
      Object.values(qtyItem)
    )
  ))

  return sum(qtys)
}