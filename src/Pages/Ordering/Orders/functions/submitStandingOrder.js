import { groupBy } from "lodash"
import { orderByLocByDelivDate } from "../../../../customGraphQL/queries/_listQueries"
import gqlFetcher, { APIGatewayFetcher } from "../../../../data/_fetchers"
import { getTimeToLive } from "../../../../functions/dateAndTime"






export const submitStandingOrder = async ({
  standingData,              // header + item data straight from the database
  standingHeader,            // future: header data might be editable?
  standingItems,             // data with possible changes
  location,
  products,
  ORDER_DATE_DT,
  user,
  submitCart, updateLocalCart,
  submitStanding, updateLocalStanding,
  submitPlaceholders=true,
  submitToLegacy=true,
  placeholderRange=[-1, 3],   // dates to "lock in", relative to order date; includes both end dates
}) => {

  // **********************************
  // Get Submit Items
  // **********************************

  // items are already filtered to the header's isStand/isWhole category
  // by the data hook 'useStandingOrderByLocation'

  // Header data is not editable, so we mostly just need to look for item qty
  // changes to get out submission items.

  const startDate = 
    ORDER_DATE_DT.plus({ days: placeholderRange[1] + 1 }).toISODate()

  const submitItems = Object.keys(standingItems).filter(key => {
    const baseQty = standingData.items[key]?.qty ?? 0
    const qty = standingItems[key].qty

    return qty !== baseQty

  }).map(filteredKey => ({
    ...standingItems[filteredKey],
    startDate,
    updatedBy: user.name
  }))

  console.log("submitItems", submitItems)

  // **********************************
  // Get (Cart) Placeholders
  // **********************************

  // Definitely do not want to submit placeholders 
  // if we are editing a user's holding orders!!!

  let placeholders = []
  if (submitPlaceholders && standingHeader.isStand) {
    const minDate = ORDER_DATE_DT.plus({ days: placeholderRange[0] })
    const maxDate = ORDER_DATE_DT.plus({ days: placeholderRange[1] })

    // Dates over which to apply cart placeholders
    let dateRangeDT = []
    for (let i = placeholderRange[0]; i <= placeholderRange[1]; i++) {
      dateRangeDT.push(ORDER_DATE_DT.plus({ days: i }))
    }

    const query = orderByLocByDelivDate
    const variables = {
      locNick: standingHeader.locNick, 
      delivDate: { between: [minDate.toISODate(), maxDate.toISODate()] }
    }
    
    let cartResponse
    try { cartResponse = await gqlFetcher(query, variables) } 
    catch (err) { console.error(err); return 'error'} // maybe network error
    if (cartResponse.errors) {                        // maybe bad query
      console.error(cartResponse.errors) 
      return 'error' 
    } 
    console.log(cartResponse)

    // filtering not required now.
    // Leaving here just incase we start manipulating isWhole...

    const cartData = 
      cartResponse.data.orderByLocByDelivDate.items.filter(item =>
        item.isWhole === standingHeader.isWhole
      )

    // items that will be submitted
    // items collected here will span all days in transition period
    
    for (let dt of dateRangeDT) {
      const ISOdate = dt.toISODate()
      const dayOfWeek = dt.toFormat('EEE')
      const timestamp = new Date().toISOString()
      // console.log(ISOdate, dayOfWeek)

      const existingCartItems = cartData.filter(item =>
        item.delivDate === ISOdate
      )
      const placeholderCandidates = submitItems.filter(item =>
        item.dayOfWeek === dayOfWeek
      )
      
      const header = existingCartItems.length
        ? existingCartItems[0] // overkill, but has all the attributes we need
        : standingHeader       // fallback to standing/default values
      
      // console.log("placeholderCandidates", placeholderCandidates)
      // console.log("existingCartItems", existingCartItems)
      
      for (let candidate of placeholderCandidates) {
        const cartMatchExists = existingCartItems.some(cartItem => 
          cartItem.prodNick === candidate.prodNick
        )

        if (!cartMatchExists) {
          const key = `${candidate.prodNick}#${candidate.dayOfWeek}`
          const baseQty = standingData.items[key]?.qty ?? 0
          
          placeholders.push({
            locNick: header.locNick,
            isWhole: header.isWhole,
            route: header.route,
            delivDate: ISOdate,
            prodNick: candidate.prodNick,
            qty: baseQty,
            qtyUpdatedOn: timestamp,
            sameDayMaxQty: baseQty,
            rate: products[candidate.prodNick].wholePrice,
            ItemNote: header.ItemNote,
            isLate: 0,
            createdOn: timestamp,
            updatedOn: timestamp,
            updatedBy: 'standing_order',
            ttl: getTimeToLive(ISOdate)
          })

        }
      }
    
    }

    // console.log("Submit Standing to New System:", submitItems)

  } // end if (submitPlaceholders) {...}

  // **********************************
  // Submit Legacy (Cart) Placeholders
  // **********************************

  // Again placeholders are only used when
  // submitting standing orders, not holding orders!

  // Note that placeholder header info 
  // should try to match any existing
  // cart header data (esp the route &
  // ItemNote attributes, as those may change).
  // placeholders already have header data pulled
  // from the appropriate source, to taking from
  // any of those items to build our legacy header
  // works.
  if (submitPlaceholders && submitToLegacy && standingHeader.isStand) {

    const placeholdersByDate = 
      Object.values(groupBy(placeholders, item => item.delivDate))

    const legacySubmitBody = placeholdersByDate.map(dateGroup => {
      const [yyyy, mm, dd] = dateGroup[0].delivDate.split('-')
      const mmddyyyyDate = `${mm}/${dd}/${yyyy}`

      const header = {
        isWhole: standingHeader.isWhole,
        custName: location.locName,
        delivDate: mmddyyyyDate,
        route: dateGroup[0].route,
        PONote: dateGroup[0].ItemNote,
      }
      const items = dateGroup.map(placeholderItem => ({
        prodName: products[placeholderItem.prodNick].prodName,
        qty: placeholderItem.qty,
        rate: placeholderItem.rate,
      }))

      return({ header, items })

    })

    let legacyCartResponse
    if (legacySubmitBody.length) {
      console.log(
        "Submitting Placeholders to Legacy System:", 
        legacySubmitBody
      )

      legacyCartResponse = await APIGatewayFetcher(
        '/orders/submitLegacyCart', 
        {body: legacySubmitBody
      })

      console.log(
        "Legacy Cart Response:", 
        legacyCartResponse
      )

    }

    
  } // End if (submitPlaceholders...


  // **********************************
  // Submit Legacy Standing Items
  // **********************************
  
  // The new system attempts to handle more features by handling
  // different categories of standing order simultaneously.
  // To prevent unexpected behavior in the old system we will only
  // make changes to the legacy system when submitting 
  // standing/wholesale type orders

  // Although code execution gets terminated earlier if there are
  // no submitItems, we will take this chance to assert the full
  // standing order from the new system onto the old system, 

  // legacy standing item shape:

  // id: auto uuid                 <<< dont need to submit
  // __typename: str = "Standing"  <<< ...
  // custName: str                 <<< header
  // isStand: boolean              <<< ...
  // prodName: str                 <<< items
  // Sun: int                      <<< ...
  // Mon: int
  // Tue: int
  // Wed: int
  // Thu: int
  // Fri: int 
  // Sat: int
  // timeStamp: AWSDateTime        <<< dont need to submit
  // createdAt: AWSDateTime        <<< ...
  // updatedAt: AWSDateTime        

  if (submitToLegacy && standingHeader.isStand && standingHeader.isWhole) {
    // submit only products with changes, but IF a product has changes,
    // we need to submit all weekday qtys -- changed or not -- for the
    // product from standingItems.

    const submitProdNicks = 
      [...new Set(submitItems.map(item => item.prodNick))]    
    
    const legacySubmitHeader = {
      custName: location.locName,
      isStand: standingHeader.isStand
    }
    const legacySubmitItems = submitProdNicks.map(prodNick => {
    
      const qtyEntries = Object.values(standingItems).filter(item => 
        item.prodNick === prodNick
      ).map(item => [item.dayOfWeek, item.qty])
      const qtys = Object.fromEntries(qtyEntries)

      return({
        prodName: products[prodNick].prodName,
        ...qtys
      })

    })

    const legacyStandingSubmitBody = { 
      header: legacySubmitHeader, 
      items: legacySubmitItems 
    }

    console.log("Submit Standing to Legacy System:", legacyStandingSubmitBody)

    const legacyStandingResponse = await APIGatewayFetcher(
      '/orders/submitLegacyStanding', 
      { body: legacyStandingSubmitBody }
    )
    console.log("Legacy standing response:", legacyStandingResponse)
    
  } // end if (shouldSubmitLegacy...



  // ***********************
  // * SUBMIT PLACEHOLDERS *
  // ***********************

  if (submitPlaceholders) {
    console.log("Submit Placeholders:", placeholders)

    const placeholderResp = await submitCart({ createInputs: placeholders })

    updateLocalCart(placeholderResp)

  }

  
  // // ***************************
  // // * SUBMIT STANDING CHANGES *
  // // ***************************

  const createInputs = submitItems.filter(
    item => !item.id
  ).map(item => ({
    ...standingHeader,
    ...item,
    startDate,
    updatedBy: user.name
  }))

  const updateInputs = submitItems.filter(item => 
    !!item.id && item.qty !== 0
  ).map(item => ({
    id: item.id,
    qty: item.qty,
    startDate,
    updatedBy: user.name
  }))

  // Tweaked to clean up 0 qty items that were somehow created.
  // These have an id value, but will not register as a submit 
  // item because baseQty === qty.
  // Catching them here means cleanup is only triggered on a
  // nontrivial update, but that keeps the cleanup safr from
  // interfereing with placeholder logic.
  const deleteInputs = Object.values(standingItems).filter(item => 
    !!item.id && item.qty === 0
  ).map(item => ({ id: item.id }))
  
  console.log(
    "Submit Mutations: ", 
    { createInputs, updateInputs, deleteInputs }
  )

  const standingResp = 
    await submitStanding({ createInputs, updateInputs, deleteInputs })
    
  updateLocalStanding(standingResp)


  // // revailidate SWR data

  // if (cartPlaceHolderItems.length) {
  //   // for (let header of cartHeaders) {
  //   //   let variables = {
  //   //     locNick: locNick,
  //   //     delivDate: header.delivDateISO
  //   //   }
  //   //   //let key = [listOrdersByLocationByDate, variables]
  //   //   // mutate(key, undefined, {revalidate: true})
  //   // }
  //   mutateCart()
  // }



} // end handle standing submit



