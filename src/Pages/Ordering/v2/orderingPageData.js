import { useMemo } from "react"
import { useLocation, useLocations } from "../../../data/location/useLocations.ts"
import { Data } from "../../../utils/dataFns.js"
import { useLoadedGetRouteOptions, useLoadedGetServingRoutes } from "../../../data/routing/useRouting.js"
import { useProducts } from "../../../data/product/useProducts.js"
import { useLocationProductOverridesByLocNick } from "../../../data/locationProductOverride/useLocationProductOverrides.js"

import { useOrdersByLocNick } from "../../../data/order/useOrders.js"
import { useStandingsByLocNick } from "../../../data/standing/useStandings.js"
import { combineOrders } from "../../../data/cartOrder/combineOrders.js"
import { constructCartItem, constructCartOrder } from "../../../data/cartOrder/cartOrders.js"
import { useTemplateProdsByLocNick } from "../../../data/templateProd/useTemplateProd.js"
import { addMetadataToLocation, calculateCalendarSummary, calculateCustomizedProducts } from "./orderingPageCalcs.js"
import { DateObj, OrderingUser } from "./orderingTypes.d.js"
import { DateTime } from "luxon"

// Optimize queries a bit by reducing fields returned.
// Don't call useLocations or useProducts elsewhere in the ordering page.

const locationFields = [
  "locNick", 
  "locName", 
  "latestFirstDeliv",
  "latestFinalDeliv",
  "zoneNick",
  "dfFulfill",
]

const productFields = [
  "prodNick",
  "prodName",

  "packSize",
  "packGroup",
  "doughNick",
  "defaultInclude",

  "isWhole",
  "wholePrice",
  "descrip",

  "isRetail",
  "retailPrice",
  "retailDescrip",

  "bakedWhere",
  "daysAvailable",
  "leadTime",
  "readyTime",
]

/**
 * Monolitic data hook to call once at top level and pass down as props.
 * Should help avoid redundant calculation and memoization.
 * @param {OrderingUser} user
 * @param {string} locNick
 * @param {DateTime} orderDT - the current ordering date with cutoff rules applied.
 * @param {DateObj[]} selectedDates
 * @param {boolean} isWhole
 */
const useOrderingPageData = (
  user,
  locNick, // should point to the selected locNick or fall back to the user's locNick. 
  orderDT,
  selectedDates,
  isWhole, // may need to add other page state args for retail tab
) => {
  
  const getServingRoutes = useLoadedGetServingRoutes({ shouldFetch: true })
  const getOptions = useLoadedGetRouteOptions({ shouldFetch: true })
  
  const isAdmin = user.authClass === 'bpbfull'
  const { data:loc } = useLocation({ 
    locNick: user.locNick, 
    shouldFetch: !isAdmin 
  })
  const { data:LOC } = useLocations({ 
    shouldFetch: isAdmin, 
    projection: locationFields 
  })

  const locations = useMemo(() => {
    return (isAdmin && !!LOC) ? Data.orderBy(LOC, [L => L.locName], ["asc"])
      : !!loc ? [loc] 
      : undefined
  }, [loc, LOC, isAdmin])

  const location = useMemo(() => {
    if (!locNick || !locations || !getServingRoutes) return undefined
    const _loc = locations.find(L => L.locNick === locNick)
    return !!_loc 
      ? addMetadataToLocation(_loc, getServingRoutes)
      : undefined 

  }, [locNick, locations, getServingRoutes])

  
  const fetchByLocArgs = { shouldFetch: !!location, locNick: location?.locNick }
  const { data:PRD } = useProducts({ shouldFetch: true, projection: productFields })
  const { data:OVR } = useLocationProductOverridesByLocNick(fetchByLocArgs)
  const { data:TMP } = useTemplateProdsByLocNick(fetchByLocArgs)

  const { data:ORD } = useOrdersByLocNick(fetchByLocArgs)
  const { data:STN } = useStandingsByLocNick(fetchByLocArgs)
  

  const products = useMemo(() => {
    if (!location || !PRD || !OVR || !getOptions) return undefined
    return calculateCustomizedProducts(location, PRD, OVR, getOptions)

  }, [location, PRD, OVR, getOptions])

  const cartOrders = useMemo(() => {
    if (!selectedDates || !location || !getOptions || !products || !ORD || !STN) {
      return undefined
    }

    return selectedDates.map((D, idx) => {

      // shoehorning this in so that we can hold the original standing qty
      // in item metadata.
      const _ORD = ORD.filter(ord => ord.delivDate === D.iso)
      const _STN = STN.filter(stn => stn.dayOfWeek === D.wdEEE)
      
      const cmbOrders = combineOrders(_ORD, _STN, [D.iso])
      const cartOrder = constructCartOrder(cmbOrders, location, D.iso)

      const header = { 
        ...cartOrder.header, 
        meta: { idx }
      }
      const items = [...cartOrder.items].map((item, itemIdx) => {
        // const routeOptions = products[item.prodNick].meta.routeOptions[D.wdEEE]
        const standingQty = 
          _STN.find(stn => stn.prodNick === item.prodNick)?.qty ?? null
        
        const meta = { 
          ...item.meta, 
          // routeOptions, 
          idx: itemIdx,
          standingQty,
        }

        return { 
          ...item,
          rate: item.rate ?? products[item.prodNick].wholePrice, 
          meta 
        }
  
      })

      return { header, items }
    })

  }, [
    selectedDates, 
    location, 
    products, 
    getOptions, 
    ORD, 
    STN
  ])



  /** 
   * @param {any} product -- assumed to have a meta attribute with routingOptions attached.
   * @param {string} fflOption 
   * @param {DateTime} orderDT 
   * @param {DateObj} selectedDate 
   */
  const getProductInfo = (product, fflOption, orderDT, selectedDate) => {
    const orderLeadTime = selectedDate.DT.diff(orderDT, 'days')?.days
      || orderDT.diff(selectedDate.DT, 'days')?.days

    const assignedRoute = 
      product.meta.routeOptions[selectedDate.wdEEE][fflOption][0] ?? null

    // const bakeRelDate = assignedRoute?.steps[0].end.relDate ?? null
    // const bakeDT = orderDT.minus({ days: bakeRelDate * -1 })
    // const bakeWdNum = bakeDT.weekday % 7
    // const availableOnFinishDay = 
    //   product.daysAvailable === null || !!product.daysAvailable[bakeWdNum]
    
    const routeServes = !!assignedRoute
    const routeError = routeServes ? assignedRoute.error : null
    const routeIsValid = routeServes && assignedRoute.error === null

    const fflLeadTime = routeIsValid ? assignedRoute.steps[0].end.relDate * -1 : 0
    const effectiveLeadTime = product.leadTime + fflLeadTime
    const inProduction = orderLeadTime < effectiveLeadTime


    return {
      assignedRoute,
      // bakeRelDate,
      // availableOnFinishDay,
      routeServes,       // there is a route serving the target zone
      routeIsValid,      // there is a serving route without errors
      routeError,  
      orderLeadTime,
      effectiveLeadTime, // production lead time + fulfillment lead time
      inProduction,      // order is inside the production window

    }

  }

  const productInfo = useMemo(() => {
    if (!selectedDates || !orderDT || !products || !cartOrders) return undefined

    const pKeys = Object.keys(products)
    
    const infoEntries = pKeys.map(prodNick => [
      prodNick,
      selectedDates.map((selectedDate, idx) => 
        getProductInfo(
          products[prodNick],
          cartOrders[idx].header.route,
          orderDT,
          selectedDate,
        )
      )
    ])
    return Object.fromEntries(infoEntries)

  }, [selectedDates, orderDT, products, cartOrders])


  const templateOrderItems = useMemo(() => {
    if (!location || !products || !TMP) return undefined
    return TMP.map(tmp => constructCartItem(
      "Template",
      tmp.prodNick,
      products[tmp.prodNick].wholePrice,
      { 
        ...products[tmp.prodNick].meta, 
        idx: null 
      },
    ))

  }, [location, products, TMP])



  const calendarSummary = useMemo(() => {
    if (!ORD || !STN) return undefined
    return calculateCalendarSummary(ORD, STN, isWhole)

  }, [ORD, STN, isWhole])


  return {
    locations,
    location,
    products,
    productInfo,
    cartOrders,
    templateOrderItems,
    calendarSummary,
    standing: STN,
  }

}

export { useOrderingPageData }






