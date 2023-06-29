import { useListData } from "../../../../data/_listData";
import { useEffect, useMemo } from "react";
import { 
  dateToYyyymmdd, 
  getWorkingDateTime 
} from "../../../../functions/dateAndTime";
import { groupBy, orderBy, sortBy, uniqBy } from "lodash";
import { useCustomizedProducts } from "./productHooks";
import { useLocationDetails } from "./locationHooks";

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * Primitive hook used to build other Ordering Page hooks.
 * Call mutate from here to update client properly
 */
export const useCartDataByLocation = ({ locNick, shouldFetch }) => {
  const { 
    data, 
    submitMutations, 
    updateLocalData, 
    ...otherSWRReturns 
  } = useListData({ 
    tableName: "Order",
    customQuery: "orderByLocByDelivDate",
    variables: { locNick: locNick, limit: 5000 },
    shouldFetch,
  })

  useEffect(() => {
    if (!data) return

    // console.log('validating cart...')
    // if duplicates exist, keep the most recently updated record
    const _sorted = orderBy(data, ['updatedOn'], ['desc'])
    const _byDateByProduct = groupBy(_sorted, item => 
      `${item.delivDate}#${item.prodNick}`
    )
  
    let deleteInputs = []
    for (let group of Object.values(_byDateByProduct)) {
      deleteInputs = deleteInputs.concat(
        group.slice(1).map(item => ({ id: item.id }))
      )
    }

    if (deleteInputs.length) {
      console.log('Duplicates to delete:', deleteInputs)
      // updateLocalData(
      //   submitMutations({ deleteInputs })
      // )
    }
  }, [data]) // end useEffect

  return {
    data,
    submitMutations,
    updateLocalData,
    ...otherSWRReturns,
  }

}

/**
 * Primitive hook used to build other Ordering Page hooks.
 * Call mutate from here to update client properly
 */
export const useStandingDataByLocation = ({ locNick, shouldFetch }) => {
  const { 
    data, 
    submitMutations, 
    updateLocalData, 
    ...otherSWRReturns 
  } = useListData({ 
    tableName: "Standing",
    customQuery: "standingByLocByDayOfWeek",
    variables: { locNick: locNick, limit: 5000 },
    shouldFetch,
  })

  useEffect(() => {
    if (!data) return

    const executeDelete = async (inputs) => {
      updateLocalData(
        await submitMutations({ deleteInputs: inputs})
      )
    }

    // *** Detect Duplicates ***
    // console.log('validating standing...')
    // if duplicates exist, keep the most recently updated record
    const _sorted = orderBy(data, ['updatedOn'], ['desc'])
    const _byWeekdayByProductByType = groupBy(_sorted, item => 
      `${item.dayOfWeek}#${item.prodNick}#${item.isStand}#${item.isWhole}`
    )
  
    let deleteInputs = []
    for (let group of Object.values(_byWeekdayByProductByType)) {
      deleteInputs = deleteInputs.concat(
        group.slice(1).map(item => ({ id: item.id }))
      )
    }

    if (deleteInputs.length) {
      console.log('Duplicates to delete:', deleteInputs)
      // executeDelete
    }

    // *** Detect 0 qty records ***
    const zeroQtyItems = data.filter(item => item.qty === 0)
    // const zeroQtyDeleteInputs = zeroQtyItems.map(item => ({ id: item.id })) 

    if (zeroQtyItems.length) {
      console.log("Found zero qty items:", zeroQtyItems)
      // executeDelete(zeroQtyDeleteInputs)
      // console.log("Cleared zeroes.")
    }

  }, [data, submitMutations, updateLocalData]) // end useEffect

  return {
    data,
    submitMutations,
    updateLocalData,
    ...otherSWRReturns,
  }

}

/**Read-Only hook. 
 * 
 * Mutate cart data from 'useCartDataByLocation'.
 * 
 * Mutate standing data from 'useStandingDataByLocation'.
*/
export const useOrderCalendarSummary = ({ locNick, shouldFetch }) => {
  const { data:cart } = useCartDataByLocation({ locNick, shouldFetch })
  const { data:standing } = useStandingDataByLocation({ locNick, shouldFetch })
  
  const composeSummary = () => {
    if (!cart || !standing) return undefined

    let _cart = cart.map(order => {
      const [year, month, day] = order.delivDate.split('-').map(s => Number(s))
      const delivDateJS = new Date(year, month - 1, day, 0, 0, 0)
      const dayOfWeek = weekdays[delivDateJS.getDay()]

      return ({ ...order, type: 'C', dayOfWeek })
    })
    //console.log(standing)
    const _stand = standing.filter(order => 
      order.isStand && order.isWhole
    ).map(order => ({ ...order, type: 'S' }))

    const _cartByDate = groupBy(_cart, order => order.delivDate)
    const _standingByDay = groupBy(_stand, order => order.dayOfWeek)

    // the ISO dates come from cart order records, so this summary is nearly
    // equivalent to a 'cartSummary'.
    const summaryByDate = Object.keys(_cartByDate).map(dateKey => {
      const cItems = _cartByDate[dateKey]
      const sItems = _standingByDay[cItems[0].dayOfWeek] || []

      const _byProdNick = Object.values(groupBy(
        cItems.concat(sItems), 
        order => order.prodNick
      ))
      const _byType = Object.values(_byProdNick.map(pGroup => 
        groupBy(pGroup, order => order.type)
      ))

      // 
      const summary = _byType.map(item => {

        //console.log("SummaryItem",  item)
        const sExists = !!item.S
        const sQty = item.S?.[0].qty ?? 0
        //const sExists = sQty !== undefined

        const cExists = !!item.C
        const cQty = item.C?.[0].qty ?? 0
        //const cExists = cQty !== undefined

        const isStanding = (sExists && sQty !== 0 && !cExists) 
          || (sQty !== 0 && sQty === cQty)
          || (
            cExists && item.C[0].updatedBy === "standing_order"
          )


        // const isCart = cQty !== 0 && sQty === 0
        const isCart = cExists && cQty !== 0 && !sExists
          && item.C[0].updatedBy !== "standing_order"

        // const isCartOverride = sQty !== 0 && (cExists && cQty !== sQty)
        const isCartOverride = cExists && sExists && cQty !== sQty
          && item.C[0].updatedBy !== "standing_order"

        const isDelete = cExists && cQty === 0
          && item.C[0].updatedBy !== "standing_order"
        const isRecentDelete = isDelete 
          && getWorkingDateTime(item.C[0].qtyUpdatedOn).toMillis() 
          === getWorkingDateTime('NOW').toMillis()
          
        return ({
          isStanding,
          isCart,
          isCartOverride,
          isDelete,
          isRecentDelete,
        })

      })

      const hasCart = summary.some(item => item.isCart || item.isCartOverride)
      const hasStanding = !hasCart && summary.some(item => item.isStanding)
      const isDelete = summary.every(item => item.isDelete)
      const isRecentDelete = summary.some(item => item.isRecentDelete)
        && summary.every(item => item.isDelete)

      return ([dateKey, { hasCart, hasStanding, isDelete, isRecentDelete }])   
    }) // end cartSummary

    // This part only considers standing orders. Calendar should try to match
    // a date key in the above summaryByDate first, then try to match a weekday
    // key here as a fallback.
    const summaryByDay = Object.keys(_standingByDay).map(dayKey => {
      const sItems = _standingByDay[dayKey]
      return ([dayKey, { hasStanding: sItems.some(item => item.qty !== 0) }])
    })

    return ({
      byDate: Object.fromEntries(summaryByDate),
      byDay: Object.fromEntries(summaryByDay)
    })

  } // end composeSummary

  return { data: useMemo(composeSummary, [cart, standing]) }

}

/**Read-Only hook. Intended for wholesale orders only.
 * 
 * Mutate cart data from 'useCartDataByLocation'.
 * 
 * Mutate standing data from 'useStandingDataByLocation'.
*/
export const useFullOrderByDate = ({ locNick, delivDateJS, shouldFetch }) => {
  const { data:cart } = useCartDataByLocation({ locNick, shouldFetch })
  const { data:standing } = useStandingDataByLocation({ locNick, shouldFetch })
  const { data:PRD } = useCustomizedProducts({ locNick, shouldFetch })
  const { data:location } = useLocationDetails({ locNick, shouldFetch })

  const makeCartOrder = () => {
    if (!cart || !standing || !PRD || !location) return undefined
    const delivDate = dateToYyyymmdd(delivDateJS)
    const dayOfWeek = weekdays[delivDateJS.getDay()]
    const products = Object.fromEntries(PRD.map(P => [P.prodNick, P]))

    // _cart still has header props; _cartProj removes them
    const _cart = cart.filter(item => 
      item.delivDate === delivDate
    )
    const _cartProj = _cart.map(item => {
      return ({
        // ...item,
        id: item.id,
        prodNick: item.prodNick,
        qty: item.qty,
        qtyUpdatedOn: item.qtyUpdatedOn,
        sameDayMaxQty: item.sameDayMaxQty,
        rate: item.rate,
        createdOn: item.createdOn,
        updatedOn: item.updatedOn,
        updatedBy: item.updatedBy,
        orderType: 'C',
        ttl: item.ttl,
        //product: products[item.prodNick],
        baseQty: item.qty,
      })
    })
    
    const _standingProj = standing.filter(item => 
      item.dayOfWeek === dayOfWeek && item.isWhole && item.isStand 
    ).map(item => {
      const product = products[item.prodNick]
      return ({
        //...item, 
        id: null,
        prodNick: item.prodNick,
        qty: item.qty,
        qtyUpdatedOn: null,
        sameDayMaxQty: item.qty,
        rate: product.wholePrice, // product already applies alt price
        createdOn: item.createdAt,
        updatedOn: item.updatedAt,
        updatedBy: item.updatedBy,
        orderType: 'S',
        ttl: null,
        //product,
        baseQty: item.qty,
      })
    })
  
    // append standing items to order if
    // no cart item exists for the same product
    let orderItems = _standingProj.reduce((prev, curr) => {
      let matchIndex = prev.findIndex(item => 
        item.prodNick === curr.prodNick
      )
      if (matchIndex === -1) prev.push(curr)
      return prev

    }, [..._cartProj])

    const hasEdit = orderItems.findIndex(i => 
      i.orderType === 'C' && i.updatedBy !== 'standing_order'
    ) > -1

    const favProducts = PRD.filter(P => 
      // customized products already applies overrides to defaultInclude
      P.defaultInclude && P.templateProd.items.length 
    )
    if (!hasEdit) for (let product of favProducts) {
      let orderMatch = orderItems.find(order => 
        order.prodNick === product.prodNick
      )
      // let inCart = orderMatch?.orderType === 'C' 
      //   && (orderMatch.updatedBy !== 'standing_order' && orderMatch.qty !== 0)
      // let shouldTakeId = orderMatch?.orderType === 'C' 
      //   && (orderMatch.updatedBy === 'standing_order' || orderMatch.qty === 0)
      
      // if (!inCart) {
      if (!orderMatch) {
        let newItem = { 
          // id: shouldTakeId ? orderMatch.id : null,
          id: null,
          prodNick: product.prodNick,
          qty: 0,
          qtyUpdatedOn: null,
          sameDayMaxQty: 0,
          rate: product.wholePrice,
          createdOn: null,
          updatedOn: null,
          updatedBy: null,
          orderType: 'T',
          ttl: null,
          //product,
          baseQty: 0,
          isTemplate: true, // hopefully can depreciate this with rewrite
          action: "CREATE", // hopefully can depreciate with rewrite
        }
        //let shouldAppend = !orderMatch
        // let shouldReplace = shouldTakeId 
        //   || (orderMatch?.orderType === 'S' && orderMatch.qty === 0)

        // if (shouldAppend) orderItems = orderItems.concat(newItem)
        // if (shouldReplace) orderItems = orderItems.map(item => 
        //   newItem.prodNick === item.prodNick ? newItem : item
        // )
        orderItems = orderItems.concat(newItem)
      }
    }
    // Decided to generate derived metadata without memoizing in the order page
    //
    // orderItems = orderItems.map(item => { 
    //   const meta = {}
    //   return { ...item, meta }
    // })
    orderItems = sortBy(orderItems, ['product.prodName'])
    
    // Make Header
    const defaultRoute = ['atownpick', 'slopick'].includes(location.zoneNick) 
      ? location.zoneNick
      : 'deliv'
    
    // *** FUTURE: if standing orders make use of route/note attributes:
    //const standingRoute = ...
    //const standingNote = ...

    const orderHeader = {
      locNick: location.locNick,
      isWhole: true,
      delivDate: delivDate,
      route: _cart[0]?.route ?? defaultRoute,
      ItemNote: _cart[0]?.ItemNote ?? '',
      meta: {
        defaultRoute
      }
    }
    // console.log("header", orderHeader)
    // console.log("items", orderItems)

    return {
      header: orderHeader,
      items: orderItems
    }
  }

  return { 
    data: useMemo(makeCartOrder, [cart, standing, PRD ,location, delivDateJS])
  }

}

/**
 * Read-Only hook.
 * 
 * Transforms fetched standing data for use in the standing order editor.
 * 
 * Mutate standing data from 'useStandingDataByLocation'.
 */
export const useStandingOrderByLocation = ({ 
  locNick, 
  shouldFetch, 
  options: {
    isWhole=true,
    isStand=true,
  }={}
}) => {
  const { data:location } = useLocationDetails({ locNick, shouldFetch })
  //const { data:PRD } = useListData({ tableName:"Product", shouldFetch })
  const { data:standing } = useStandingDataByLocation({
    locNick, shouldFetch
  })

  const composeOrder = () => {
    if (
      !location 
      //|| !PRD 
      || !standing
    ) return undefined

    //const products = Object.fromEntries(PRD.map(P => [P.prodNick, P]))

    const defaultRoute = ['atownpick', 'slopick'].includes(location.zoneNick)
      ? location.zoneNick
      : 'deliv'
    
    const header = {
      locNick,
      isStand,
      isWhole,
      route: defaultRoute,
      ItemNote: null,
    }

    const _filtered = standing.filter(item => 
      item.isWhole === isWhole && item.isStand === isStand
    )

    const itemEntries = _filtered.map(item => {
      const datakey = `${item.prodNick}#${item.dayOfWeek}`
      return [datakey, { ...item }]
    })
    const itemDict = Object.fromEntries(itemEntries)

    const prodNicks = uniqBy(_filtered, 'prodNick').map(item => item.prodNick)
    const templateList = cartesian(prodNicks, weekdays).map(item => {
      const dataKey = `${item[0]}#${item[1]}`

      return [dataKey, { prodNick: item[0], dayOfWeek: item[1], qty: 0 }]
      
    })
    const templateDict = Object.fromEntries(templateList)
    const initialState = { ...templateDict, ...itemDict }

    //console.log(templateDict)
    return {
      header,
      items: initialState
    }

  } // End composeOrder

  return {
    data: useMemo(
      composeOrder, 
      [
        locNick, 
        isStand, 
        isWhole, 
        location, 
        standing,
        // PRD, 
      ]
    )
  }
}

export const useRetailOrders = ({ shouldFetch }) => {
  const { data:orders, ...otherSWRReturns } 
    = useListData({ tableName:"Order", shouldFetch })  

  const composeRetailOrders = () => {
    if (!orders) return undefined

    let retailOrderList = orders.filter(item => item.isWhole === false)
    let nestedOrders = groupBy(retailOrderList, item => item.delivDate)

    for (let dateKey of Object.keys(nestedOrders)) {
      nestedOrders[dateKey] = groupBy(
        nestedOrders[dateKey], 
        item => item.locNick
      )
    }

    const orderDates = uniqBy(retailOrderList, 'delivDate').map(item =>
      item.delivDate
    )
    const customerNames = uniqBy(retailOrderList, 'locNick').map(item => 
      item.locNick
    )

    return {
      ordersByDateByName: nestedOrders,
      orderDates,
      customerNames,
    }
    
  } // end composeRetailOrders

  return {
    data: useMemo(composeRetailOrders, [orders]),
    otherSWRReturns,
  }

}

// https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
const cartesian = (...a) => 
  a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))
