import { DateTime } from "luxon"
import React, { useState, useEffect, useMemo } from "react"
import { useCombinedOrdersByDate, useLogisticsDimensionData } from "../../../data/productionData";

import { Button } from "primereact/button"
import TimeAgo from "timeago-react";
import { flatten, groupBy, sumBy } from "lodash";
import dynamicSort from "../../../functions/dynamicSort";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { dateToMmddyyyy } from "../../../functions/dateAndTime";


const TODAY = DateTime.now().setZone("America/Los_Angeles").startOf("day")
console.log(dateToMmddyyyy(TODAY.toJSDate()))
const LOCAL_STORAGE_KEY = "sevenDayOrders"

export const SevenDayList = () => {
  const [shouldFetch, setShouldFetch] = useState(false)
  const { data:T0orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 0 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch
  })
  const { data:T1orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 1 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch
  })
  const { data:T2orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 2 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch
  })
  const { data:T3orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 3 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch
  })
  const { data:T4orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 4 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch
  })
  const { data:T5orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 5 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch
  })
  const { data:T6orders } = useCombinedOrdersByDate({
    delivDateJS: TODAY.plus({ days: 6 }).toJSDate(),
    includeHolding: true,
    shouldFetch: shouldFetch
  })

  const { data:dimensionData } = useLogisticsDimensionData(shouldFetch)

  const [orderData, setOrderData] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
  )

  // if no localStorage, or if it's too old, fetch new data
  useEffect(() =>  {
    if (!orderData) { 
      console.log("no data, need to fetch")
    } else if (DateTime.fromISO(orderData.timestamp).startOf("day").toMillis() !== TODAY.toMillis()) {
      console.log("data is stale")
      setShouldFetch(true)
    } else {
      console.log("using locally stored data")
    }
  }, [orderData])

  console.log("T0", T0orders)
  // if data is fetched, save as state & localStorage
  useEffect(() => {
    if (T0orders && T1orders && T2orders && T3orders && T4orders && T5orders && T6orders && dimensionData) {
      console.log("fetched data")
      const _orderData = {
        timestamp: new Date().toISOString(),
        dimensionData,
        T0orders, T1orders, T2orders, T3orders, T4orders, T5orders, T6orders,
      }

      setOrderData(_orderData)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(_orderData));
    }
    
  }, [T0orders, T1orders, T2orders, T3orders, T4orders, T5orders, T6orders])

  const prepareData = () => {
    if (!orderData) return []

    const { timestamp, dimensionData, ...ordersByDate } = orderData
    const { products } = dimensionData
    
    const _withTimestamp = flatten(Object.values(ordersByDate).map((dateGroup, idx) => {
      return dateGroup.map(order => ({ ...order, relativeDate: idx }))
    }))

    const _byProdNick = groupBy(_withTimestamp, order => order.prodNick)

    const _byProdNickByDate = Object.keys(_byProdNick).map(prodNick => {
      return ({
        packGroup: products[prodNick].packGroup,
        prodNick,
        T0: _byProdNick[prodNick].filter(order => order.relativeDate === 0 && order.isStand !== false),
        T1: _byProdNick[prodNick].filter(order => order.relativeDate === 1),
        T2: _byProdNick[prodNick].filter(order => order.relativeDate === 2),
        T3: _byProdNick[prodNick].filter(order => order.relativeDate === 3),
        T4: _byProdNick[prodNick].filter(order => order.relativeDate === 4),
        T5: _byProdNick[prodNick].filter(order => order.relativeDate === 5),
        T6: _byProdNick[prodNick].filter(order => order.relativeDate === 6),
      })
    })
    console.log("_byProdNickByDate", _byProdNickByDate)

    return _byProdNickByDate.sort(dynamicSort('packGroup'))
  }
  const reportData = useMemo(prepareData, [orderData]) ?? []
  const [expandedRows, setExpandedRows] = useState()
  const rowExpansionTemplate = (rowData) => {
    // console.log(data)
    const { packGroup, prodNick, ...ordersByDate } = rowData
    console.log(ordersByDate)
    const rowByLocNick = groupBy(flatten(Object.values(ordersByDate)), order => order.locNick)
    const rowByLocNickByDate = Object.keys(rowByLocNick).map(locNick => {
      return ({
        locNick,
        T0: rowByLocNick[locNick].filter(order => order.relativeDate === 0),
        T1: rowByLocNick[locNick].filter(order => order.relativeDate === 1),
        T2: rowByLocNick[locNick].filter(order => order.relativeDate === 2),
        T3: rowByLocNick[locNick].filter(order => order.relativeDate === 3),
        T4: rowByLocNick[locNick].filter(order => order.relativeDate === 4),
        T5: rowByLocNick[locNick].filter(order => order.relativeDate === 5),
        T6: rowByLocNick[locNick].filter(order => order.relativeDate === 6),
      })
    })
    console.log(rowByLocNickByDate)
    return <DataTable value={rowByLocNickByDate} size="small" 
      paginator rows={10} alwaysShowPaginator={false} style={{width: "95%", margin: "auto"}}
    >
      <Column header="Location" field="locNick"/>
      <Column header="T0" body={rowData => sumBy(rowData.T0, order => order.qty) || ""} />
      <Column header="T1" body={rowData => sumBy(rowData.T1, order => order.qty) || ""} />
      <Column header="T2" body={rowData => sumBy(rowData.T2, order => order.qty) || ""} />
      <Column header="T3" body={rowData => sumBy(rowData.T3, order => order.qty) || ""} />
      <Column header="T4" body={rowData => sumBy(rowData.T4, order => order.qty) || ""} />
      <Column header="T5" body={rowData => sumBy(rowData.T5, order => order.qty) || ""} />
      <Column header="T6" body={rowData => sumBy(rowData.T6, order => order.qty) || ""} />
    </DataTable>
  }
  
  return(<>
    <h1>7 Day List</h1>
    <Button label="Fetch" onClick={() => setShouldFetch(true)} />
    <p>Data fetched & saved in local storage <TimeAgo datetime={orderData?.timestamp}/>.</p>
    <p>Each new day, data will be considered stale and refetched on page load. Use the button to refresh more frequently if needed.</p>

    <DataTable 
      value={reportData} 
      size="small"
      rowGroupMode="subheader" groupRowsBy="packGroup"
      sortMode="single" sortField="packGroup"
      rowGroupHeaderTemplate={data => <div><b>{data.packGroup}</b></div>}
      scrollable
      scrollHeight="48rem"
      expandedRows={expandedRows} 
      onRowToggle={(e) => setExpandedRows(e.data)}
      rowExpansionTemplate={rowExpansionTemplate}
    >
      {/* <Column field="packGroup" header="packGroup" /> */}
      <Column expander style={{ width: '5rem' }} />
      <Column field="prodNick" header="Product" />
      <Column header="T0" body={rowData => sumBy(rowData.T0, order => order.qty)}/>
      <Column header="T1" body={rowData => sumBy(rowData.T1, order => order.qty)}/>
      <Column header="T2" body={rowData => sumBy(rowData.T2, order => order.qty)}/>
      <Column header="T3" body={rowData => sumBy(rowData.T3, order => order.qty)} />
      <Column header="T4" body={rowData => sumBy(rowData.T4, order => order.qty)}/>
      <Column header="T5" body={rowData => sumBy(rowData.T5, order => order.qty)}/>
      <Column header="T6" body={rowData => sumBy(rowData.T6, order => order.qty)}/>
    </DataTable>
  
  </>)
}



