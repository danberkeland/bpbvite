import { useListData } from "../../../../data/_listData";
import { useMemo } from "react";
import { flatten, groupBy, orderBy, sortBy } from "lodash";
import { useLocationDetails } from "./locationHooks";
import { applyOverridesForRouteAssignment, getRouteOverridesForAssignment, tempDBAttributeOverrides } from "./_productOverrides";

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const ddbRouteSchedMap = {
  Sun: '1',
  Mon: '2',
  Tue: '3',
  Wed: '4',
  Thu: '5',
  Fri: '6',
  Sat: '7'
}
const pickupZoneNicks = ['slopick', 'atownpick']
const pickupRouteNicks = ['Pick up SLO', 'Pick up Carlton']


/**
 * Read only. For mutating templateProds, call the temlateProd cache directly.
 * Intended for wholesale use; retail items are filtered out.
 * @param {Object} kwargs 
 * @param {string} kwargs.locNick
 * @param {boolean} kwargs.shouldFetch
 * @param {'list'|'dict'} kwargs.format
 * @returns 
 */
export const useCustomizedProducts = ({ 
  locNick, 
  shouldFetch, 
  format='list' 
}) => {
  
  const { data:PRD } = useListData({
    tableName: "Product", shouldFetch
  })
  const { data:PNA } = useListData({ 
    tableName: "ProdsNotAllowed", shouldFetch
  }) 
  const { data:APR } = useListData({ 
    tableName: "AltPricing", shouldFetch
  })   
  const { data:ALT } = useListData({ 
    tableName: "AltLeadTime", shouldFetch
  }) 
  const { data:TPR } = useListData({ 
    tableName: "TemplateProd", shouldFetch
  }) 

  const { data:location } = useLocationDetails({ locNick, shouldFetch })
  const { data:RTE } = useListData({ tableName:"Route", shouldFetch})
  const { data:ZRT } = useListData({ tableName:"ZoneRoute", shouldFetch})

  const composeCustomizedProducts = () => {
    // if (!PRD || !PNA || !APR || !ALT || !TPR || !location || !RTE || !zoneRoutes) {
    if ([PRD, PNA, APR, ALT, TPR, location, RTE, ZRT].some(D => !D)) {
      return undefined
    }

    // convert lists to dictionaries keyed on prodNick
    // each group should have max 1 item.
    //
    // Filtering on front-end means admins wont recscan tables when switching
    // locations. These tables don't contain sensitive data, so fetching it
    // is not much concern. this also makes it easier to use useListData's
    // batch mutators in separate locations without special setup.
    //
    // A more balanced flexible/efficient setup would be to make caches keyed
    // with locNicks, but query by locNick index. This strategy works better as 
    // app activity gets offloaded to users.
    //
    // *** TODO: confirm each group has at most 1 item and submit corrections
    // if duplicates are found (delete all but first item)
    // For now we can sort multiple items newest to oldest so that we tend
    // to mutate the newest item by choosing items[0].
    const [_PNA, _APR, _ALT, _TPR] = [PNA, APR, ALT, TPR].map(items => { 
      const _filtered = items.filter(i => i.locNick === locNick)
      const _sorted = orderBy(_filtered, ['updatedAt'], ['desc'])
      const _grouped = groupBy(_sorted, item => item.prodNick)

      return _grouped
    })
    const routeDict = Object.fromEntries(RTE.map(R => [R.routeNick, R]))


    // **************************
    // Apply initial DB overrides
    // **************************

    const _PRD = PRD.map(product => {
      if (product.prodNick in tempDBAttributeOverrides) {
        return { ...product, ...tempDBAttributeOverrides[product.prodNick] }
      } else return product
    })

    // ***************************
    // Apply standard DB overrides
    // ***************************

    // keeping nested 'items' attribute to match graphQL format, in case 
    // we decide to change query method later.
    // const _projectionWithOverrides = PRD.filter(product => 
    const _projectionWithOverrides = _PRD.filter(product => 
      product.isWhole

    ).map(product => {
      const prodsNotAllowed = { items: _PNA[product.prodNick] ?? [] }
      const altPricing = { items: _APR[product.prodNick] ?? [] }
      const altLeadTime = { items: _ALT[product.prodNick] ?? [] }
      const templateProd = { items: _TPR[product.prodNick]  ?? [] }
      //console.log(product.prodNick, product.packSize)

      return ({
        isWhole: product.isWhole,
        // isRetail: product.isRetail, // often null; use isWhole === false?
        defaultInclude: prodsNotAllowed.items.length
          ? !product.defaultInclude
          : product.defaultInclude,
          // Previous logic does not look at the isAllowed value, rather,
          // it only checks the existence of the record to decide
          // whether or not to negate the product's default rule.
        prodNick: product.prodNick,
        prodName: product.prodName,
        wholePrice: altPricing.items[0]?.wholePrice ?? product.wholePrice,
        readyTime: product.readyTime,
        bakedWhere: product.bakedWhere,
        leadTime: altLeadTime.items[0]?.leadTime ?? product.leadTime,
        daysAvailable: product.daysAvailable,
        packGroup: product.packGroup,
        packSize: product.packSize || 1,
        doughNick: product.doughNick,
        // retailName: product.retailName, // often null; use prodName instead?
        // retailDescrip: product.retailDescrip, // often null
        retailPrice: product.retailPrice,
        squareID: product.squareID,
        prodsNotAllowed,
        altPricing,
        altLeadTime,
        templateProd,
        meta: {
          baseAttributes: {
            defaultInclude: product.defaultInclude,
            wholePrice: product.wholePrice,
            leadTime: product.leadTime,
          },
        }

      })
    }) // End _projectionWithOverrides = _PRD.filter(...

    const _withRoutingOptions = _projectionWithOverrides.map(product => {
      // get part A
      const pickupRouteOptions = Object.fromEntries(
        pickupZoneNicks.map(zoneNick => {
          const locationOverride = {
            locNick: location.locNick,
            zoneNick,
            latestFirstDeliv: 5,
            latestFinalDeliv: 14,
          }
          // const opts = getRouteOptions(({ 
          const opts = getRouteOptionsTest(({ 
            product, 
            location: locationOverride, 
            routeDict, 
            ZRT 
          }))
          return [zoneNick, opts]
        })
      )
      
      // get part B
      const delivRouteOptions = {
        // deliv: getRouteOptions(({ product, location, routeDict, ZRT }))
        deliv: getRouteOptionsTest(({ product, location, routeDict, ZRT }))
      }

      // put parts A & B together
      const routeOptions = { ...pickupRouteOptions, ...delivRouteOptions }

      // console.log(routeOptions)
      // attach to original item.
      return {
        ...product,
        meta: { ...product.meta, routeOptions }
      }
    }) // End _withRoutingOptions = _projectionWithOverrides.map(...

    // console.log(_withRoutingOptions)

    return format === 'list' 
      ? _withRoutingOptions 
        : format === 'dict' 
        ? Object.fromEntries(_withRoutingOptions.map(P => [P.prodNick, P])) 
          : undefined

  } // End composeCustomizedProducts

  const products = useMemo(
    composeCustomizedProducts, 
    [PRD, PNA, APR, ALT, TPR, location, RTE, ZRT, format, locNick]
  )

  return {
    data: products
  }
}


/**
 * routes is a dictionary keyed on routeNick; 
 * ZRT is an array of objects (in database table format)
 * 
 * Returns a weekday array whose items are arrays of options
 */
const getRouteOptions = ({ product, location, routeDict, ZRT }) => { 


  const zoneRoutes = ZRT.filter(zr => zr.zoneNick === location.zoneNick)
  const routeNicks = zoneRoutes.map(zr => zr.routeNick)

  // routes that can move products from one hub to another
  const transferRoutes = Object.values(routeDict).filter(route => 
    route.RouteDepart !== route.RouteArrive
  )
  // console.log(transferRoutes)

  let routeMeta = []
  for (let routeNick of routeNicks) {
    const route = routeDict[routeNick]


    routeMeta = routeMeta.concat(getRoutingMetadata({
      route, product, location, transferRoutes
    }))
  }

  // Make sure dayNum (0-6) corresponds to index
  const routeMetaByWeekday = sortBy(
    Object.values(groupBy(routeMeta, item => item.dayNum)),
    group => group[0].dayNum
  )

  // if a valid option exists, then the valid route with the 
  // shortest lead time (with earliest start if multiple)
  // will occupy the first array position.
  const _sortedMeta = routeMetaByWeekday.map(group => sortBy(
    group, 
    [
      meta => !meta.isValid,
      meta => meta.adjustedLeadTime,
      meta => routeDict[meta.routeNick].routeStart,
    ]
  ))

  return _sortedMeta
  
}

/** returns a weekday array, each day index containing an array of valid
 * route options
 */
const getRoutingMetadata = ({ 
  route:baseRoute, 
  product:baseProduct, 
  location, 
  transferRoutes 

}) => {

  // ***************************************
  // Apply Overrides before Route Assignment
  // ***************************************

  const productOverrides = applyOverridesForRouteAssignment({ 
    product: baseProduct, 
    location, 
    route: baseRoute
  })
  const product = { ...baseProduct, ...productOverrides }

  const routeOverrides = getRouteOverridesForAssignment({
    product: baseProduct, 
    location, 
    route: baseRoute,
  })
  const route = { ...baseRoute, ...routeOverrides }

  let { latestFirstDeliv, latestFinalDeliv } = location
  let { readyTime, bakedWhere, daysAvailable } = product
  let { routeNick, routeStart, routeTime, RouteDepart, RouteSched } = route
  let routeEnd = routeStart + routeTime

  const routeSummary = weekdays.map((day, idx) => {
    const productIsAvailable = daysAvailable
      ? !!daysAvailable[idx]
      : true
    
    const isPickup = pickupRouteNicks.includes(routeNick)
    const routeIsAvailable = RouteSched.includes(ddbRouteSchedMap[day])

    // Testing Customer Availability
    //
    // Old test:      let customerIsOpen = latestFirstDeliv < routeEnd
    //
    // The old test allows for cases where the delivery window doesn't overlap
    // at all with the customer's availability window. Is there a reason for
    // this? Testing with more accurate logic for now -- if we get weird
    // behavior, the following should be an early candidate for debugging.
    //
    // 2023-05-18 Buggy behavior noted with Tooth & Nail.
    // their deliv window is 7:00 to 10:00, but Long North Starts at 10:00
    // old logic would have accepted this. Changing hard inequalities to
    // soft inequalitites for now to address this one case.
    // We may need to reconfigure customer's availability windows.
    const locationIsOpenDuringRoute = productIsAvailable && routeIsAvailable
      ? routeStart <= latestFinalDeliv && latestFirstDeliv <= routeEnd
      : null

    const needTransfer = locationIsOpenDuringRoute
      ? !bakedWhere.includes(RouteDepart)
      : null

    let transferSummary = needTransfer ? [] : null
    if (needTransfer) for (let trRoute of transferRoutes) {
      let transferEnd = trRoute.routeStart + trRoute.routeTime

      const isAvailable = trRoute.RouteSched.includes(ddbRouteSchedMap[day])  
      const connectsHubs = bakedWhere.includes(trRoute.RouteDepart)
        && trRoute.RouteArrive === RouteDepart

      // passing these two conditions is equivalent to 'productCanBeInPlace'
      // for cases where transfer is required.

      // old logic: hard inequality causes items to fail the tranfer check
      // const productReadyBeforeTransfer = readyTime < trRoute.routeStart
      // const transferConnectsBeforeRoute = transferEnd < routeStart
      //   || routeNick === 'Pick up SLO'

      // Experimental logic:
      const productReadyBeforeTransfer = readyTime <= trRoute.routeStart

      // Scrapping this test logic for one that properly tests pickup
      // const transferConnectsBeforeRoute = transferEnd <= routeStart // scrapping the rollover allowance here
      //   || routeNick === 'Pick up SLO' // (see **SPECIAL OVERRIDE** below)
        
      const transferConnectsBeforeRoute = !isPickup // test for delivery
        ? transferEnd <= routeStart
        : null
      const transferConnectsDuringRoute = isPickup  // test for pickup
        ? transferEnd <= routeEnd
        : null


      // const isLate = !productReadyBeforeTransfer || !transferConnectsBeforeRoute
      const onTime = productReadyBeforeTransfer
        && (
          transferConnectsBeforeRoute || transferConnectsDuringRoute
        )

      if (isAvailable && connectsHubs) transferSummary.push({
        routeNick: trRoute.routeNick,
        isLate: !onTime,
        productReadyBeforeTransfer,
        transferConnectsDuringRoute,
        transferConnectsBeforeRoute,
      })
    }

    // **SPECIAL OVERRIDE**
    // Normally, transfer must complete before a 'route' starts
    // because we assume products get loaded on the van when the route starts.
    // With pickup routes, specifically pick up slo, the pick up window
    // starts before transfer completes. But customers can still come in for
    // pickup any time in the pickup window (and can assume customers know what
    // time breads arrive from up north).
    // A more accurate logic would check:
    //  - the pickup interval...
    //  - intersected with the product availability window 
    //    (ie. transfer completion time to EOD)...
    //  - intersected with the pickup customers availability window
    // If there is some overlap of all three, then the product is 
    // valid for pickup.

    // Original route assignment has some hacky logic that handles shelf 
    // products. The expression
    //                    readyTime > latestFinalDeliv
    // is true when readyTime is set very late. However, this assumes
    // the product can be baked and shelved the day before, and a separate
    // decision process is made ensure production steps are timed accordingly.
    // Moreover, this assumes that production for the given product happens
    // every day, so that the item can be made & shelved the previous day.
    //
    // For now the goal is to add a minimal amount of extra logic to our order
    // validation / route assignment, but a more ambitious improvement would be
    // To manage order validation, route assignment, and production coordination
    // all with the same decision-making functions. Our system will be more
    // robust if, for example, the function that says "the lead time on this
    // order is going to need one extra day" and the function that says
    // "let's schedule the bake/shape/etc..." for this item one day earlier
    // are the same function, or are reading from metadata generated by the 
    // same function.
    

    // new Logic that separates delivery timing from production timing.   

    const productReadyBeforeRoute =
      (productIsAvailable && routeIsAvailable && !needTransfer && !isPickup)
        ? product.readyTime < routeStart 
        : null
    const productReadyDuringRoute =
      (productIsAvailable && routeIsAvailable && !needTransfer && isPickup)
        ? product.readyTime < routeEnd 
        : null

    // Old logic that green-lights shelf products
    // (ie ones with readyTime = 15)
    // REVERT TO THIS IF TEST BEHAVIOR DOESN'T WORK

    // const productReadyBeforeRoute = (
    //   productIsAvailable && routeIsAvailable && !needTransfer
    // ) 
    //   ? readyTime < routeStart || readyTime > latestFinalDeliv
    //   : null

    const lateTransferFlag = needTransfer && transferSummary.length
      ? transferSummary.every(trRoute => trRoute.isLate)
      : null

    const isValid = locationIsOpenDuringRoute 
      && (
        needTransfer 
          ? transferSummary.some(trRoute => !trRoute.isLate)
          : (productReadyBeforeRoute || productReadyDuringRoute)
      )

    return ({
      dayNum: idx,
      dayOfWeek: day,
      prodNick: product.prodNick,
      routeNick,
      isValid,
      productIsAvailable,
      routeIsAvailable,
      locationIsOpenDuringRoute,
      needTransfer,
      lateTransferFlag,
      transferSummary,
      productReadyBeforeRoute,
      productReadyDuringRoute,
      route: {
        routeStart,
        routeEnd,
        RouteDepart: route.RouteDepart,
        routeArrive: route.RouteArrive,
        RouteSched: JSON.stringify(RouteSched),
      },
      specialOverrides: {
        product: productOverrides
      }
    })
  }) // end routeSummary

  const routeMetadata = routeSummary.map((summary, idx) => {
    const yesterdaySummary = routeSummary[(idx + 6) % 7]
    
    // **V0** Old logic that only looks for lateness on transfer
    // const allowDelayedDelivery = yesterdaySummary.lateTransferFlag 
    //   && summary.routeIsAvailable

    // **V1** New logic that looks for lateness whether or not
    // transfer is required.
    // const allowDelayedDelivery = summary.routeIsAvailable
    //   && (
    //     yesterdaySummary.lateTransferFlag 
    //     || yesterdaySummary.productReadyBeforeRoute === false 
    //     // (as opposed to null which means tests failed at an earlier point)
    //   )

    // **V2** new logic allows delayed delivery...
    //   -- only if the route is not valid for the current day
    //   -- if the route for the previous day is invalid for any reason, 
    //      as long as the product was made the prior day.
    //
    // WARNING: we are assuming that delayed delivery 
    // is a viable fallback strategy in all cases!! (That is, we assume
    // there is never a second delay in the delivery process)
    const allowDelayedDelivery = !summary.isValid
      && summary.routeIsAvailable
      && yesterdaySummary.productIsAvailable
      && !yesterdaySummary.isValid

    const adjustedIsValid = summary.isValid || allowDelayedDelivery 

    const adjustedLeadTime = allowDelayedDelivery
      ? product.leadTime + 1
      : product.leadTime
    
    const { daysAvailable } = product
    const adjustedDaysAvailable = daysAvailable 
      ? allowDelayedDelivery
        ? daysAvailable.slice(7 - 1, 7).concat(daysAvailable.slice(0, 7 - 1))
        : daysAvailable
      : [1, 1, 1, 1, 1, 1, 1]

    return ({
      ...summary,
      isValid: adjustedIsValid,
      allowDelayedDelivery,
      adjustedLeadTime,
      adjustedDaysAvailable,
    })

  })

  return routeMetadata

}

/**
 * remove invalid products before calling into the ordering page 
 * FUTURE: allow all products if authClass === 'bpbfull'?
 *   Should be implemented along with lots of warning messages.
*/
export const useProductSelectionList = ({ locNick, shouldFetch }) => {
  const { data:products } = useCustomizedProducts({ locNick, shouldFetch })

  const composeList = () => {
    if (!products) return undefined
    return products.filter(product => 
      product.isWhole && product.defaultInclude  
    )
  }

  return { data: useMemo(composeList, [products]) }

}












/**
 * routes is a dictionary keyed on routeNick; 
 * ZRT is an array of objects (in database table format)
 * 
 * Returns a weekday array whose items are arrays of options
 */
const getRouteOptionsTest = ({ product, location, routeDict, ZRT }) => { 


  const zoneRoutes = ZRT.filter(zr => zr.zoneNick === location.zoneNick)
  const routeNicks = zoneRoutes.map(zr => zr.routeNick)

  // routes that can move products from one hub to another
  const transferRoutes = Object.values(routeDict).filter(route => 
    route.RouteDepart !== route.RouteArrive
  )
  // console.log(transferRoutes)


  // const route = routeDict[routeNick]
  const routes = routeNicks.map(rn => routeDict[rn])

  // get all "1st round" summaries for all [routes]X[weekdays]
  const _routeSummaries = routes.map(route => getRoutingMetadataTest({
    route, product, location, transferRoutes
  }))

  // Group routes by day of week, make sure weekday groups 
  // are in Sun-Sat (0-6) order.
  const routeSummaries = sortBy(
    Object.values(groupBy(flatten(_routeSummaries), item => item.dayNum)),
    group => group[0].dayNum
  )

  // get all "2nd round" summaries that make adjustments for delayed delivery.
  // Iterating over route summaries grouped by weekday lets us read all
  // routes tested on the previous day.
  // const adjustedRouteSummaries = routeSummaries.map(summary => 
  //   adjustSummaries(routeSummaries, product)
  // )
  const adjustedRouteSummaries = adjustSummaries(routeSummaries, product)

  //console.log(routeSummaries)

  const _assignedBySorting = adjustedRouteSummaries.map(group => sortBy(
    group, 
    [
      meta => !meta.isValid,
      meta => meta.adjustedLeadTime,
      meta => routeDict[meta.routeNick].routeStart,
    ]
  ))

  return _assignedBySorting



  // Make sure dayNum (0-6) corresponds to index
  // const routeMetaByWeekday = sortBy(
  //   Object.values(groupBy(routeMeta, item => item.dayNum)),
  //   group => group[0].dayNum
  // )

  // if a valid option exists, then the valid route with the 
  // shortest lead time (with earliest start if multiple)
  // will occupy the first array position.
  // const _sortedMeta = routeMetaByWeekday.map(group => sortBy(
  //   group, 
  //   [
  //     meta => !meta.isValid,
  //     meta => meta.adjustedLeadTime,
  //     meta => routeDict[meta.routeNick].routeStart,
  //   ]
  // ))

  // return _sortedMeta
  
}

/** 
 * Testing different iteration order to allow 
 * reading all route summaries for the previous day.
 */
const getRoutingMetadataTest = ({ 
  route:baseRoute, 
  product:baseProduct, 
  location, 
  transferRoutes 

}) => {

  // ***************************************
  // Apply Overrides before Route Assignment
  // ***************************************


  const productOverrides = applyOverridesForRouteAssignment({ 
    product: baseProduct, 
    location, 
    route: baseRoute
  })
  const product = { ...baseProduct, ...productOverrides }

  const routeOverrides = getRouteOverridesForAssignment({
    product: baseProduct, 
    location, 
    route: baseRoute,
  })
  const route = { ...baseRoute, ...routeOverrides }

  let { latestFirstDeliv, latestFinalDeliv } = location
  let { readyTime, bakedWhere, daysAvailable } = product
  let { routeNick, routeStart, routeTime, RouteDepart, RouteSched } = route
  let routeEnd = routeStart + routeTime

  const routeSummary = weekdays.map((day, idx) => {
    const productIsAvailable = daysAvailable
      ? !!daysAvailable[idx]
      : true
    
    const isPickup = pickupRouteNicks.includes(routeNick)
    const routeIsAvailable = RouteSched.includes(ddbRouteSchedMap[day])

    const locationIsOpenDuringRoute = productIsAvailable && routeIsAvailable
      ? routeStart <= latestFinalDeliv && latestFirstDeliv <= routeEnd
      : null

    const needTransfer = locationIsOpenDuringRoute
      ? !bakedWhere.includes(RouteDepart)
      : null

    let transferSummary = needTransfer ? [] : null
    if (needTransfer) for (let trRoute of transferRoutes) {
      let transferEnd = trRoute.routeStart + trRoute.routeTime

      const isAvailable = trRoute.RouteSched.includes(ddbRouteSchedMap[day])  
      const connectsHubs = bakedWhere.includes(trRoute.RouteDepart)
        && trRoute.RouteArrive === RouteDepart

      const productReadyBeforeTransfer = readyTime <= trRoute.routeStart

      const transferConnectsBeforeRoute = !isPickup // (i.e. for deliveries)
        ? transferEnd <= routeStart
        : null
      const transferConnectsDuringRoute = isPickup
        ? transferEnd <= routeEnd
        : null


      const onTime = productReadyBeforeTransfer
        && (
          transferConnectsBeforeRoute || transferConnectsDuringRoute
        )

      if (isAvailable && connectsHubs) transferSummary.push({
        routeNick: trRoute.routeNick,
        isLate: !onTime,
        productReadyBeforeTransfer,
        transferConnectsDuringRoute,
        transferConnectsBeforeRoute,
      })
    }

    // Test for deliveries:
    const productReadyBeforeRoute =
      (productIsAvailable && routeIsAvailable && !needTransfer && !isPickup)
        ? product.readyTime < routeStart 
        : null
    // Test for pickup options:
    const productReadyDuringRoute =
      (productIsAvailable && routeIsAvailable && !needTransfer && isPickup)
        ? product.readyTime < routeEnd 
        : null


    const lateTransferFlag = needTransfer && transferSummary.length
      ? transferSummary.every(trRoute => trRoute.isLate)
      : null

    const isValid = locationIsOpenDuringRoute 
      && (
        needTransfer 
          ? transferSummary.some(trRoute => !trRoute.isLate)
          : (productReadyBeforeRoute || productReadyDuringRoute)
      )

    return ({
      dayNum: idx,
      dayOfWeek: day,
      prodNick: product.prodNick,
      routeNick,
      isValid,
      productIsAvailable,
      routeIsAvailable,
      locationIsOpenDuringRoute,
      needTransfer,
      lateTransferFlag,
      transferSummary,
      productReadyBeforeRoute,
      productReadyDuringRoute,
      route: {
        routeStart,
        routeEnd,
        RouteDepart: route.RouteDepart,
        routeArrive: route.RouteArrive,
        RouteSched: JSON.stringify(RouteSched),
      },
      specialOverrides: {
        product: productOverrides
      }
    })
  }) // end routeSummary

  return routeSummary

  // const routeMetadata = routeSummary.map((summary, idx) => {
  //   const yesterdaySummary = routeSummary[(idx + 6) % 7]
    
  //   const allowDelayedDelivery = !summary.isValid
  //     && summary.routeIsAvailable
  //     && yesterdaySummary.productIsAvailable
  //     && !yesterdaySummary.isValid

  //   const adjustedIsValid = summary.isValid || allowDelayedDelivery 

  //   const adjustedLeadTime = allowDelayedDelivery
  //     ? product.leadTime + 1
  //     : product.leadTime
    
  //   const { daysAvailable } = product
  //   const adjustedDaysAvailable = daysAvailable 
  //     ? allowDelayedDelivery
  //       ? daysAvailable.slice(7 - 1, 7).concat(daysAvailable.slice(0, 7 - 1))
  //       : daysAvailable
  //     : [1, 1, 1, 1, 1, 1, 1]

  //   return ({
  //     ...summary,
  //     isValid: adjustedIsValid,
  //     allowDelayedDelivery,
  //     adjustedLeadTime,
  //     adjustedDaysAvailable,
  //   })

  // })

  // return routeMetadata

}

const adjustSummaries = (routeSummaries, product) => {
 
  let adjustedRouteSummaries = []
  for (let i = 0; i < 7; i++) {
    const summaryWeekdayGroup = routeSummaries[i]

    let adjustedWeekdayGroup = []
    for (let summary of summaryWeekdayGroup) {
      const yesterdaySummaryGroup = routeSummaries[(i + 6) % 7]

      const allowDelayedDelivery = !summary.isValid
        && summary.routeIsAvailable
        && yesterdaySummaryGroup.every(yesterdaySummary => 
          yesterdaySummary.productIsAvailable && !yesterdaySummary.isValid
        )

      const adjustedIsValid = summary.isValid || allowDelayedDelivery 
      const adjustedLeadTime = allowDelayedDelivery
        ? product.leadTime + 1
        : product.leadTime

      const { daysAvailable } = product
      const adjustedDaysAvailable = daysAvailable 
        ? allowDelayedDelivery
          ? daysAvailable.slice(7 - 1, 7).concat(daysAvailable.slice(0, 7 - 1))
          : daysAvailable
        : [1, 1, 1, 1, 1, 1, 1]
      
        adjustedWeekdayGroup.push({
        ...summary,
        isValid: adjustedIsValid,
        allowDelayedDelivery,
        adjustedLeadTime,
        adjustedDaysAvailable,
      })

    }

    adjustedRouteSummaries.push(adjustedWeekdayGroup)

  }

  return adjustedRouteSummaries

}