import { useMemo } from "react";
import { useLocations } from "../../../../data/location/useLocations";
import { useProducts } from "../../../../data/product/useProducts";
import { DateTime } from "luxon";
import { useCombinedRoutedOrdersByDate } from "../../../../data/production/useProductionData.js";
import { useInfoQBAuths } from "../../../../data/infoQBAuths/useInfoQBAuths.js";
import { DT } from "../../../../utils/dateTimeFns.js";
import { compareBy, keyBy, sumBy } from "../../../../utils/collectionFns.js";
import { objProject } from "../../../../utils/objectFns.js";
import { tablePivot, tablePivotFlatten } from "../../../../utils/tablePivot.js";


/*
For Nick's North List, 
it should continue to include 
  Driver Notes, 
  Frozen and Baked Croix, 
  and Shelf Products.  
  
All of the rustic bread groups can be removed and in their place should be 
the grid for Prado pack of AM North.  
I've been producing that manually for him in the mornings but if we could 
have one button that he can push to produce that, would be ideal.

*/

// These equivalences cannot be queried directly from DB records;
// better to hard code the values for now.

/** maps ProdNicks to the forBake of some representative product */
const prodNickToShapeTypeMap = {
  al: "Almond",
  fral: "Almond",
  ch: "ch",
  frch: "ch",
  pg: "pg",
  frpg: "frpg",
  mb: "mb",
  unmb: "mb",
  frmb: "mb",
  pl: "pl",
  frpl: "pl",
  sf: "sf",
  frsf: "sf",
  mini: "mini",
  frmni: "mini",
}

const summaryAttributes = [
  'locNick', 
  'prodNick', 
  'delivDate', 
  'qty', 
  'route'
]

/**
 * 
 * @param {Object} input
 * @param {DateTime} input.reportDT
 * @returns 
 */ 
const useNorthListData = ({
  reportDT
}) => {
  const { data:LOC } = useLocations({ shouldFetch: true })
  const { data:PRD } = useProducts({ shouldFetch: true })
  const { data:IQB }  = useInfoQBAuths({ shouldFetch: true })
  const { data:T0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT, useHolding: false })
  const { data:T1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true })
  

  const calcCroixNorth = () => {
    if (!LOC || !PRD || !IQB || !T0Orders || !T1Orders) return []

    const T1Iso = reportDT.plus({ days: 1 }).toFormat('yyyy-MM-dd')
    const products = keyBy(PRD, P => P.prodNick)

    // **** 1. freezerNorth data source ****
    const sortedProducts = PRD.sort(compareBy(P => P.prodName))

    // **** 2. Frozen orders to be sent north ****
    const T0NorthFrozenOrders = T0Orders.filter(order => 1
      && products[order.prodNick].packGroup === "frozen pastries"
      && products[order.prodNick].doughNick === "Croissant"
      && order.meta.route?.RouteDepart      === "Carlton" 
    )
    const T1NorthBakedOrders = T1Orders.filter(order => 1
      && products[order.prodNick].bakedWhere.length > 1
      && products[order.prodNick].packGroup === "baked pastries"
      && products[order.prodNick].doughNick === "Croissant"
      && order.meta.route?.RouteDepart      === "Carlton" 
    )

    // **** 3. Baked orders ****
    const T0BakedOrders = T0Orders.filter(order => 1
      && products[order.prodNick].bakedWhere.length > 1
      && products[order.prodNick].packGroup === "baked pastries"
      && products[order.prodNick].doughNick === "Croissant"
    )

    // **** 4. Orders after deadline ****
    const southSetoutRecord = 
      IQB.find(item => item.id === T1Iso + "PradosetoutTime")

    const southSetoutTime = !!southSetoutRecord 
      ? DT.fromIsoTs(southSetoutRecord.updatedAt).toMillis()
      : DT.now().toMillis()

    // const northSetoutRecord = 
    //   IQB.find(item => item.id === T1Iso + "PradosetoutTime")

    // const northSetoutTime = !!northSetoutRecord 
    //   ? DT.fromIsoTs(northSetoutRecord.updatedAt).toMillis()
    //   : DT.now().toMillis()

    const retailOrdersAfterDeadline = T0Orders.filter(order => 1
      && order.isWhole === false
      && order.delivDate === T1Iso
      && (0
        || (1
          && order.route === "slopick"   
          && DT.fromIsoTs(order.updatedOn).toMillis() > southSetoutTime
        )
        // || (1
        //   && order.route === "atownpick" 
        //   && DT.fromIsoTs(order.updatedOn).toMillis() > northSetoutTime
        // ) // want to count south orders only, which subtract from qty sent north
      )
      
    )

    let croixRows = [
      { forBake: "Almond", prodNick: "al",   prod: "al",   frozenQty: 0, frozen: {}, bakedQty: 0, baked: {} },
      { forBake: "ch",     prodNick: "ch",   prod: "ch",   frozenQty: 0, frozen: {}, bakedQty: 0, baked: {} },
      { forBake: "pg",     prodNick: "pg",   prod: "pg",   frozenQty: 0, frozen: {}, bakedQty: 0, baked: {} },
      { forBake: "mb",     prodNick: "mb",   prod: "mb",   frozenQty: 0, frozen: {}, bakedQty: 0, baked: {} },
      { forBake: "pl",     prodNick: "pl",   prod: "pl",   frozenQty: 0, frozen: {}, bakedQty: 0, baked: {} },
      { forBake: "sf",     prodNick: "sf",   prod: "sf",   frozenQty: 0, frozen: {}, bakedQty: 0, baked: {} },
      { forBake: "mini",   prodNick: "mini", prod: "mini", frozenQty: 0, frozen: {}, bakedQty: 0, baked: {} },
    ] 

    for (let row of croixRows) { 

      // **** Frozen Column ****
      const freezerNorth = 
        sortedProducts.find(P => P.forBake === row.forBake)?.freezerNorth ?? 0

      const frozenOrderItems = T0NorthFrozenOrders.filter(order => 
        prodNickToShapeTypeMap[order.prodNick] === row.forBake
      )
      .map(order => objProject(order, summaryAttributes))

      const frozenOrderQty = sumBy(frozenOrderItems, order => order.qty)
      row.frozen.frozenOrderItems = frozenOrderItems
      row.frozen.frozenOrderQty   = frozenOrderQty

      const bakedOrderItems = T1NorthBakedOrders.filter(order => 
        prodNickToShapeTypeMap[order.prodNick] === row.forBake
      )
      .map(order => order.locNick === "backporch"
        ? { ...order, qty: Math.ceil(order.qty / 2) }
        : order
      )
      .map(order => objProject(order, summaryAttributes))

      const bakedOrderQty = sumBy(bakedOrderItems, order => order.qty)
      row.frozen.bakedOrderItems = bakedOrderItems
      row.frozen.bakedOrderQty   = bakedOrderQty

      const qtyNeeded = frozenOrderQty + bakedOrderQty - freezerNorth
      const adjustedQtyNeeded = row.prodNick === "al"
        ? Math.max(0, qtyNeeded)
        : row.prodNick === "mini" 
          ? Math.max(0, Math.ceil(qtyNeeded / 12) * 12)
          : Math.max(0, Math.ceil(qtyNeeded / 12) * 12 + 12)

      row.frozenQty = adjustedQtyNeeded

      // **** Baked Column ****
      const backporchOrders = T0BakedOrders.filter(order => 1
        && order.locNick === "backporch"
        && prodNickToShapeTypeMap[order.prodNick] === row.forBake
      ).map(order =>
        objProject(order, summaryAttributes)  
      )
      const backporchQty = sumBy(backporchOrders, order => order.qty)
      row.baked.backporchOrders = backporchOrders
      row.baked.backporchQty    = backporchQty

      const bpbextrasOrders = T0BakedOrders.filter(order => 1
        && order.locNick === "bpbextras"
        && prodNickToShapeTypeMap[order.prodNick] === row.forBake  
      ).map(order => 
        objProject(order, summaryAttributes)
      )
      const bpbextrasQty = sumBy(bpbextrasOrders, order => order.qty) // vulnerable to duplicate items
      row.baked.bpbextrasOrders = bpbextrasOrders
      row.baked.bpbextrasQty    = bpbextrasQty

      const afterDeadlineOrders = retailOrdersAfterDeadline.filter(order => 
        prodNickToShapeTypeMap[order.prodNick] === row.forBake  
      )
      .map(order => objProject(order, summaryAttributes))
      const afterDeadlineQty = sumBy(afterDeadlineOrders, order => order.qty)
      row.baked.afterDeadlineOrders = afterDeadlineOrders
      row.baked.afterDeadlineQty    = afterDeadlineQty

      const bakedQty = Math.max(
        0,
        Math.round(backporchQty / 2) - bpbextrasQty - afterDeadlineQty
      )
      row.bakedQty = bakedQty

    }

    return croixRows.filter(row => 0
      || row.prodNick  !== "mini"
      || row.bakedQty  !== 0
      || row.frozenQty !== 0  
    )

  }

  const calcShelfProds = () => {
    if (!LOC || !PRD || !T0Orders) return { pivotTable:[], columnKeys:[], flatTable:[] }

    const locations = keyBy(LOC, P => P.locNick)
    const products = keyBy(PRD, P => P.prodNick)

    console.log("FICELLE ORDERS:", T0Orders.filter(order => order.prodNick === 'fic'))

    const shelfProdOrders = T0Orders.filter(order => 1
      && products[order.prodNick].bakedWhere.length === 1
      && products[order.prodNick].bakedWhere.includes("Prado")
      && order.meta.route?.RouteDepart === "Carlton"
      && products[order.prodNick].packGroup !== "frozen pastries"
      //&& !["fic", "mdch"].includes(order.prodNick)
    )

    // const pivotTable = generatePivot(shelfProdOrders, locations, products)

    const pivotTable = tablePivot(
      shelfProdOrders,
      { 
        locNick: row => row.locNick, 
        driver: row => row.meta.route.driver, 
        route: row => row.meta.routeNick 
      },
      "prodNick",
      cellData => sumBy(cellData, order => order.qty)
    )
    .sort(compareBy(row => row.route))
    .sort(compareBy(row => row.driver === 'Long Driver', 'desc'))
    .map(row => {
      const { locNick, driver } = row.rowProps
      const locName = locations[locNick]?.locName ?? locNick
  
      return {
        ...row,
        rowProps: { 
          ...row.rowProps, 
          locNameShort: (driver === "Long Driver" ? "": "* ") 
            + (locName.length > 10 ? locName.substring(0,15) + "..." : locName) //+ truncate(row.customer, { length: 18 })
        }
      }
    })
    const columnKeys = Object.keys(pivotTable[0]?.colProps)?.sort()
    const flatTable = tablePivotFlatten(pivotTable)

    return {
      pivotTable,
      columnKeys,
      flatTable,
    }

  }

  const calcAMNorthPradoPack = () => {
    if (!LOC || !PRD || !T0Orders) return { pivotTable:[], columnKeys:[], flatTable:[] }

    const locations = keyBy(LOC, P => P.locNick)
    const products = keyBy(PRD, P => P.prodNick)

    const shouldPackAtHiguera = order => 1
    && products[order.prodNick].doughNick !== "French"
    && (0
      || products[order.prodNick].packGroup === 'rustic breads'
      || products[order.prodNick].packGroup === 'retail'
      || products[order.prodNick].packGroup === 'focaccia'
    )

    // const AMNorthOrders = T0Orders.filter(order => order.meta.routeNick === "AM North")


    const AMNorthOrders = T0Orders.filter(order => 1
      && !shouldPackAtHiguera(order)
      && order.meta.routeNick === "AM North"
      && order.isWhole
      && order.qty !== 0
    
    ).sort(
      compareBy(order => locations[order.locNick].delivOrder)
    
    )
    // console.log("AMNorthOrderssihgftsedihtf", AMNorthOrders)


    // const pivotTable = generatePivot(AMNorthOrders, locations, products)

    const pivotTable = tablePivot(
      AMNorthOrders,
      { 
        locNick: row => row.locNick, 
        driver: row => row.meta.route.driver, 
        route: row => row.meta.routeNick 
      },
      "prodNick",
      cellData => sumBy(cellData, order => order.qty)
    )
    .sort(compareBy(row => row.route))
    .sort(compareBy(row => row.driver === 'Long Driver', 'desc'))
    .map(row => {
      const { locNick, driver } = row.rowProps
      const locName = locations[locNick]?.locName ?? locNick
  
      return {
        ...row,
        rowProps: { 
          ...row.rowProps, 
          locNameShort: (driver === "Long Driver" ? "": "* ") 
            + (locName.length > 10 ? locName.substring(0,15) + "..." : locName) //+ truncate(row.customer, { length: 18 })
        }
      }
    })
    const columnKeys = Object.keys(pivotTable[0].colProps)
      .sort(compareBy(prodNick => prodNick))
      .sort(compareBy(prodNick => products[prodNick].doughNick))
      .sort(compareBy(prodNick => products[prodNick].packGroup))

    const flatTable = tablePivotFlatten(pivotTable)

    return {
      pivotTable,
      columnKeys,
      flatTable,
    }

  }

  return { 
    // data: useMemo(calcNorthLists, [LOC, PRD, IQB, T0Orders, T1Orders]),
    useCalcCroixNorth:    () => useMemo(calcCroixNorth, [LOC, PRD, IQB, T0Orders, T1Orders]),
    useCalcShelfProds:    () => useMemo(calcShelfProds, [LOC, PRD, T0Orders]),
    useAMNorthPradoPack : () => useMemo(calcAMNorthPradoPack, [LOC, PRD, T0Orders]),
  }

}

export { useNorthListData }


