// Notes:
//
// useOrderReportByDate uses an older route-assignment function.
// We've since introduced some front-end overrides for testing that
// handle exceptional route-assignment scenarios.
//
// getRouteOptions is a newer route-asignment function that applies
// these new overrides. We should reference the routeMeta attribute
// when looking up/displaying route info.

import { DateTime } from "luxon"
import { Card } from "primereact/card"
import { groupBy, mapValues, round, sortBy } from "lodash"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { useOrderReportByDate } from "../../../../../data/productionData"
import { getRouteOptions } from "../../../../Ordering/Orders/data/productHooks"
import { useWindowSizeDetector } from "../../../../../functions/detectWindowSize"

const prodNicks = ['pz', 'unpz', 'lgpz', 'pzsl']
// const qtyPlaceholders = Object.fromEntries(prodNicks.map(pn => [pn, 0]))
// const emptyQtyPlaceholder = Object.fromEntries(prodNicks.map(pn => [pn, '']))

const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
const getRelativeIsoDate = (daysAhead) => todayDT.plus({ days: daysAhead }).toISODate()
const getRelativeWeekday = (daysAhead) => todayDT.plus({ days: daysAhead }).toFormat('EEE')

/**takes a decimal number representation of time and formats as a sring
 * 
 * ex: formatHours(8.25) // "8:15am"
 */
const formatHours = (timeFloat) => {
  const hour = Math.floor(Number(timeFloat)) || 0
  const minute = round((Number(timeFloat) - hour) * 60) || 0
  return DateTime.fromObject({ hour, minute }).toFormat('h:mm')
}

/**
 * ReLU, the "rectified linear unit" function (it's a thing, google it).
 * 
 * "Converts negative numbers to 0 and otherwise preserves them."
 * @param {number} x
 */
const relu = (x) => x >= 0 ? x : 0

const usePackData = () => {
    // const todayDT = DateTime.now()
    //   .setZone('America/Los_Angeles')
    //   .startOf('day')
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

  const T0_Routed = T0
    //.filter(order => order.isWhole !== false)
    .map(order => ({
      ...order,
      routeMeta: getRouteOptions({
        product: order.product,
        location: order.location,
        routeDict: routes,
        ZRT: zoneRoutes
      })[todayDT.weekday % 7][0]
    }))

  const T0_Orders = T0_Routed
    .filter(order => 
      order.routeMeta.adjustedLeadTime === order.product.leadTime
    )

  const T1_Routed = T1
    //.filter(order => order.isWhole !== false)
    .map(order => ({
      ...order,
      routeMeta: getRouteOptions({
        product: order.product,
        location: order.location,
        routeDict: routes,
        ZRT: zoneRoutes
      })[(todayDT.weekday + 1) % 7][0]
    }))

  const T1_Orders = T1_Routed  
    .filter(order => 
      order.routeMeta.adjustedLeadTime === order.product.leadTime + 1
    )

  // console.log(T0_Orders, T1_Orders)

  const orders = [T0_Orders, T1_Orders]
  console.log(
    '"NOT ASSIGNED" orders (bad if Nonempty):', 
    T0_Orders.filter(order => order.routeNick === "NOT ASSIGNED"),
    T1_Orders.filter(order => order.routeNick === "NOT ASSIGNED"),
  )
  // console.log("Retail T0:", T0_Routed.filter(order => order.isWhole === false))
  // console.log("Retail T1:", T1_Routed.filter(order => order.isWhole === false))

  const makeTableData = (TN_Orders) => {
    const TN_Pivot = groupBy(TN_Orders, 'locNick')
    
    const TN_Data = mapValues(TN_Pivot, locationGroup => {
      const { 
        locNick, location, 
        routeNick, route, routeMeta, // routeMeta has more up-to-date logic than route 
        delivDate, 
        isWhole, isStand 
      } = locationGroup[0]
  
      const nestedData = {
        orderData: {
          locNick, location, 
          routeNick, route, routeMeta, 
          delivDate, isWhole, isStand
        },
        //...pretzelPlaceholders,
        items: {
          ...mapValues(
            groupBy(locationGroup, 'prodNick'),
            productGroup => ({ 
              prodNick: productGroup[0].prodNick, 
              product: productGroup[0].product,
              qty: productGroup[0].qty,
            })
          )
        }
      }
      return nestedData

    })

    return Object.values(TN_Data)
  }

  const customSort = (data) => sortBy(
    data, 
    [
      'orderData.route.route.routeStart', 
      'orderData.route.routeNick', 
      'orderData.locNick'
    ]
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
    T0_Routed.filter(order =>
      order.product.packGroup === "frozen pastries"
        //&& order.route.RouteDepart === "Prado"
    )
  ))

  const T1FrPastryData = customSort( makeTableData(
    T1_Routed.filter(order =>
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
  const { data } = usePackData()
  const windowSize = useWindowSizeDetector()

  if (!data) return <div>Loading...</div>
  console.log(data)

  return(
    <div style={{display: "flex", justifyContent: "center"}}>
    <div style={{maxWidth: "45rem", marginBottom: "10rem"}}>
      <p>
        Note: Table rows are not meant to show each customer's entire order.
      </p>

      <h1>Pretzel Packing {todayDT.toFormat('MM/dd/yyyy')}</h1>
      <h2>Pack for Today</h2>
      <InfoTemplate
        key='pretzel_T0'
        value={data.pretzel.T0}
        prodNicks={data.pretzel.prodNicks}
        windowSize={windowSize}
      />

      <h2>Pack for Tomorrow</h2>
      <InfoTemplate
        key='pretzel_T1'
        value={data.pretzel.T1}
        prodNicks={data.pretzel.prodNicks}
        windowSize={windowSize}
      />

      <h1>Other Special Orders</h1>
      <h2>Pack for Tomorrow</h2>
      <InfoTemplate
        key='special_T1'
        value={data.french.T1}
        prodNicks={data.french.prodNicks}
        windowSize={windowSize}
      />

      <h1>Frozen Pastry Packing</h1>
      <h2>Orders For Today</h2>
      <InfoTemplate
        key='frPastry_T0'
        value={data.frPastry.T0}
        prodNicks={data.frPastry.prodNicks}
        showDepartsFrom={true}
        windowSize={windowSize}
      />

      <h2>Orders For Tomorrow</h2>
      <p>Warning: Order counts may change between now and tomorrow's delivery.</p>
      <InfoTemplate
        key='frPastry_T1'
        value={data.frPastry.T1}
        prodNicks={data.frPastry.prodNicks}
        showDepartsFrom={true}
        windowSize={windowSize}
      />

      {/* {data.frPastry.T1.map((rowData, idx) => 
        <MobilePackInfo key={`mobile_display_${idx}`} rowData={rowData} />
      )}
          */}
    </div>
    </div>
  )
}


const InfoTemplate = ({ 
  key, 
  value, 
  prodNicks, 
  showDepartsFrom=false,
  windowSize,
}) => {

  if (windowSize.width > 960) return <TableTemplate 
    key={key} 
    value={value} 
    prodNicks={prodNicks} 
    showDepartsFrom={showDepartsFrom}
  />

  return <MobilePackList 
    key={`m_${key}`} 
    value={value} 
  />
}

const MobilePackList = ({ key, value }) => {
  
  if (!value) return <div></div>
  if (!value.length) return <div>No Items</div>
  return <>
    {value.map((rowData, idx) => {
      return (
        <PackInfoCard
          key={`m_${key}_${idx}`} 
          rowData={rowData} 
        />
      )
    })}
  </>
}

const PackInfoCard = ({ rowData }) => {
  if (!rowData) return <div></div>
  return(
    <>
      <Card
        style={{marginBlock: '.5rem', maxWidth: "25rem"}}
        title={`${rowData.orderData.location.locName} (${rowData.orderData.locNick})`}
        subTitle={() => <div style={{color: 'black'}}>
          <div>{`Route: ${rowData.orderData.routeMeta.routeNick}`}</div>
          <div>{`
            Start: ${rowData.orderData.routeMeta.route.RouteDepart} 
            at ${formatHours(rowData.orderData.routeMeta.route.routeStart)}
          `}</div>
        </div>}
      >
        <table>
          <tbody>
            {Object.values(rowData.items).map((item, idx) => 
              <tr>
                <td>{item.prodNick}</td>
                <td>{item.qty}</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    
    </>
  )
}

const TableTemplate = ({ key, value, prodNicks, showDepartsFrom=false }) => {
  return(
    <DataTable value={value}>
      {showDepartsFrom &&
        <Column 
          header="Departs From" 
          field="orderData.routeMeta.route.RouteDepart" 
        />
      }
      <Column 
        header="Route" 
        field="orderData.routeMeta.routeNick" 
      />
      <Column
        header="Route Start" 
        body={row => formatHours(row.orderData.routeMeta.route.routeStart)} 
      />
      <Column 
        header="Location" 
        field="orderData.locNick" 
      />
      {prodNicks.map((prodNick) => {
        return (
          <Column 
            key={`${key}_${prodNick}`} 
            header={prodNick} 
            field={`items.${prodNick}.qty`} 
          />
        )
      })}
    </DataTable>

  )
}