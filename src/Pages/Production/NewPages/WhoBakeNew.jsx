import React from "react";
import { DateTime } from "luxon";
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



export const WhoBake = () => {
  const { routedOrderData:T0ProdOrders } = useOrderReportByDate({
    delivDateJS: REPORT_DATE.plus({ days: 0 }).toJSDate(), 
    includeHolding: true, 
    shouldFetch: true 
  })
  const { routedOrderData:T1ProdOrders } = useOrderReportByDate({
    delivDateJS: REPORT_DATE.plus({ days: 1 }).toJSDate(), 
    includeHolding: true, 
    shouldFetch: true 
  })

  const T0WhoBakeItems = T0ProdOrders?.filter(order =>
    isCarltonRustic(order.product)
    && (canBakeAndDeliverCarltonProductSameDay(order.route) === true)  
  ) ?? []
  const T1WhoBakeItems = T1ProdOrders?.filter(order =>
    isCarltonRustic(order.product)
    && (canBakeAndDeliverCarltonProductSameDay(order.route) === false)  
  ) ?? []
  const whoBakeData = T0WhoBakeItems.concat(T1WhoBakeItems)
  
  const groupedWhoBakeData = Object.values(groupBy(whoBakeData, ['product.forBake'])).sort((grpA, grpB) => {
    let forBakeA = grpA[0].product.forBake
    let forBakeB = grpB[0].product.forBake
    return forBakeA > forBakeB ? -1
      : forBakeA < forBakeB ? 1
      : 0
  })

  return (<>
    <h1>{`Who Bake ${REPORT_DATE.toLocaleString()}`}</h1>

    {groupedWhoBakeData.length && groupedWhoBakeData.map((orderGroup, idx) => {
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
            <Column header="Qty" field="qty" />
          </DataTable>

        </div>
      )
    })}
  </>)
}