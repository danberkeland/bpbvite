import { useMemo } from "react"
import { useProdOrdersByDate } from "../../../data/useT0T7ProdOrders"
import { keyBy } from "lodash"
import { useProducts } from "../../../data/product/useProducts"
import { useLocations } from "../../../data/location/useLocations"
import { useRoutes } from "../../../data/route/useRoutes"

import { DBProduct } from "../../../data/types.d"
import { compareBy } from "../../../utils/collectionFns/compareBy"
import { groupByArrayRdc } from "../../../utils/collectionFns/groupByArrayRdc"

import jsPDF from "jspdf"
import "jspdf-autotable"
import { DateTime } from "luxon"
import { DT } from "../../../utils/dateTimeFns"
import { divyUp } from "../../../utils/divyUp"

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


// /**
//  * Related to integer division. Splits {nItems} items 
//  * as equally as possible into {nParts} parts.
//  * @example ```
//  * divyUp(10, 3) // [4, 3, 3]
//  * ```
//  * @param {number} nItems 
//  * @param {number} nParts 
//  * @returns {number[]}
//  */
// function divyUp(nItems, nParts) {
//   if (!(nParts > 0)) return []

//   const quotient  = Math.floor(nItems / nParts)
//   const remainder = nItems % nParts

//   return (new Array(nParts))
//     .fill(quotient)
//     .map((q, idx) => idx < remainder ? q+1 : q)

// }

const isHigueraPackProduct = (/** @type {DBProduct} */ product) => 1
  && product.doughNick !== "French"
  && ['rustic breads', 'retail', 'focaccia'].includes(product.packGroup)


// /**
//  * console.log function that can be inserted into an array method pipeline. 
//  * Intended to be called with forEach.
//  */
// function feLog(...messages) {
//   return (_, i, array) => { if (i === 0) { console.log(...messages, array) } }
// }

/**
 * 
 * @param {Object} input
 * @param {DateTime} input.reportDT
 * @param {boolean} input.shouldFetch 
 * @returns 
 */
export const useHigueraStickers = ({ reportDT, shouldFetch }) => {

  const T0 = reportDT.toFormat('yyyy-MM-dd')
  const T1 = reportDT.plus({ days: 1 }).toFormat('yyyy-MM-dd')

  const { data:T0Orders } = useProdOrdersByDate({ reportDate: T0, shouldFetch })
  const { data:T1Orders } = useProdOrdersByDate({ reportDate: T1, shouldFetch })
  const { data:RTE } = useRoutes({ shouldFetch })
  const { data:LOC } = useLocations({ shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch })

  const calculateHigueraStickers = () => {
    if (!T0Orders || !T1Orders || !RTE || !LOC || !PRD) return undefined

    const locations = keyBy(LOC, 'locNick')
    const products = keyBy(PRD, 'prodNick')
    const routes = keyBy(RTE, 'routeNick')

    // const ordersPackedToday = T0Orders.filter(order => order.routeMeta)

    console.log("ORDERS:SERAWSR", T0Orders)

    const T1StickerOrders = T1Orders.filter(order => 1
      && order.isStand !== false 
      && order.qty !== 0 
      && (order.delivDate === T1 && order.delivLeadTime === 1 && !['hfoc', 'foc'].includes(order.prodNick))
      && isHigueraPackProduct(products[order.prodNick])
      && !['whole', 'slonat', 'backporch', 'bpbextras', 'bpbkit'].includes(order.locNick)
      && !['Pick up Carlton'].includes(order.routeMeta.routeNick)
    )

    const T0StickerOrders = T0Orders.filter(order => 1
      && order.isStand !== false 
      && order.qty !== 0 
      && ((order.delivDate === T0 && order.delivLeadTime === 0) || ['hfoc', 'foc'].includes(order.prodNick))
      && isHigueraPackProduct(products[order.prodNick])
      && !['whole', 'slonat', 'backporch', 'bpbextras', 'bpbkit'].includes(order.locNick)
      && !['Pick up Carlton'].includes(order.routeMeta.routeNick)
    )

    return [...T1StickerOrders, ...T0StickerOrders]
      .map(order => {
        const nPerBag = stickerInfo.find(S => S.prodNick === order.prodNick)?.nPerBag ?? 0
        const nBags = nPerBag > 0 ? Math.ceil(order.qty / nPerBag) : 0

        const isToday = order.delivDate === T0

        const displayDate = isToday
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
          routeNick:   order.routeMeta.routeNick ?? "N/A",
          driver:      routes[order.routeMeta.routeNick]?.driver ?? "N/A",
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
      // .forEach(feLog("TEST:"))
      .reduce(groupByArrayRdc(order => order.locNick), [])
      .flatMap(orderStickerGroup => {
        
        return orderStickerGroup.map((stickerItem, idx) => ({
          ...stickerItem,
          stickerIdx: idx + 1,
          stickerCount: orderStickerGroup.length
        }))
      })

  }

  const exportHigueraStickers = (stickerData) => {
    if (!stickerData || !T0Orders || !T1Orders || !RTE || !LOC || !PRD) return undefined

    const doc = new jsPDF({ format: [2, 4], unit: "in", orientation: "l" })
    
    stickerData.forEach((stickerItem, idx, data) => {

      const { 
        driver, 
        routeNick, 
        locName,
        prodNick,
        totalQty,
        prodIdx,
        prodStickerCount,
        stickerQty, 
        stickerIdx, 
        stickerCount,
        displayDate,
      } = stickerItem

      doc.setFontSize(16)
      doc.text(`${locName}`, 0.2, 0.35)

      doc.setFontSize(10)
      doc.text(`${stickerIdx} of ${stickerCount}`, 3.8, 0.35, { align: "right" })

      doc.text(`${driver}: ${routeNick}`, 0.2, 0.6)
      doc.text(`Date: ${displayDate}`, 3.8, 0.6, { align: "right" })

      doc.setFontSize(20)
      doc.text([
        `${stickerQty} ${prodNick}` + (prodStickerCount > 1 ? ` (Total ${totalQty}, ${prodIdx} of ${prodStickerCount})` : ''),
      ], 0.2, 1.1, { align: "left" })

      if (idx < data.length - 1) doc.addPage([2, 4], 'landscape')
    })

    doc.save(`higuera_stickers_${T0}.pdf`);

  }

  return { 
    data: useMemo(calculateHigueraStickers, [T0, T1, T0Orders, T1Orders, RTE, LOC, PRD]),
    exportHigueraStickers,
  }

}