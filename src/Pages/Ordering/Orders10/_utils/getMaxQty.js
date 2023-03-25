import { getWorkingDate, getWorkingDateTime } from "../../../../functions/dateAndTime"

export const getMaxQty = (user, selectedProduct, delivDate, cartMatchItem, isAvailable) => {
  if (!user || !selectedProduct || !delivDate) return null

  // we only look through cart items returned from the DB; i.e. items already entered.
  // items just added in the app dont count as part of the order if the product is in production.
  // probably need to review all cases more closely in the future.
  const inProduction = delivDate < getWorkingDateTime('NOW').plus({ days: selectedProduct.leadTime })
  const qtyUpdatedToday = !!cartMatchItem && getWorkingDate('NOW') === getWorkingDate(cartMatchItem.qtyUpdatedOn) 

  let selectedProductMax

  if ((!inProduction && isAvailable) || user.authClass === 'bpbfull') {
    selectedProductMax = 999

  } else if (!cartMatchItem) { 
    // implied inProduction === true
    selectedProductMax = 0

  } else if (!qtyUpdatedToday) { 
    // implied inProduction === true && inCartItems === true
    selectedProductMax = cartMatchItem.info.maxQty

  } else { 
    // implied all true
    selectedProductMax = cartMatchItem.sameDayMaxQty

  }

  return selectedProductMax

}


// getMaxQty(user, product, delivDate, cartItems, isAvailable)
// const maxQty = (!inProduction && isAvailable) || user.authClass === 'bpbfull' ? 999
//   : !baseItem ? 0        
//   : !sameDayUpdate ? (baseItem.qty)
//   : baseItem.sameDayMaxQty
// const qtyChanged = baseItem ? baseItem.qty !== item.qty : item.qty > 0

     // const maxQty = (!inProduction && isAvailable) || user.authClass === 'bpbfull' ? 999
      //   : !baseItem ? 0        
      //   : !sameDayUpdate ? (baseItem.qty)
      //   : baseItem.sameDayMaxQty