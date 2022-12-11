import { API } from "aws-amplify"
import { dateToMmddyyyy, getWeekday } from "../Functions/dateAndTime"
import * as queries from './queries'

export const gqlFetcher = async (query, variables) => {
  return (
    await API.graphql({
      query: query,
      variables: variables 
    })
  )
}

export const fetchOrderData = async (location, date, setHeader, setItems) => {
  const variables = {
    locNick: location,
    dayOfWeek: getWeekday(date),
    delivDate: dateToMmddyyyy(date)
  }

  // fetches both cart and standing orders 
  // applicable to the given date.
  const response = await API.graphql({
    query: queries.listOrdersFromLocation,
    variables: variables 
  })

  console.log(response)
  const orderData = transformOrderData(response)

  setHeader(orderData.header)
  setItems(orderData.items)
}


function transformOrderData(data) {
  // Put standing orders and cart orders together
  // as an array of objects with consistent shape.

  let orders = []
  let zone = data.data.getLocation.zoneNick
  let route = (zone === 'atownpick' || zone === 'slopick') ? zone : 'deliv'

  let altPrices = data.data.getLocation.customProd.items
  altPrices = altPrices?.map(item => ([item.prodNick, item.wholePrice]))
  altPrices = Object.fromEntries(altPrices)
  let standing = []
  let cart = []

  if (data.data.getLocation.standing.items.length) {
    standing = data.data.getLocation.standing.items?.map(item => ({
      orderID: item.id,
      prodName: item.product.prodName,
      prodNick: item.product.prodNick,
      originalQty: item.qty,
      newQty: item.qty,
      type: "S",
      route: route,
      ItemNote: item.ItemNote,
      rate: item.product.prodNick in altPrices ? 
        altPrices[item.product.prodNick] : 
        item.product.wholePrice,
      total: Math.round(item.qty * item.product.wholePrice * 100) / 100
    }))
  }

  if (data.data.getLocation.standing.items.length) {
    cart = data.data.getLocation.orders.items?.map(item => ({
      orderID: item.id,
      prodName: item.product.prodName,
      prodNick: item.product.prodNick,
      originalQty: item.qty,
      newQty: item.qty,
      type: "C",
      route: item.route ? item.route : "deliv",
      ItemNote: item.ItemNote,
      rate: 'rate' in item ? 
        item.rate : 
        (
          item.product.prodNick in altPrices ? 
            altPrices[item.product.prodNick] : 
            item.product.wholePrice
        ),
      total: Math.round(item.qty * item.product.wholePrice * 100) / 100
    }))
  }

  let cartAndStanding = [...cart, ...standing]
  let names = []
  if (cartAndStanding.length) {
    names = Array.from(new Set(cartAndStanding?.map((pro) => pro.prodNick)));
  }

  // if a product has both cart and standing items, pick the cart order
  for (let name of names) {
    let firstMatch = cartAndStanding.find((obj) => obj.prodNick === name);
    orders.push(firstMatch);
  }

  // check route & note:
  //  We want to ensure that the route and Item Note attributes are
  //  the same across all order entries.
  //
  //  Check if route attribute is constant among cart orders;
  //  if not constant, set all routes to the default (variable 'route');
  //  if constant, set all routes to that value (variable 'firstRoute');
  //
  //  With the note we will be less careful and just pull from the first cart entry;
  let firstNote = ""
  let firstRoute = ""
  if (cart.length) {
    let firstRoute = cart[0].route
    let firstNote = cart[0].ItemNote
    const testRoutes = cart.map(item => item.route === firstRoute)

    orders = orders.map(item => {
      return({
        ...item,
        route: testRoutes.includes(false) ? route : firstRoute,
        ItemNote: firstNote
      })
    })
  }

  return({
    header: {
      zoneNick: zone,
      route: orders.length ? orders[0].route : route,
      ItemNote: firstNote
    },
    items: orders
  })
}

export const fetchProductData = async () => {
  const response = (await API.graphql({
    query: queries.listProducts,
    variables: {limit: 1000} 
  })).data.listProducts.items
  return response
}

export const fetchProductOverrides = async (location) => {
  const response = (await API.graphql({
    query: queries.listProductOverridesForLocation,
    variables: {locNick: location}
  }))
  
  const productOverrides = {
    altPrices: response.data.getLocation.customProd.items,
    notAllowed: response.data.getLocation.prodsNotAllowed.items,
  }
  return productOverrides
}

export const fetchProdsForLocation = async (location, setData) => {
  const products = await fetchProductData()
  
  const {altPrices, notAllowed} = await fetchProductOverrides(location)
  const altPriceMap = Object.fromEntries(altPrices?.map(item => [item.prodNick, item.wholePrice]))
  const notAllowedMap = Object.fromEntries(notAllowed?.map(item => [item.prodNick, item.isAllowed]))
  
  let prodsForLocation = products.filter(item => item.prodNick in notAllowedMap ? 
    (
      notAllowedMap[item.prodNick] === true ?
        !(item.defaultInclude) :
        item.defaultInclude
    ) :
    item.defaultInclude
  )
  
  prodsForLocation = prodsForLocation.map(item => {
    if (item.prodNick in altPriceMap) {
      return ({
        ...item,
        wholePrice: altPriceMap[item.prodNick]
      })
    } else {
      return item
    }
  }) 

  setData(prodsForLocation)
}