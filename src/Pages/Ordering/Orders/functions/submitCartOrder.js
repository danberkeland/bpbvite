
import { getWorkingDateTime } from "../../../../utils/_deprecated/dateAndTime"
import { getTimeToLive } from "../../../../utils/dateAndTime/getTimeToLive"
import { APIGatewayFetcher } from "../../../../data/_fetchers"
import { sendConfirmationEmail } from "./sendEmailConfirmation"
import { isEqual } from "lodash"

const getSubmitItems = (cartOrder, cartHeader, cartItems, user) => {
  const headerHasChanged = !isEqual(cartOrder.header, cartHeader)
  //console.log(headerHasChanged)
  // const changedItems = cartItems.filter(item => item.qty !== item.baseQty)

  // If the header has changed, update all cart records in addition to
  // any changed/created items.

  // const cartTypeItems = cartItems.filter(item => item.orderType === 'C')
  // const _toSubmit = headerHasChanged
  //   ? changedItems.length
  //     ? cartItems.filter(item => 
  //         item.qty !== item.baseQty || item.orderType === 'C'
  //       )
  //     : []
  //   : changedItems

  const _toSubmit = cartItems.filter(item => 
    headerHasChanged || item.qty !== item.baseQty
    //|| (headerHasChanged && item.orderType === 'C')
  )

  const { isWhole, locNick, delivDate, route, ItemNote } = cartHeader
  const TTLtimestamp = getTimeToLive(delivDate)
  //console.log("TTL:", TTLtimestamp, 
  //   DateTime.fromSeconds(TTLtimestamp).toFormat('yyyy-MM-dd HH:mm:ss')
  // )
  const submitItems = _toSubmit.map(item => {
    const { id, prodNick, baseQty, qty, qtyUpdatedOn, rate } = item
  const shouldUpdateSameDayMax = qtyUpdatedOn === null
    || (
      getWorkingDateTime(qtyUpdatedOn).toMillis() 
        !== getWorkingDateTime('NOW').toMillis()
    )

    const submitItem = { 
      route,
      ItemNote,
      prodNick,
      qty, 
      rate,
      updatedBy: user.name,
    }

    if (id) {
      submitItem.id = id
    }
    // enforcing these attibutes as not update-able
    if (!id) {
      submitItem.isWhole = isWhole
      submitItem.locNick = locNick
      submitItem.delivDate = delivDate
      submitItem.ttl = TTLtimestamp
      submitItem.isLate = 0 // vestigal data
    }
    if (qty !== baseQty) {
      submitItem.qtyUpdatedOn = new Date().toISOString()
    }
    if (shouldUpdateSameDayMax) {
      submitItem.sameDayMaxQty = qty
    }
    return submitItem

  }) // End submitItems = changedItems.map(...)
  return submitItems

}

const getLegacySubmitBody = (
  cartOrder, cartHeader, cartItems, location, products) => {
  
  const [yyyy, mm, dd] = cartHeader.delivDate.split('-')
  const legacySubmitHeader = {
    isWhole: true,
    custName: location.locName,
    delivDate: `${mm}/${dd}/${yyyy}`,
    route: cartHeader.route,
    PONote: cartHeader.ItemNote,
  }

  // Filter to items that should be created, 
  // or items that are part of the current cart order state.
  //   (i.e. any item returned on the inital cart order fetch/compile)
  const legacySubmitItems = cartItems.filter(item => {
    const baseItem = cartOrder.items.find(i => 
      i.prodNick === item.prodNick
    )
    return (!baseItem && item.qty !== 0) || !!baseItem

  }).map(item => ({
    prodName: products[item.prodNick].prodName,
    qty: item.qty,
    rate: item.rate,
  }))

  return {
    header: legacySubmitHeader,
    items: legacySubmitItems
  }

}


/** 
 * Lambda takes an array of order bodies. Each item should be the
 * submit body for a single delivery date
 */
const submitToLegacy = async (body) => {
  try {
    return await APIGatewayFetcher(['/orders/submitLegacyCart', { body: body }])
     
  } catch (error) {
    console.log("Gateway error:", error)
    return undefined

  }

}

export const submitCartOrder = async ({
  cartCache,
  cartOrder,
  cartHeader,
  cartItems,
  user,
  location,
  products,
  delivDateJS,
}) => {
  const {
    submitMutations:submitCartItems,
    updateLocalData:updateCartCache,
    mutate:asyncMutate,
  } = cartCache

  const submitItems = getSubmitItems(
    cartOrder, cartHeader, cartItems, user
  )
  console.log(submitItems)
  if (!submitItems.length) {
    console.log("No Changes Detected")
    return 'noChange'
  }

  const legacySubmitBody = getLegacySubmitBody(
    cartOrder, cartHeader, cartItems, location, products
  )
  const createInputs = submitItems.filter(item => !item.id)
  const updateInputs = submitItems.filter(item => !!item.id)

  const legacyPromise = submitToLegacy([legacySubmitBody])
  const gqlPromise = submitCartItems({ createInputs, updateInputs })

  const [legacyResponse, gqlResponse] = 
    await Promise.all([legacyPromise, gqlPromise])

  console.log("gqlResponse", gqlResponse)
  console.log("legacyResponse", legacyResponse)

  if (legacyResponse === undefined) {
    asyncMutate() // refresh cart records from the DB
    return 'error'
  }

  if (gqlResponse === undefined) {        
    console.error("GQL request failed")
    asyncMutate() // refresh cart records from the DB
    return 'error'

  } else if (gqlResponse.errors.length) {
    console.error("GQL Errors:", gqlResponse.errors)
    asyncMutate() // refresh cart records from the DB
    return 'error'

  } else { 
    updateCartCache(gqlResponse)
    const emailSent = await sendConfirmationEmail(
      location, cartHeader, cartItems, delivDateJS
    )

    return emailSent ? 'successEmail' : 'success'
  }

} // End handleSubmit