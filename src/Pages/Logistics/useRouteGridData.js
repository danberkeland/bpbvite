import { useMemo } from "react"
import { useLocations } from "../../data/location/useLocations"
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { useRoutes } from "../../data/route/useRoutes"
import { compareBy, groupByArrayRdc, groupByObject, keyBy, uniqByRdc } from "../../utils/collectionFns"
import { DT } from "../../utils/dateTimeFns"
import { tablePivot } from "../../utils/tablePivot"
import { useProducts } from "../../data/product/useProducts"

import jsPDF from "jspdf"
import "jspdf-autotable"
import { truncate } from "lodash"
import { DBProduct } from "../../data/types.d"
import { divyUp } from "../../utils/divyUp"

/**
 * If a prodNick is not included or if nPerBag is set to 0, 
 * stickers will not be generated for that item.
 */
const stickerInfo = [
  { prodNick: 'mbag',  nPerBag: 24 },
  { prodNick: 'dbag',  nPerBag: 18 },
  { prodNick: 'bag',   nPerBag: 12 },
  { prodNick: 'epi',   nPerBag: 9 },
  { prodNick: 'lglv',  nPerBag: 3 },
  { prodNick: 'lev',   nPerBag: 6 },
  { prodNick: 'lgmt',  nPerBag: 3 },
  { prodNick: 'mlti',  nPerBag: 6 },
  { prodNick: 'rye',   nPerBag: 6 },
  { prodNick: 'lgry',  nPerBag: 3 },
  { prodNick: 'oli',   nPerBag: 6 },
  { prodNick: 'bcwal', nPerBag: 6 },
  { prodNick: 'foc',   nPerBag: 3 },
  { prodNick: 'hfoc',  nPerBag: 3 },
  { prodNick: 'rbag',  nPerBag: 10 },
  { prodNick: 'rlev',  nPerBag: 4 },
  { prodNick: 'rmlti', nPerBag: 4 },
  { prodNick: 'rrye',  nPerBag: 4 },
  { prodNick: 'roli',  nPerBag: 4 },
]

const isHigueraPackProduct = (/** @type {DBProduct} */ product) => 1
  && product.doughNick !== "French"
  && ['rustic breads', 'retail', 'focaccia'].includes(product.packGroup)



const calculateGridData = (R0Orders, LOC, RTE, products) => {
  if (!R0Orders || !LOC || !RTE || !products) {
    return { data: undefined, pradoData: undefined, higueraData: undefined }
  }

  const locations = keyBy(LOC, L => L.locNick)
  const routes = keyBy(RTE, R => R.routeNick)

  const rowPartitionModel = { 
    locNick:        order => order.locNick,
    locName:        order => locations[order.locNick]?.locName ?? order.locNick,
    qbID:           order => locations[order.locNick]?.qbID ?? 'n/a',
    toBePrinted:    order => locations[order.locNick]?.toBePrinted ?? false,
    printDuplicate: order => locations[order.locNick]?.printDuplicate ?? false,
    displayName:    order => truncate(locations[order.locNick]?.locName ?? order.locNick, { length: 16 }),
    routeNick:      order => order.meta.routeNick,
    driver:         order => routes[order.meta.routeNick].driver
  }

  const routeGridPivot = tableData => 
    tablePivot(tableData, rowPartitionModel, order => order.prodNick, cellData => cellData[0].qty)
    
  const generateData = orderSet => orderSet
    .sort(compareBy(order => locations[order.locNick]?.delivOrder ?? 999))
    .sort(compareBy(order => routes[order.meta.routeNick].printOrder))
    .reduce(groupByArrayRdc(order => order.meta.routeNick), [])
    .map(routeGroup => routeGridPivot(routeGroup))

  const orders = R0Orders.filter(order => order.qty !== 0 && order.isWhole)
  const pradoOrders = R0Orders.filter(order => !isHigueraPackProduct(products[order.prodNick]) && order.isWhole)
  const higueraOrders = R0Orders.filter(order => isHigueraPackProduct(products[order.prodNick]))
  
  const data = generateData(orders)
  const pradoData = generateData(pradoOrders)
  const higueraData = generateData(higueraOrders)

  return { data, pradoData, higueraData }

}



const calculateHigueraStickerData = (R0, R0Orders, R1Orders, LOC, RTE, products) => {
  if (!R0 || !R0Orders || !R1Orders || !LOC || !RTE || !products) return undefined

  const locations = keyBy(LOC, L => L.locNick)
  const routes = keyBy(RTE, R => R.routeNick)

  const isHigueraStickerOrder = (/** @type {CombinedRoutedOrder} */ order) => 1
    && isHigueraPackProduct(products[order.prodNick])
    && order.qty !== 0 
    && !['whole', 'slonat', 'backporch', 'bpbextras', 'bpbkit'].includes(order.locNick)
    && !['Pick up Carlton'].includes(order.meta.routeNick)
    && (0 // lucy orders are labeled/packed the day before delivery; focaccia orders the day of. This is still a very ad-hoc system.
      || (!['hfoc', 'foc'].includes(order.prodNick) && R0 === order.meta.routePlan.steps[0].end.date) 
      || ( ['hfoc', 'foc'].includes(order.prodNick) && R0 === order.delivDate)
    )
    // order is already assumed NOT to be a holding order

  return [...R0Orders, ...R1Orders]
    .filter(order => isHigueraStickerOrder(order))
    .map(order => {
      const nPerBag = stickerInfo.find(S => S.prodNick === order.prodNick)?.nPerBag ?? 0
      const nBags = nPerBag > 0 ? Math.ceil(order.qty / nPerBag) : 0

      const displayDate = order.delivDate === R0
        ? DT.fromIso(order.delivDate).toFormat('M/d')
        : '**' + DT.fromIso(order.delivDate).toFormat('M/d') + '**'

      return {
        locNick:     order.locNick,
        locName:     (locations[order.locNick]?.locName ?? order.locNick).split('__')[0],
        prodNick:    order.prodNick,
        prodName:    products[order.prodNick].prodName ?? order.prodNick,
        isWhole:     order.isWhole,
        totalQty:    order.qty,
        stickerQtys: divyUp(order.qty, nBags),
        routeNick:   order.meta.routeNick ?? "N/A",
        driver:      routes[order.meta.routeNick]?.driver ?? "N/A",
        delivDate:   order.delivDate,
        displayDate,
      }
    })
    .sort(compareBy(stickerItem => stickerItem.prodName))
    .sort(compareBy(stickerItem => stickerItem.locName))
    .sort(compareBy(stickerItem => locations[stickerItem.locNick]?.delivOrder ?? 999))
    .sort(compareBy(stickerItem => stickerItem.routeNick))
    .sort(compareBy(stickerItem => stickerItem.driver))
    .sort(compareBy(stickerItem => stickerItem.delivDate, 'desc'))
    .flatMap(stickerItem => {
      const { stickerQtys, ...rest } = stickerItem
      const prodStickerCount = stickerQtys.length

      return stickerQtys.map((stickerQty, idx) => ({
        ...rest,
        prodIdx: idx + 1,
        prodStickerCount,
        stickerQty
      }))

    })
    .reduce(groupByArrayRdc(order => order.locNick), [])
    .flatMap(orderStickerGroup => {
      
      return orderStickerGroup.map((stickerItem, idx) => ({
        ...stickerItem,
        stickerIdx: idx + 1,
        stickerCount: orderStickerGroup.length
      }))
    })

}


const saveHigueraStickersPdf = (stickerData, R0) => {
  if (!stickerData) return

  const doc = new jsPDF({ format: [2, 4], unit: "in", orientation: "l" })
  
  stickerData.forEach((stickerItem, idx, data) => {
    const { 
      driver, routeNick, locName, prodNick, totalQty, prodIdx, 
      prodStickerCount, stickerQty, stickerIdx, stickerCount, displayDate,
    } = stickerItem

    doc.setFontSize(16)
    doc.text(`${locName}`, 0.2, 0.35)

    doc.setFontSize(10)
    doc.text(`${stickerIdx} of ${stickerCount}`, 3.8, 0.35, { align: "right" })

    doc.text(`${driver}: ${routeNick}`, 0.2, 0.6)
    doc.text(`Date: ${displayDate}`, 3.8, 0.6, { align: "right" })

    doc.setFontSize(20)
    doc.text(
      `${stickerQty} ${prodNick}` + (prodStickerCount > 1 ? ` (Total ${totalQty}, ${prodIdx} of ${prodStickerCount})` : ''), 
      0.2, 1.1, { align: "left" }
    )

    if (idx < data.length - 1) doc.addPage([2, 4], 'landscape')
  })

  doc.save(`Higuera_Stickers_${R0}.pdf`);

}

const exportHigueraStickers = (R0, R0Orders, R1Orders, LOC, RTE, products) => {
  const stickerData = calculateHigueraStickerData(R0, R0Orders, R1Orders, LOC, RTE, products)
  saveHigueraStickersPdf(stickerData, R0)

}



const useRouteGridData = ({ reportDT, shouldFetch }) => {
  const R0 = reportDT.toFormat('yyyy-MM-dd')
  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false, shouldFetch })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: false, shouldFetch })
  const { data:LOC } = useLocations({ shouldFetch })
  const { data:RTE } = useRoutes({ shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch })

  const products = useMemo(() => !!PRD ? keyBy(PRD, P => P.prodNick) : undefined, [PRD])

  const { data, pradoData, higueraData } = useMemo(() => {
    return calculateGridData(R0Orders, LOC, RTE, products)
  }, [R0Orders, LOC, RTE, products])

  return { 
    products, 
    data,
    pradoData,
    higueraData,
    exportHigueraStickers: () => exportHigueraStickers(R0, R0Orders, R1Orders, LOC, RTE, products),
  }

}

export { useRouteGridData }