import React, { useState, useEffect } from "react";
import { useLogisticsDataByDate, useRouteGrid } from "../../data/productionData";

import { Calendar } from "primereact/calendar"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dropdown } from "primereact/dropdown"

import { dateToYyyymmdd } from "../../functions/dateAndTime";
import dynamicSort from "../../functions/dynamicSort";


function Production() {
  const [calendarDate, setCalendarDate] = useState(new Date())
  const delivDate = dateToYyyymmdd(calendarDate)

  const { dimensionData, routedOrderData } = useLogisticsDataByDate(calendarDate, !!calendarDate)

  const routeOptions = routedOrderData 
    ? [...new Set(routedOrderData.map(o => o.routeNick))]
      .map(r => ({routeNick: r}))
      .sort(dynamicSort("routeNick"))
    : []
  const [selectedRoute, setSelectedRoute] = useState("AM Pastry")

  const tableData = (routedOrderData && selectedRoute)
    ? makeGrid(routedOrderData, selectedRoute, dimensionData.locations)
    : null

  console.log(tableData)
  return(
    <div style={{padding: "1rem", marginBottom: "6rem"}}>
      <Calendar 
        touchUI={true}
        value={calendarDate}
        onChange={(e) => setCalendarDate(e.value)}
        readOnlyInput // prevent keyboard input of invalid date string
      />
      <Dropdown 
        options={routeOptions}
        optionLabel="routeNick"
        optionValue="routeNick"
        value={selectedRoute}
        onChange={e => setSelectedRoute(e.value)}

      />
      <DataTable
        value={tableData || []} 
        responsiveLayout

        showGridlines
        size="small"
      >
        <Column style={{width: "200px"}} header="Location" field="location.locName" />
        {!!tableData && 
          Object.keys(tableData[0].productQtys).map(prodNick => {
            return(
              <Column 
                // headerStyle={{transform: "rotate(300deg)"}} 
                bodyStyle={{textAlign: "center", width: "3rem"}}
                header={prodNick}
                key={prodNick} 
                field={`productQtys.${prodNick}`} 
              />
            )
          }
        )}
      </DataTable>
    </div>
  )

// }

  
}

export default Production;



const makeGrid = (orders, selectedRoute, locations) => {
  orders = orders.filter(item => item.routeNick === selectedRoute)

  const productList = 
    // [...new Set(orders.map(order => order.product.prodNick))]
    [...new Set(orders.map(order => order.prodNick))]

  const locationList = 
    // [...new Set(orders.map(order => order.location.locNick))]
    [...new Set(orders.map(order => order.locNick))]

  console.log(locationList, productList)

  let gridData = []
  for (let locNick of locationList) {
    // let ordersByLocation = orders.filter(item => item.location.locNick === locNick)
    let ordersByLocation = orders.filter(item => item.locNick === locNick)

    let productQtys = Object.fromEntries(
      // productList.map(prodNick => ([prodNick, ordersByLocation.find(order => order.product.prodNick === prodNick)?.qty || ""]))
      productList.map(prodNick => ([prodNick, ordersByLocation.find(order => order.prodNick === prodNick)?.qty || ""]))
    )

    let rowData = {
      location: locations[locNick],
      productQtys: productQtys
    }
    gridData.push(rowData)
  
  }

  gridData.sort((a,b) => {
    return a.location.delivOrder - b.location.delivOrder
  })
    
  return gridData
}