import gqlFetcher from "../../../data/_fetchers"

import useSWR from 'swr'
import { getProduct } from "../../../data/swr2.x.x/gqlQueries/queries"
import { useListData } from "../../../data/_listData"
import { DateTime } from "luxon"
import { useMemo } from "react"
import { flatten, groupBy, map, mapValues, orderBy, round, set, sortBy, sum, sumBy, uniqBy } from "lodash"
import { DataTable } from "primereact/datatable"
import { TreeTable } from 'primereact/treetable'
import { Column } from "primereact/column"
import { useDimensionData, useOrderReportByDate } from "../../../data/productionData"
import { getRouteOptions } from "../../Ordering/Orders/data/productHooks"

const prodNicks = ['pz', 'unpz', 'lgpz', 'pzsl']
const qtyPlaceholders = Object.fromEntries(prodNicks.map(pn => [pn, 0]))
const emptyQtyPlaceholder = Object.fromEntries(prodNicks.map(pn => [pn, '']))

const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
const getRelativeIsoDate = (daysAhead) => todayDT.plus({ days: daysAhead }).toISODate()
const getRelativeWeekday = (daysAhead) => todayDT.plus({ days: daysAhead }).toFormat('EEE')

/**
 * ReLU, the "rectified linear unit" function (it's a thing, google it).
 * 
 * "Converts negative numbers to 0 and otherwise preserves them."
 * @param {number} x
 */
const relu = (x) => x >= 0 ? x : 0

const usePretzelData = () => {
  const todayDT = DateTime.now()
    .setZone('America/Los_Angeles')
    .startOf('day')
    //.plus({ days: 0 })
  const todayWeekdayNum = todayDT.weekday % 7
  const todayJS = todayDT.toJSDate()
  const tomorrowJS = todayDT.plus({ days: 1 }).toJSDate()

  const { dimensionData: dim, routedOrderData: T0 } = useOrderReportByDate({
    delivDateJS: todayJS,
    includeHolding: false,
    shouldFetch: true
  })
  const { routedOrderData: T1 } = useOrderReportByDate({
    delivDateJS: tomorrowJS,
    includeHolding: false,
    shouldFetch: true
  })

  if (!T0 || !T1) return { data: undefined }
  const { products, routes, zoneRoutes } = dim

  const pretzelProducts = Object.values(products).filter(product => 
    product.doughNick === "Pretzel Bun"
  )
  const pretzelProdNicks = pretzelProducts.map(P => P.prodNick)
  //const pretzelPlaceholders = Object.fromEntries(pretzelProducts.map(P => [P.prodNick, 0]))

  //console.log('products', products)
  const frenchProducts = Object.values(products).filter(product => 
    product.doughNick !== "Pretzel Bun"
      && product.readyTime < 15
      && product.doughNick === 'French'
      && !(['rdch', 'frfr'].includes(product.prodNick))
  )
  const frenchProdNicks = frenchProducts.map(P => P.prodNick)

  const frPastryProducts = Object.values(products).filter(product => 
    product.packGroup === "frozen pastries"
  )
  const frPastryProdNicks = frPastryProducts.map(P => P.prodNick)

  const T0_Orders = T0
    .filter(order => order.isWhole !== false)
    .map(order => ({
      ...order,
      routeMeta: getRouteOptions({
        product: order.product,
        location: order.location,
        routeDict: routes,
        ZRT: zoneRoutes
      })[todayDT.weekday % 7][0]
    }))
    .filter(order => 
      order.routeMeta.adjustedLeadTime === order.product.leadTime
    )

  console.log("T1", T1)
  const T1_Orders = T1
    .filter(order => order.isWhole !== false)
    .map(order => ({
      ...order,
      routeMeta: getRouteOptions({
        product: order.product,
        location: order.location,
        routeDict: routes,
        ZRT: zoneRoutes
      })[(todayDT.weekday + 1) % 7][0]
    }))
    .filter(order => 
      order.routeMeta.adjustedLeadTime === order.product.leadTime + 1
    )

  const orders = [T0_Orders, T1_Orders]

  const makeTableData = (TN_Orders) => {
    const TN_Pivot = groupBy(TN_Orders, 'locNick')
    
    const TN_Data = mapValues(TN_Pivot, locationGroup => {
      const { locNick, location, routeNick, route, delivDate, isWhole, isStand } = locationGroup[0]
  
      const nestedData = {
        orderData: {
          locNick, location, routeNick, route, delivDate, isWhole, isStand
        },
        //...pretzelPlaceholders,
        ...mapValues(
          groupBy(locationGroup, 'prodNick'),
          productGroup => ({ 
            prodNick: productGroup[0].prodNick, 
            product: productGroup[0].product,
            qty: productGroup[0].qty,
          })
        )
      }
      return nestedData

    })

    return Object.values(TN_Data)
  }

  const customSort = (data) => sortBy(
    data, 
    ['orderData.route.routeStart', 'orderData.route.routeNick', 'orderData.locNick']
  )

  const pretzelData = orders.map(TN_Orders => {
    const pretzelOrders = TN_Orders.filter(order =>
      order.product.doughNick === "Pretzel Bun"
    )
    return customSort( makeTableData(pretzelOrders) )
  })
    
  const T1FrenchData = customSort( makeTableData(
    T1_Orders.filter(order =>
      order.product.doughNick !== "Pretzel Bun"
        && order.product.readyTime < 15
        && order.product.doughNick === 'French'
        && !(['rdch', 'frfr'].includes(order.product.prodNick))
    )
  ))

  const T0FrPastryData = customSort( makeTableData(
    T0.filter(order =>
      order.product.packGroup === "frozen pastries"
        //&& order.route.RouteDepart === "Prado"
    )
  ))

  const T1FrPastryData = customSort( makeTableData(
    T1.filter(order =>
      order.product.packGroup === "frozen pastries"
        //&& order.route.RouteDepart === "Prado"
    )
  ))

  return {
    data: {
      pretzel: {
        prodNicks: pretzelProdNicks,
        T0: pretzelData[0], 
        T1: pretzelData[1]
      },
      french: {
        prodNicks: frenchProdNicks,
        T0: [],
        T1: T1FrenchData
      },
      frPastry: {
        prodNicks: frPastryProdNicks,
        T0: T0FrPastryData,
        T1: T1FrPastryData
      },
    }
  }

}

export const SpecialPacking = () => {

  const { data } = usePretzelData()

  if (!data) return <div>Loading...</div>

  return(
    <div>
      <p>
        Note: Table rows are not meant to show each customer's entire order.
      </p>

      <h1>Pretzel Packing</h1>

      <h2>Pack for Today</h2>
      <DataTable value={data.pretzel.T0}>
        <Column header="Route" field="orderData.routeNick" />
        <Column header="Route Start" field="orderData.route.routeStart" />
        <Column header="Location" field="orderData.locNick" />
        {data.pretzel.prodNicks.map((prodNick) => {

          return (
            <Column key={`T0Column_pretzel_${prodNick}`} header={prodNick} field={`${prodNick}.qty`} />
          )
        })}
      </DataTable>

      <h2>Pack for Tomorrow</h2>
      <DataTable value={data.pretzel.T1}>
        <Column header="Route" field="orderData.routeNick" />
        <Column header="Route Start" field="orderData.route.routeStart" />
        <Column header="Location" field="orderData.locNick" />
        {data.pretzel.prodNicks.map((prodNick) => {

          return (
            <Column key={`T1Column_pretzel_${prodNick}`} header={prodNick} field={`${prodNick}.qty`} />
          )
        })}
      </DataTable>

      <h1>Other Special Orders</h1>
      <h2>Pack for Tomorrow</h2>
      <DataTable value={data.french.T1}>
        <Column header="Route" field="orderData.routeNick" />
        <Column header="Route Start" field="orderData.route.routeStart" />
        <Column header="Location" field="orderData.locNick" />
        {data.french.prodNicks.map((prodNick) => {

          return (
            <Column key={`T1Column_french_${prodNick}`} header={prodNick} field={`${prodNick}.qty`} />
          )
        })}
      </DataTable>

      <h1>Frozen Pastry Packing</h1>
      <h2>Orders Going Out Today</h2>
      <DataTable value={data.frPastry.T0}>
        <Column header="Departs From" field="orderData.route.RouteDepart" />
        <Column header="Route" field="orderData.routeNick" />
        <Column header="Route Start" field="orderData.route.routeStart" />
        <Column header="Location" field="orderData.locNick" />
        {data.frPastry.prodNicks.map((prodNick) => {

          return (
            <Column key={`T0Column_frPastry_${prodNick}`} header={prodNick} field={`${prodNick}.qty`} />
          )
        })}
      </DataTable>

      <h2>Orders Going Out Tomorrow</h2>
      <p>Warning: Order counts may change between now and tomorrow's delivery.</p>
      <DataTable value={data.frPastry.T1}>
        <Column header="Departs From" field="orderData.route.RouteDepart" />
        <Column header="Route" field="orderData.routeNick" />
        <Column header="Route Start" field="orderData.route.routeStart" />
        <Column header="Location" field="orderData.locNick" />
        {data.frPastry.prodNicks.map((prodNick) => {

          return (
            <Column key={`T1Column_frPastry_${prodNick}`} header={prodNick} field={`${prodNick}.qty`} />
          )
        })}
      </DataTable>
      
    </div>
  )
}