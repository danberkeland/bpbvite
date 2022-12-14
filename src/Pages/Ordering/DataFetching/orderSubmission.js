import { dateToMmddyyyy } from "../Functions/dateAndTime"

export function handleOrderSubmit(orderHeader, orderData, delivDate) {

  const routeChanged = orderHeader.route !== orderHeader.newRoute
  const noteChanged = orderHeader.ItemNote !== orderHeader.newItemNote

  const orderSubmit = orderData.map(item => {

    const qtyChanged = item.originalQty !== item.newQty
    const action = (!item.orderID) && (item.newQty > 0) ? 'CREATE' : 
    (item.type === 'S' && (qtyChanged || routeChanged || noteChanged) ? 'CREATE' :
      item.type === 'C' && (qtyChanged || routeChanged || noteChanged) ? 'UPDATE' : 'NONE'
    )

    // let mappedItem = {
    //   qty: item.newQty,
    //   prodNick: item.prodNick, // required
    //   locNick: item.locNick, // required
    //   ItemNote: orderHeader.newItemNote,
    //   SO: item.newQty,
    //   isWhole: true,
    //   delivDate: delivDate, // TODO: change to mmddyyyy string
    //   rate: item.rate,
    //   route: orderHeader.route,
    //   isLate: false,
    //   action: action
    // }

    let mappedItem = {}
    switch(action) {
      case 'CREATE':
        mappedItem = makeCreateItem(item, orderHeader, delivDate)
        break

      case 'UPDATE':
        mappedItem = makeUpdateItem(item, orderHeader)
        break
      
      default:
        mappedItem = {
          prodNick: item.prodNick,
          action: 'NONE'
        }

    }

    return mappedItem

  })

  console.log(JSON.stringify(orderSubmit, null, 2))
}

function makeCreateItem(item, orderHeader, delivDate) {

  let createItem = {
    prodNick: item.prodNick,
    locNick: item.locNick,
    qty: item.newQty,
    SO: item.newQty,
    delivDate: dateToMmddyyyy(delivDate),
    isWhole: true, // for now ordering is only for wholesale
    isLate: false, // for now we prevent late order entry so this is always true
    rate: item.rate,
    route: orderHeader.newRoute,
    action: 'CREATE'
  }

  if (orderHeader.newItemNote) createItem.ItemNote = orderHeader.newItemNote

  return createItem

}

function makeUpdateItem(item, orderHeader) {

  let updateItem = {
    id: item.orderID,
  }

  if (item.originalQty !== item.newQty) {
    updateItem.qty = item.newQty
    updateItem.SO = item.newQty
  } 
  if (orderHeader.route !== orderHeader.newRoute) updateItem.route = orderHeader.newRoute
  if (orderHeader.ItemNote !== orderHeader.newItemNote) updateItem.ItemNote = orderHeader.newItemNote
  updateItem.action = 'UPDATE'

  return updateItem

}