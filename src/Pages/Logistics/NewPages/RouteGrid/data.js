import { useMemo } from "react"
import { useProdOrdersByDate } from "../../../../data/useT0T7ProdOrders"
import { useListData } from "../../../../data/_listData"
import { groupBy, keyBy, mapValues, sortBy, truncate, uniqBy } from "lodash"

/**
 * The returned tableData and pdfGrids objects are keyed by routeNick, where
 * each value contains an object for displaying grid data in a DataTable
 * component or jspdf autotable, respectively.
 */
export const useRouteGrid = ({ reportDate, shouldFetch }) => {

  const { data:prodOrders } = useProdOrdersByDate({ reportDate, shouldFetch })
  const { data:RTE } = useListData({ tableName: "Route", shouldFetch })
  const { data:LOC } = useListData({ tableName: "Location", shouldFetch })
  const { data:PRD } = useListData({ tableName: "Product", shouldFetch })

  const calculateValue = () => {
    if (!prodOrders || !RTE || !LOC || !PRD) return undefined

    const locations = keyBy(LOC, 'locNick')
    const products = keyBy(PRD, 'prodNick')
    const routes = keyBy(RTE, 'routeNick')
    console.log("ROUtESSSSSS", routes)

    const orders = prodOrders
      .filter(order => order.isStand !== false)
      .filter(order => order.qty !== 0 )
  
    const ordersByRoute = groupBy(orders, 'routeMeta.routeNick')
    console.log("ordersByRoute", ordersByRoute)

     // pivot columns have full order object values
    const ordersByRouteByLocation = mapValues(
      ordersByRoute,
      routeGroup => ({
        routeNick: routeGroup[0].routeMeta.routeNick,
        driver: routes[routeGroup[0].routeMeta.routeNick].driver,
        prodNickList: sortBy(
          uniqBy(routeGroup.map(order => order.prodNick)),
          [
            prodNick => products[prodNick].packGroup,
            prodNick => products[prodNick].doughNick,
            prodNick => prodNick
          ]
        ),
        rows: sortBy(
          Object.values(groupBy(routeGroup, 'locNick'),
          order => locations[order.locNick]?.delivOrder ?? 0
          ).map(rowGroup => {

            const locNick = rowGroup[0].locNick
            const locName = locations[locNick]?.locName || locNick

            return {
              locNick,
              locName, // maybe skip?,
              locNameShort: `${truncate(locName, { length: 16 })}`,
              ...keyBy(rowGroup, 'prodNick')
            }
          })
        )
      })
    )

    // pivot columns have simple qty values instead of full order objects
    const ordersByRouteByLocationFlat = mapValues(
      ordersByRoute,
      routeGroup => ({
        routeNick: routeGroup[0].routeMeta.routeNick,
        driver: routes[routeGroup[0].routeMeta.routeNick].driver,
        prodNickList: sortBy(
          uniqBy(routeGroup.map(order => order.prodNick)),
          [
            prodNick => products[prodNick].packGroup,
            prodNick => products[prodNick].doughNick,
            prodNick => prodNick
          ]
        ),
        rows: sortBy(
            Object.values(groupBy(routeGroup, 'locNick'),
            order => locations[order.locNick]?.delivOrder ?? 0
          ).map(rowGroup => {

            const locNick = rowGroup[0].locNick
            const locName = locations[locNick]?.locName || locNick

            return {
              locNick,
              locName, // maybe skip?,
              locNameShort: `${truncate(locName, { length: 16 })}`,
              ...Object.fromEntries(rowGroup.map(order => [order.prodNick, order.qty]))
            }
          })
        )
      })
    )
    
    console.log("ordersByRouteByLocationFlat", ordersByRouteByLocationFlat)
    const pdfGrids = mapValues(
      ordersByRouteByLocationFlat,
      routeDataObj => {
        const { prodNickList, rows, routeNick, driver } = routeDataObj

        const rowLabelColumn = {
          header: "Location",
          dataKey: "locNameShort", // attribute gets mapped onto rows below
          width: { width: "10%" },
        }
        const pivotColumns = prodNickList.map(prodNick => ({
          header: prodNick,
          dataKey: prodNick,
          width: { width: "30px" }
        }))

        const columns = [rowLabelColumn, ...pivotColumns]

        return {
          routeNick,
          driver,
          columns,
          body: rows.map(row => ({ 
            ...row, 
            locNameShort: `${truncate(row.locName, { length: 15 })}`
          })),
        }

      }
      
    )
    
    console.log("ordersByRouteByLocation", ordersByRouteByLocation)
    console.log("ordersByRouteByLocationFlat", ordersByRouteByLocationFlat)
    console.log("locations", locations)

    return {
      tableData: ordersByRouteByLocation,
      pdfGrids,
    }

  }

  return { data: useMemo(calculateValue, [prodOrders, RTE, LOC, PRD]) }
}


// filter by routes

// sort orders by... delivery order?

// transform filter by mapping order to 

// console.log(':', )