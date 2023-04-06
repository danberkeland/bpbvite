// Rustics to shape for tomorrow's bake
// Equal to rustics delivered on T+1 that can be baked same day
//    + rustics to be delivered on T+2 that need to be baked the day before.


import { DateTime } from "luxon";
import React from "react";
import { useOrderReportByDate } from "../../../data/productionData";
import { groupBy } from "../../../functions/groupBy"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column";
import { sumBy } from "lodash";

const REPORT_DATE = DateTime.now().setZone('America/Los_Angeles')

/** i.e. is a rustic bread shaped at the carlton */
const isCarltonRustic = (product) => {
  const { bakedWhere, packGroup } = product
  return (
    bakedWhere.includes("Carlton")
    && ["rustic breads", "retail"].includes(packGroup)
  )
}

const canBakeAndDeliverCarltonProductSameDay = (route) => {
  const { routeStart, RouteDepart, routeNick } = route

  return (
    (RouteDepart === "Carlton" || ["Pick up Carlton", "Pick up SLO"].includes(routeNick))
    || (RouteDepart === "Prado" && routeStart >= 8)
  )
}

export const WhoShape = () => {

  const { routedOrderData:T1ProdOrders } = useOrderReportByDate({
    delivDateJS: REPORT_DATE.plus({ days: 1 }).toJSDate(), 
    includeHolding: true, 
    shouldFetch: true 
  })
  const { routedOrderData:T2ProdOrders } = useOrderReportByDate({
    delivDateJS: REPORT_DATE.plus({ days: 2 }).toJSDate(), 
    includeHolding: true, 
    shouldFetch: true 
  })

  const T1WhoShapeItems = T1ProdOrders?.filter(order => 
    isCarltonRustic(order.product)
    && (canBakeAndDeliverCarltonProductSameDay(order.route) === true)
  ).map(order => ({...order, sameDay: String(canBakeAndDeliverCarltonProductSameDay(order.route)) })) ?? []

  const T2WhoShapeItems = T2ProdOrders?.filter(order =>
    isCarltonRustic(order.product)
    && (canBakeAndDeliverCarltonProductSameDay(order.route) === false)
  ).map(order => ({...order, sameDay: String(canBakeAndDeliverCarltonProductSameDay(order.route)) })) ?? []

  const whoShapeData = T1WhoShapeItems.concat(T2WhoShapeItems)
  
  const groupedWhoShapeData = Object.values(groupBy(whoShapeData, ['product.forBake'])).sort((grpA, grpB) => {
    let forBakeA = grpA[0].product.forBake
    let forBakeB = grpB[0].product.forBake
    return forBakeA > forBakeB ? -1
      : forBakeA < forBakeB ? 1
      : 0
  })

  return (<>
    <h1>{`Who Shape ${REPORT_DATE.toLocaleString()}`}</h1>

    {groupedWhoShapeData.length && groupedWhoShapeData.map((orderGroup, idx) => {
      const forBake = orderGroup[0].product.forBake
      const total = sumBy(orderGroup, order => order.qty)
      return(
        <div key={idx} style={{margin:"2rem"}}>
          <h2>{forBake}</h2>
          <DataTable value={orderGroup}
            size="small"
            footer={() => <span>{`Total: ${total}`}</span>}
            
          >
            <Column header="Customer" field="location.locName" />
            {/* <Column header="sameDay" field="sameDay" />
            <Column header="start" field="route.routeStart" />
            <Column header="depart" field="route.RouteDepart" /> */}
            <Column header="Qty" field="qty" />
          </DataTable>

        </div>
      )
    })}
    {/* <pre>{JSON.stringify(groupedWhoShapeData.length, null, 2)}</pre>
    <pre>{JSON.stringify(groupedWhoShapeData, null, 2)}</pre> */}
  </>)
}