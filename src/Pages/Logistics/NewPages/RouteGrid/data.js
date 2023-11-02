import { useMemo } from "react"
import { useProdOrdersByDate } from "../../../../data/useT0T7ProdOrders"
import { useListData } from "../../../../data/_listData"
import { groupBy, keyBy, mapValues, orderBy, sortBy, truncate, uniqBy } from "lodash"

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
    // console.log("ROUtESSSSSS", routes)

    const orders = orderBy(
      prodOrders.filter(order =>
        order.isWhole && order.isStand !== false && order.qty !== 0
      ),
      order => locations[order.locNick].delivOrder,
      'asc'
    )

    // *** The following has been replaced with new logic farther below ***
    //
    // const ordersByRoute = groupBy(
    //   orders, 
    //   order => order.routeMeta.isValid 
    //     ? order.routeMeta.routeNick
    //     : "NOT ASSIGNED"
    // )

    // Easing up restrictions for route grid:
    //
    // routeMeta.isValid was originally designed for ordering logic and includes
    // a check on daysAvailable to mark items as valid/invalid.
    // Admins have the opportunity to override these checks and enter orders
    // anyway.
    //
    // We change the logic here to only check the logistics part -- if there is
    // a route that could theoretically get the item to its destination, then
    // we assign it.
    const ordersByRoute = groupBy(
      orders, 
      order => order.routeMeta.routeIsAvailable 
        ? order.routeMeta.routeNick
        : "NOT ASSIGNED"
    )

    // console.log("ordersByRoute", ordersByRoute)

    const ordersByRouteByLocation = mapValues(
      ordersByRoute,
      routeGroup => ({
        routeNick: routeGroup[0].routeMeta.routeNick,
        driver: routes[routeGroup[0].routeMeta.routeNick].driver,
        printOrder: routes[routeGroup[0].routeMeta.routeNick].printOrder ?? 0,
        prodNickList: sortBy(
          uniqBy(routeGroup.map(order => order.prodNick)),
          [
            prodNick => products[prodNick].packGroup,
            prodNick => products[prodNick].doughNick,
            prodNick => prodNick
          ]
        ),
        rows: (Object.values(groupBy(routeGroup, 'locNick')).map(rowGroup => {

          const locNick = rowGroup[0].locNick
          const locName = locations[locNick]?.locName || locNick

          return {
            locNick,
            locName, // maybe skip?,
            locNameShort: `${truncate(locName, { length: 16 })}`,
            ...keyBy(rowGroup, 'prodNick')
          }
        }))
      })
    )

    // Making pdf pdf data...
    // pivot columns have simple qty values instead of full order objects
    const ordersByRouteByLocationFlat = mapValues(
      ordersByRoute,
      routeGroup => ({
        routeNick: routeGroup[0].routeMeta.routeNick,
        driver: routes[routeGroup[0].routeMeta.routeNick].driver,
        printOrder: routes[routeGroup[0].routeMeta.routeNick].printOrder ?? 0,
        prodNickList: sortBy(
          uniqBy(routeGroup.map(order => order.prodNick)),
          [
            prodNick => products[prodNick].packGroup,
            prodNick => products[prodNick].doughNick,
            prodNick => prodNick
          ]
        ),
        rows: (Object.values(groupBy(routeGroup, 'locNick')).map(rowGroup => {

          const locNick = rowGroup[0].locNick
          const locName = locations[locNick]?.locName || locNick

          return {
            locNick,
            locName, // maybe skip?,
            locNameShort: `${truncate(locName, { length: 16 })}`,
            ...Object.fromEntries(rowGroup.map(order => [order.prodNick, order.qty]))
          }
        }))
      })
    )
    
    // console.log("ordersByRouteByLocationFlat", ordersByRouteByLocationFlat)
    const pdfGrids = mapValues(
      ordersByRouteByLocationFlat,
      routeDataObj => {
        const { prodNickList, rows, routeNick, driver, printOrder } = routeDataObj

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
          printOrder,
          columns,
          body: rows.map(row => ({ 
            ...row, 
            locNameShort: `${truncate(row.locName, { length: 16 })}`
          })),
        }

      }
      
    )
    
    // console.log("ordersByRouteByLocation", ordersByRouteByLocation)
    // console.log("ordersByRouteByLocationFlat", ordersByRouteByLocationFlat)
    // console.log("locations", locations)

    return {
      tableData: ordersByRouteByLocation,
      pdfGrids,
    }

  }

  return { data: useMemo(calculateValue, [prodOrders, RTE, LOC, PRD]) }
}
