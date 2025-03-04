import { preDBOverrides, postDBOverrides } from "../../../data/product/testOverrides.js"
import { getOverrideProps } from "../../../data/locationProductOverride/overrideProduct.jsx"
import { mapValues } from "../../../utils/objectFns.js"
import { DT, IsoDate } from "../../../utils/dateTimeFns.js"
import { DBOrder, DBStanding } from "../../../data/types.d.jsx"
import { PICKUP_ZONES, WEEKDAYS_EEE, WEEKDAYS_NUM } from "../../../constants/constants.jsx"
import { reformatProdName } from "../utils/reformatProdName.js"
import { groupByObjectRdc, keyBy } from "../../../utils/collectionFns.js"
import { combineOrders } from "../../../core/production/combineOrders.jsx"


const getSelectedDateList = (delivDtBegin, delivDtEnd, orderDT) => {
  const ddFirst = delivDtBegin
  const ddLast = delivDtEnd ?? delivDtBegin
  const nDays = ddLast.diff(ddFirst, "days").days + 1

  let dateTimes = [delivDtBegin]
  for (let i = 1; i < nDays; ++i) {
    dateTimes.push(ddFirst.plus({ days: i}))
  } 

  return dateTimes.map(dt => ({
    DT: dt,
    JS: dt.toJSDate(),
    iso: dt.toFormat('yyyy-MM-dd'),
    wdEEE: dt.toFormat('EEE'),
    wdNum: dt.weekday % 7,
    relDate: dt.diff(orderDT, 'days').days || orderDT.diff(dt, 'days').days * -1
  }))
}

const addMetadataToLocation = (location, getServingRoutes) => {
  
  const defaultFulfillment = location.dfFulfill ?? (
    PICKUP_ZONES.includes(location.zoneNick) ? location.zoneNick : 'deliv'
  )

  const servingRoutes = getServingRoutes(location)
  const validDaysByFflOpt = {
    deliv: WEEKDAYS_NUM.map(wd => servingRoutes.some(rte =>
      rte.validDays[wd] === true
    )),
    slopick: [true, true, true, true, true, true, true],
    atownpick: [true, true, true, true, true, true, true]
  }
  
  return {
    ...location,
    meta: { 
      deliveryEnabled: !PICKUP_ZONES.includes(location.zoneNick),
      defaultFulfillment,
      servingRoutes,
      validDaysByFflOpt,
    }
    
  }

}

const calculateCustomizedProducts = (location, PRD, OVR, getOptions) => {
  let customizedProducts

  customizedProducts = PRD
    .map(P => ({
      ...P,
      ...(preDBOverrides[P.prodNick] ?? {}),
      ...getOverrideProps(OVR.find(ovr => ovr.prodNick === P.prodNick)),
      ...(postDBOverrides[`${location.locNick}#${P.prodNick}`] ?? {}),
    }))
    .map(P => ({ 
      ...P, 
      daysAvailable: P.daysAvailable ?? [1, 1, 1, 1, 1, 1, 1]
    }))
    .filter(P => P.isWhole)
  
  customizedProducts = customizedProducts
    .map(P => {
      const routeOptions = Object.fromEntries(
        WEEKDAYS_EEE.map(wdEEE => [wdEEE, getOptions(location, P, wdEEE)])
      )

    return {
      ...P,
      meta: { 
        routeOptions,
        // isFav: TMP.some(tmp => tmp.prodNick === P.prodNick),
        // fav: TMP.find(tmp => tmp.prodNick === P.prodNick) ?? null,
        reformattedProdName: reformatProdName(P.prodName, P.packSize),
      }
    }

  })

  customizedProducts = keyBy(customizedProducts, P => P.prodNick)
  
  return customizedProducts
  

}


const calculateCalendarSummary = (ORD, STN, isWhole) => {

  /** @type {Object.<string, DBStanding[]>} */
  const standingByDayOfWeek = 
    STN.filter(stn => stn.isWhole === isWhole && stn.isStand === true)
      .reduce(groupByObjectRdc(stn => stn.dayOfWeek), {})

  const dayOfWeekSummary = mapValues(
    standingByDayOfWeek,
    standingGroup => standingGroup.some(stn => stn.qty !== 0)
  )


  /** @type {Object.<string, DBOrder[]>} */
  const ordersByDate = 
    ORD.filter(ord => ord.isWhole === isWhole)
      .reduce(groupByObjectRdc(ord => ord.delivDate), {})

  const dateSummaryEntries = Object.keys(ordersByDate)
    .map(delivDate => {
      const dayOfWeek = IsoDate.toWeekdayEEE(delivDate)
      const standings = standingByDayOfWeek[dayOfWeek] ?? []
      const orders    = ordersByDate[delivDate]
      const cmbOrders = combineOrders(orders, standings, [delivDate])

      console.log("orders", orders, "standing", standings)

      const hasCartEdit = orders.some(order =>
        order.updatedBy !== 'standing_order'
          && !standings.some(standing => 
            standing.prodNick === order.prodNick && standing.qty === order.qty
          )  
      )

      const isDeleted = cmbOrders.length > 0 && cmbOrders.every(item => 
        item.Type === "Orders"
        && item.qty === 0
      )

      const todayDT = DT.today()
      const isDeletedToday = isDeleted && cmbOrders.every(item => 
          DT.fromIsoTs(item.qtyUpdatedOn).startOf('day') === todayDT
        )

      return [delivDate, { isDeletedToday, isDeleted, hasCartEdit }]
    })

  return {
    dates: Object.fromEntries(dateSummaryEntries),
    days: dayOfWeekSummary
  }
}

// const getCartItemMeta = (cartItem, product, user, dateProps) => {
//   const { isDelivDate, isPastDeliv, ORDER_DATE_DT } = dateProps

//   const { prodNick, baseQty, qty, qtyUpdatedOn, sameDayMaxQty } = cartItem
//   const { 
//     inProd, 
//     isValid, 
//     //isAvailable 
//   } = product.meta.assignedRouteSummary
  
//     const timingStatus = isPastDeliv ? 'past' 
//       : isDelivDate ? 'deliv' 
//       : inProd ? 'prod' 
//       : '' 
//     const sameDayUpdate = 
//       getWorkingDateTime(qtyUpdatedOn).toMillis() === ORDER_DATE_DT.toMillis()
    

//     const maxQty = inProd 
//       ? (sameDayUpdate ? sameDayMaxQty : baseQty)
//       : 999
    
//     const qtyChanged = qty !== baseQty
//     const disableInput = (user.authClass === 'bpbfull' && isPastDeliv)
//       || (user.authClass !== 'bpbfull' && (isDelivDate || isPastDeliv))
//       || (user.authClass !== 'bpbfull' && maxQty === 0)
//       || (user.authClass !== 'bpbfull' && !product.defaultInclude)
    
//     const meta = { 
//       timingStatus, 
//       sameDayUpdate, 
//       maxQty, 
//       qtyChanged, 
//       disableInput,
//       routeIsValid: isValid,
//       productIsInProd: inProd,
//     } 
    
//     return [prodNick, meta] 

// }

export {
  getSelectedDateList,
  addMetadataToLocation,
  calculateCustomizedProducts,
  calculateCalendarSummary,
}