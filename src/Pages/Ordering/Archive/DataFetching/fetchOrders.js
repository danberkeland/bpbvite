// import { API } from "aws-amplify"
// import useSWR from "swr"
// import { listLocationNames, listOrdersFromLocation } from "./gqlQueries"


// /*******************************
//  * Direct API.GraphQL fetching *
//  *******************************/

// export const fetchOrdersByLocationByDate = (locNick, delivDate) => {
//   const variables = {
//     locNick: locNick,
//     dayOfWeek: getWeekday(delivDate),
//     delivDate: dateToMmddyyyy(delivDate)
//   }

//   const response = await API.graphql({query: listOrdersFromLocation, variables: variables})
//   const orderData = transformData(response)
// }

// export const listStandingByLocation = (locNick) => {

// }

// /********************
//  * SWR Hooks Method *
//  ********************/

// const gqlFetcher = async (query, variables) => {
//   return (
//     await API.graphql({
//       query: query,
//       variables: variables 
//     })
//   )
// }

// export const useStandingByLocation = (locNick) => {
//   const { data, errors } = useSWR(locNick ? [query, variables] : null, gqlFetcher, {
//     revalidateIfStale: false,
//     revalidateOnFocus: false,
//     revalidateOnReconnect: true,
//   })

//   return({
//     data: data ? data :null
//   })


// }

// export const useOrdersByLocationByDate = (locNick, delivDate) => {
//   const 

// }
  
//   function transformOrderData(data) {
//     // Put standing orders and cart orders together
//     // as an array of objects with consistent shape.
  
//     let orders = []
//     let zone = data.data.getLocation.zoneNick
//     let route = (zone === 'atownpick' || zone === 'slopick') ? zone : 'deliv'
  
//     let altPrices = data.data.getLocation.customProd.items
//     altPrices = altPrices?.map(item => ([item.prodNick, item.wholePrice]))
//     altPrices = Object.fromEntries(altPrices)
//     let standing = []
//     let cart = []
  
//     if (data.data.getLocation.standing.items.length) {
//       standing = data.data.getLocation.standing.items?.map(item => ({
//         orderID: item.id,
//         prodName: item.product.prodName,
//         prodNick: item.product.prodNick,
//         originalQty: item.qty,
//         newQty: item.qty,
//         type: "S",
//         route: route,
//         ItemNote: item.ItemNote,
//         rate: item.product.prodNick in altPrices ? 
//           altPrices[item.product.prodNick] : 
//           item.product.wholePrice,
//         total: Math.round(item.qty * item.product.wholePrice * 100) / 100,
//         isLate: 0 // later, we should compare creation timestamp to delivDate
//       }))
//     }
  
//     if (data.data.getLocation.orders.items.length) {
//       cart = data.data.getLocation.orders.items?.map(item => ({
//         orderID: item.id,
//         prodName: item.product.prodName,
//         prodNick: item.product.prodNick,
//         originalQty: item.qty,
//         newQty: item.qty,
//         type: "C",
//         route: item.route ? item.route : "deliv",
//         ItemNote: item.ItemNote,
//         rate: 'rate' in item ? 
//           item.rate : 
//           (
//             item.product.prodNick in altPrices ? 
//               altPrices[item.product.prodNick] : 
//               item.product.wholePrice
//           ),
//         total: Math.round(item.qty * item.product.wholePrice * 100) / 100,
//         isLate: item.isLate ? item.isLate : 0,
//       }))
//     }
  
//     let cartAndStanding = [...cart, ...standing]
//     let names = []
//     if (cartAndStanding.length) {
//       names = Array.from(new Set(cartAndStanding?.map((pro) => pro.prodNick)));
//     }
  
//     // if a product has both cart and standing items, pick the cart order
//     for (let name of names) {
//       let firstMatch = cartAndStanding.find((obj) => obj.prodNick === name);
//       orders.push(firstMatch);
//     }
  
//     // check route & note:
//     //  We want to ensure that the route and Item Note attributes are
//     //  the same across all order entries.
//     //
//     //  Check if route attribute is constant among cart orders;
//     //  if not constant, set all routes to the default (variable 'route');
//     //  if constant, set all routes to that value (variable 'firstRoute');
//     //
//     //  With the note we will be less careful and just pull from the first cart entry;
//     let firstNote = ""
//     if (cart.length) {
//       let firstRoute = cart[0].route 
//       firstNote = cart[0].ItemNote ? cart[0].ItemNote : ''
//       const testRoutes = cart.map(item => item.route === firstRoute)
  
//       orders = orders.map(item => {
//         return({
//           ...item,
//           route: testRoutes.includes(false) ? route : firstRoute,
//           ItemNote: firstNote,
//         })
//       })
//     }
//     orders.sort(dynamicSort("prodName"))
  
//     return({
//       header: {
//         zoneNick: zone,
//         defaultRoute: route,
//         route: orders.length ? orders[0].route : route,
//         newRoute: orders.length ? orders[0].route : route,
//         ItemNote: firstNote,
//         newItemNote: firstNote
//       },
//       items: orders
//     })
//   }
// }