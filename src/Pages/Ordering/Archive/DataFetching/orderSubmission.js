import { dateToMmddyyyy } from "../Functions/dateAndTime"
import { gqlFetcher } from "./fetcher"
import * as mutations from './mutations'

export const handleOrderSubmit = async (location, delivDate, data) => {
  const {orderHeader, orderData, setOrderData} = data
  const routeChanged = orderHeader.route !== orderHeader.newRoute
  const noteChanged = orderHeader.ItemNote !== orderHeader.newItemNote

  let orderSubmit = orderData.map(item => {
    const qtyChanged = item.originalQty !== item.newQty
    const action = (!item.orderID && item.newQty > 0) ? 'CREATE' : 
    (item.type === 'S' && (qtyChanged || routeChanged || noteChanged) ? 'CREATE' :
      item.type === 'C' && (qtyChanged || routeChanged || noteChanged) ? 'UPDATE' : 'NONE'
    )

    switch(action) {
      case 'CREATE':
        return makeCreateItem(item, orderHeader, location, delivDate)

      case 'UPDATE':
        return makeUpdateItem(item, orderHeader)
      
      default: 
        return ({ prodNick: item.prodNick, action: 'NONE' })
    }

  })

  for (let item of orderSubmit) {
    let action = item.action
    delete item.action
    console.log("Item to submit: ", item)

    let response
    let _orderData

    switch(action) {
      case 'CREATE':
        console.log("Calling createOrder for... ", JSON.stringify(item, null, 2))

        response = await gqlFetcher([mutations.createOrder, {input: item}])
        response = response.data.createOrder
        console.log(response)
        _orderData = orderData.map(oldItem => oldItem.prodNick === response.prodNick ? 
          {
            orderID: response.id,
            type: 'C',
            prodNick: response.prodNick,
            prodName: oldItem.prodName,
            originalQty: response.qty,
            newQty: response.qty,
            route: response.route,
            rate: response.rate,
            total: (response.rate * response.qty).toFixed(2),
            isLate: response.isLate ? response.isLate : 0
          } : 
          oldItem
        )
        
        setOrderData(_orderData)
        break

      case 'UPDATE':
        console.log("Calling updateOrder for... ", JSON.stringify(item, null, 2))

        response = await gqlFetcher([mutations.updateOrder, {input: item}])
        response = response.data.updateOrder
        console.log(response)
        _orderData = orderData.map(oldItem => oldItem.prodNick === response.prodNick ? 
          {
            orderID: response.id,
            type: 'C',
            prodNick: response.prodNick,
            prodName: oldItem.prodName,
            originalQty: response.qty,
            newQty: response.qty,
            route: response.route,
            rate: response.rate,
            total: (response.rate * response.qty).toFixed(2),
            isLate: response.isLate,
          } : 
          oldItem
        )
        
        setOrderData(_orderData)
        break

      default:
        console.log("No action for... ", JSON.stringify(item, null, 2))
        break
    }

  }
}

function makeCreateItem(item, orderHeader, location, delivDate) {

  let createItem = {
    prodNick: item.prodNick,
    locNick: location,
    qty: item.newQty,
    SO: item.newQty,
    delivDate: dateToMmddyyyy(delivDate),
    isWhole: true, // for now ordering is only for wholesale
    isLate: item.isLate? item.isLate : 0, // for now we prevent late order entry so this is always true
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