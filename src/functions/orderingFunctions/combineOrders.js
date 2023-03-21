/**
 * Combines cart and standing orders so that cart items override any matching
 * standing items. Returns an array of order items. Returned cart and standing 
 * items are left in their original fetched shape 
 * (see customGraphQL/queries/productionQueries).
 * 
 * Assumptions:
 * 
 * 1. Cart and standing orders are filtered to a single equivalent day/date. 
 * 
 * 2. Standing orders do not contain holding order items.
 * 
 * DOES NOT REMOVE 0 QTY ORDERS!
 */
 export const combineOrdersByDate = (cartOrdersbyDate, standingOrdersbyDay) => {
  // We forego the simple Object.fromEntries construction and build our objects by
  // looping, allowing us to record any duplicate items. Because of prior
  // filtering, 'duplicate' means two+ cart orders for the same product/location
  // or two+ standing orders for the same product/location

  // Current behavior keeps treats the first record as 'normal'. Subsequent 
  // duplicates get added to the 'duplicates' array, but not along with the 
  // original item. So we'll be easily alerted to the existence of duplicates,
  // but not be able to compare all of them side-by-side easily.
  
  const keyedStanding = { items: {}, duplicates: [] }
  for (let item of standingOrdersbyDay) {
    let dataKey = `${item.locNick}#${item.prodNick}`
    if (dataKey in keyedStanding.items) {
      keyedStanding.duplicates.push(item)
    } else {
      keyedStanding.items[dataKey] = item
    }

  }
  
  const keyedOrders = { items: {}, duplicates: [] }
  for (let item of cartOrdersbyDate) {
    let dataKey = `${item.locNick}#${item.prodNick}`
    if (dataKey in keyedOrders.items) {
      keyedOrders.duplicates.push(item)
    } else {
      keyedOrders.items[dataKey] = item
    }

  }

  if (keyedStanding.duplicates.length) {
    console.log("Duplicate standing orders:", keyedStanding.duplicates)
  }
  if (keyedOrders.duplicates.length) {
    console.log("Duplicate cart orders:", keyedOrders.duplicates)
  }

  return Object.values({ ...keyedStanding.items, ...keyedOrders.items })

}