import { useMemo } from "react"
import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./constants"

// import { useMemo } from "react"

// import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject"
import { getWeekday, dateToYyyymmdd, getTransitionDates, yyyymmddToWeekday } from "../functions/dateAndTime"

import gqlFetcher, { APIGatewayFetcher } from "./fetchers"

import * as queries from "../customGraphQL/queries/orderQueries"
import * as mutations from "../customGraphQL/mutations/orderMutations"

//import * as yup from "yup"

import { useLocationDetails } from "./locationData"
import { useStandingByLocation } from "./standingData"
import dynamicSort from "../functions/dynamicSort"


/******************
 * QUERIES/CACHES *
 ******************/
// /**
//  * Produces a list of cart order items for the given location & delivery date.
//  * @param {String} locNick Location ID attribute.
//  * @param {String} delivDate Date string in ISO yyyy-mm-dd format.
//  * @param {Boolean} shouldFetch Fetches data only when true.
//  * @return {{data: Array<Object>, errors: Object}}
//  */
// export const useOrdersByLocation = (locNick, shouldFetch) => {
//   const variables = {
//     locNick: locNick,
//   }
//   // if (shouldFetch) console.log("Fetching cart data...")
//   const { data, errors, mutate } = useSWR(
//     shouldFetch ? [queries.listOrdersByLocationByDate, variables] : null, 
//     gqlFetcher, 
//     defaultSwrOptions
//   )

//   // if (data) console.log("Cart Data response: ", data)
//   // if (errors) console.log("Cart Data errors", errors)
  
//   const _data = getNestedObject(data, ['data', 'getLocation', 'ordersByDate', 'items'])

//   return ({
//     data: _data,
//     errors: errors,
//     mutate: mutate
//   })
// }

/**
 * Produces a list of cart order items for the given location & delivery date.
 * @param {String} locNick Location ID attribute.
 * @param {String} delivDate Date string in ISO yyyy-mm-dd format.
 * @param {Boolean} shouldFetch Fetches data only when true.
 * @return {{data: Array<Object>, errors: Object}}
 */
export const useOrdersByLocationByDate = (locNick, delivDate, shouldFetch) => {
  const variables = shouldFetch ? {
    locNick: locNick,
    delivDate: delivDate
  } : null
  // if (shouldFetch) console.log("Fetching cart data...")
  const { data, errors, mutate } = useSWR(
    shouldFetch ? [queries.listOrdersByLocationByDate, variables] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  // if (data) console.log("Cart Data response: ", data)
  // if (errors) console.log("Cart Data errors", errors)
  
  const _data = getNestedObject(data, ['data', 'getLocation', 'ordersByDate', 'items'])

  return ({
    data: _data,
    errors: errors,
    mutate: mutate
  })
}

/*************
 * MUTATIONS *
 *************/

const LOGGING = true

export const createOrder = async (createOrderInput) => {
  if (LOGGING) console.log("Create order input: ", createOrderInput)
  const response = await gqlFetcher(
    mutations.createOrder, 
    { input: createOrderInput }
  )
  if (LOGGING) console.log("Create order response: ", response)

  return response
}

export const updateOrder = async (updateOrderInput) => {
  if (LOGGING) console.log("Update order input: ", updateOrderInput)
  const response = await gqlFetcher(
    mutations.updateOrder, 
    { input: updateOrderInput }
  )
  if (LOGGING) console.log("Update order response: ", response)

  return response
}

export const deleteOrder = async (deleteOrderInput) => {
  if (LOGGING) console.log("Delete order input: ", deleteOrderInput)
  const response = await gqlFetcher(
    mutations.deleteOrder,
    { input: deleteOrderInput }
  )
  if (LOGGING) console.log("Delete order response: ", response)

  return response
}


/***********
 * SCHEMAS *
 ***********/

// const createProductSchema = yup.object().shape({
  
// })

// const updateProductSchema = yup.object().shape({

// })

// const deleteProductSchema = yup.object().shape({
//   id: yup.string().required()
// })




/**
 * Compound SWR hook + data transformation. Produces a header object and items object, 
 * combining cart and standing data according to business logic.
 * @param {string} locNick - location ID for query 
 * @param {Date} delivDateJS - js Date for the desired delivery date. Converts to ISO string automatically
 * @param {boolean} isWhole - for possible future cases of handling wholesale and retail orders
 * @returns 
 */
export const useCartOrderData = (locNick, delivDateJS, isWhole) => {
  const delivDate = dateToYyyymmdd(delivDateJS)
  const dayOfWeek = getWeekday(delivDateJS)
  const { data:locationDetails } = useLocationDetails(locNick, !!locNick)
  const { data:standingData } = useStandingByLocation(locNick, !!locNick)
  // const { data:cartData, mutate:mutateCart } = useOrdersByLocationByDate(locNick, delivDate, !!locNick && !!delivDate)
  const { data:cartData, mutate:mutateCart } = useOrdersByLocationByDate(locNick, null, !!locNick)


  // console.log(locNick, delivDate, isWhole, dayOfWeek)
  // console.log("L C S:", locationDetails?1:0, cartData?1:0, standingData?1:0)
  // if (!!cartData) console.log(cartData)

  const makeCartOrder = () => {
    if (!locationDetails || !cartData || !standingData) return undefined

    // console.log("building cart order from...", locNick, delivDate, isWhole, dayOfWeek)
    // console.log(cartData)
    // console.log(standingData)
    const altPrices = locationDetails.customProd.items

    // const _cart = cartData.map(item => ({...item, orderType: 'C'}))
    const _cart = cartData
      .filter(item => item.delivDate === delivDate)
      .map(item => ({...item, orderType: 'C'}))
    const _standing = standingData
      .filter(item => item.dayOfWeek === dayOfWeek && item.isWhole === true && item.isStand === true)
      .map(item => {
        let altPriceItem = altPrices.find(altItem => altItem.prodNick = item.product.prodNick)
        let rate = (!!altPriceItem) 
          ? altPriceItem.wholePrice 
          : item.product.wholePrice
        let orderType = 'S'

        return {...item, rate: rate, orderType: orderType}
      })
 
    // append standing items to cart items if
    // no cart item exists for the same product
    const combinedOrder = _standing
      .reduce((prev, curr) => {
        let matchIndex = prev.findIndex(item => 
          item.product.prodNick === curr.product.prodNick
        )
        if (matchIndex === -1) prev.push(curr)
        return prev

      }, _cart)
      .sort((a, b) => a.product.prodName < b.product.prodName ? -1 
        : a.product.prodName > b.product.prodname ? 1
        : 0
      )

    let orderItems = [...combinedOrder]
    let shouldHideTemplates = combinedOrder.findIndex(i => i.orderType === 'C' && i.updatedBy !== 'standing_order') > -1
    const favItems = locationDetails.templateProd.items
    if (!shouldHideTemplates) for (let fav of favItems) {
      let orderMatchItem = combinedOrder.find(order => order.product.prodNick === fav.prodNick)
      let inCart = !!orderMatchItem && orderMatchItem.orderType === 'C' && orderMatchItem.updatedBy !== 'standing_order'
      let shouldTakeId = orderMatchItem?.orderType === 'C' && orderMatchItem.updatedBy === 'standing_order' && orderMatchItem.qty === 0
      
      let shouldAppend = !orderMatchItem
      let shouldReplace = shouldTakeId || (orderMatchItem?.orderType === 'S' && orderMatchItem.qty === 0)
      
      if (!inCart) {
        let altPriceItem = altPrices.find(item => item.prodNick === fav.product.prodNick)
        let newItem = { 
          id: shouldTakeId ? orderMatchItem.id : null,
          product: {
            prodNick: fav.product.prodNick,
            prodName: fav.product.prodName,
            leadTime: fav.product.leadTime,
            packSize: fav.product.packSize
          },
          qty: 0,
          orderType: "C",
          rate: altPriceItem ? altPriceItem.wholePrice : fav.product.wholePrice,
          action: "CREATE",
          isTemplate: true
        }
        
        if (shouldReplace) orderItems = orderItems.filter(o => o.product.prodNick !== newItem.product.prodNick).concat(newItem)
        if (shouldAppend) orderItems = orderItems.concat(newItem)
      }
    }

    let altLeadTimes = locationDetails.altLeadTimeByProduct.items
    orderItems = orderItems.map(order => {
      let altItem = altLeadTimes.find(alt => 
        alt.prodNick === order.product.prodNick
      )
      const leadTime = altItem 
        ? altItem.altLeadTime 
        : order.product.leadTime

      return ({
        ...order,
        product: {...order.product, leadTime: leadTime}
      })


    }).sort((a, b) => a.product.prodName < b.product.prodName ? -1 
      : a.product.prodName > b.product.prodname ? 1
      : 0
    )
    


    

    // Make Header
    const defaultRoute = ['atownpick', 'slopick'].includes(locationDetails.zone.zoneNick) 
      ? locationDetails.zone.zoneNick
      : 'deliv'
    const cartRoute = cartData.length ? cartData[0].route : null
    //const standingRoute = ... <-- for when we enable setting the attribute in standing orders
    
    const cartNote = cartData.length ? cartData[0].ItemNote : null
    //const standingNote = ... <-- for when we enable setting the attribute in standing orders
    
    const orderHeader = {
      locNick: locationDetails.locNick,
      isWhole: isWhole,
      delivDate: delivDate,
      defaultRoute: defaultRoute,
      route: cartRoute ? cartRoute : defaultRoute,
      ItemNote: cartNote ? cartNote : '',
    }
    // console.log("header", orderHeader)
    // console.log("items", orderItems)

    return {
      header: orderHeader,
      items: orderItems
    }
  }

  const cartOrder = useMemo(
    makeCartOrder, 
    [locationDetails, cartData, standingData, delivDate, dayOfWeek, isWhole]
  )

  const cartIsValid = validateCart(cartData)

  if (!cartIsValid) {
    mutateCart()
    return undefined
  }

  return cartOrder

}


const validateCart = (cartData) => {
  if (!cartData) return true
  
  let cartIsValid = true

  const dates = [...new Set(cartData.map(i => i.delivDate))]

  for (let date of dates) {
    let cartByDate = cartData.filter(i => i.delivDate === date)
    const prodNicks = [...new Set(cartByDate.map(i => i.product.prodNick))]
    const productGroups = prodNicks.map(pn => 
      cartByDate.filter(c => c.product.prodNick === pn)
        .sort(dynamicSort("updatedOn"))  
    )

    for (let group of productGroups) {
      if (group.length > 1) {
        cartIsValid = false
        console.log(`duplicates found for ${group[0].product.prodNick}`)
        let deleteItems = group.slice(0, -1).map(i => {
          return ({ id: i.id })
        })
        
        deleteItems.forEach(item => {
          let response = deleteOrder(item)
          console.log(response)
        })

      }
    }
  }
  
  return cartIsValid
}



/**
 * Specialized fetcher to retrieve cart orders from the current working date
 * to 3 days after.
 */
export const fetchTransitionOrders = async (location) => {
  const transitionDates = getTransitionDates()

  const query = queries.transitionOrdersByLocByDelivDate
  const variables = {
    locNick: location,
    delivDate: {between: [transitionDates[0], transitionDates[3]]}
  }

  const data = (await gqlFetcher(query, variables)).data.orderByLocByDelivDate.items

  return data
}


export const submitToLegacy = async (body) => {
  let response = await APIGatewayFetcher('/orders/submitLegacyCart', body)

  return response
}

export const useOrderSummary = (locNick, shouldFetch) => {
  const { data:cartData, mutate:mutateCart } = useOrdersByLocationByDate(locNick, null, shouldFetch)
  const { data:standingData } = useStandingByLocation(locNick, shouldFetch)

  const transformData = () => {
    if (!cartData || !standingData) return undefined
    
    let _cart = cartData.map(i => ({
      prodNick: i.product.prodNick, 
      qty: i.qty, 
      delivDate: i.delivDate, 
      orderType: 'C'
    }))
    let _standing = standingData
      .filter(i => i.isStand && i.isWhole)
      .map(i => ({
        prodNick: i.product.prodNick, 
        qty: i.qty, 
        dayOfWeek: i.dayOfWeek,
        orderType: 'S'
      }))
    let dates = [...new Set(_cart.map(i => i.delivDate))]

    let ordersByDate = {}
    for (let delivDate of dates) {
      let cart = _cart.filter(i => i.delivDate === delivDate)

      let standing = _standing
        .filter (s => s.dayOfWeek === yyyymmddToWeekday(delivDate))
        .filter (s => cart.findIndex(c => c.prodNick === s.prodNick) === -1) // keep only if not matching cart item

      let orderByDate = cart.concat(standing)
      let hasCart = false
      let hasStanding = false

      for (let item of orderByDate) {
        if (item.orderType === 'C' && item.qty > 0) hasCart = true
        if (item.orderType === 'S' && item.qty > 0) hasStanding = true
      }

      ordersByDate[delivDate] = {
        hasCart: hasCart,
        hasStanding: hasStanding
      }

    }

    let weekdays = [...new Set(_standing.map(i => i.dayOfWeek))]

    let standingByWeekday = {}
    for (let dayOfWeek of weekdays) {
      let nonZeroMatchIdx = _standing
        .findIndex(s => s.dayOfWeek === dayOfWeek && s.qty > 0)
        
      let hasStanding = nonZeroMatchIdx > -1

      standingByWeekday[dayOfWeek] = hasStanding
    }

    const orderSummary = {
      dates: ordersByDate,
      days: standingByWeekday
    }

    // console.log(orderSummary)
    return orderSummary
  }

  const orderSummary = useMemo(
    transformData, 
    [cartData, standingData]
  )

  return ({ 
    data: orderSummary 
  })

}