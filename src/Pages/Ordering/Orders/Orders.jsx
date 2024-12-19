import React, { useState, useEffect, useMemo, useRef } from "react"

import { TabMenu } from "primereact/tabmenu"

import { Accordion, AccordionTab } from 'primereact/accordion'
import { CartCalendar } from "./Components/CartComponents/CartCalendar"
import { LocationDropdown } from "./Components/LocationDropdown"
import { FulfillmentDropdown } from "./Components/CartComponents/FulfillmentDropdown"
import { CartItemDisplay } from "./Components/CartComponents/CartItemDisplay/CartItemDisplay"
import { ItemNoteInput } from "./Components/CartComponents/ItemNoteInput"
import { AddItemMenu } from "./Components/CartComponents/AddItem/AddItemMenus"
import { AddStandingItemMenu } from "./Components/StandingComponents/AddStandingItemMenu"

import { useSettingsStore } from "../../../Contexts/SettingsZustand"
import { useCustomizedProducts } from "./data/productHooks"
import { 
  useCartDataByLocation, 
  useFullOrderByDate, 
  useStandingOrderByLocation 
} from "./data/orderHooks"

import { DateTime, Interval } from "luxon"
import { useWindowSize } from "../../../utils/useWindowSize"
import { getWorkingDateTime } from "../../../utils/_deprecated/dateAndTime"
import { useLocationDetails } from "./data/locationHooks"
// import { debounce } from "lodash"
import { StandingItemDisplay } from "./Components/StandingComponents/StandingItemDisplay"
import { CartHeaderSummary } from "./Components/CartComponents/CartHeaderSummary"
import { RetailOrders } from "./Components/Retail/RetailOrders"
// import { API, graphqlOperation } from "aws-amplify"

// import * as subscriptions from "../../../customGraphQL/subscriptions"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { useOrderNotesByCustomer } from "./data/noteHooks"
import { Dialog } from "primereact/dialog"
import { OrderNotes } from "./Components/OrderNotes/OrderNotes"



// Constants, Non-Reactive Data ************************************************
/**
 * Compatible with JSDates .getDay() conventions. If using luxon's 
 * DateTime.weekday(), use '% 7' first to change Sunday from 7 to 0.
 */
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const cartTabModel = [
  {index: 0, label: 'Cart Orders', icon: 'pi pi-fw pi-shopping-cart'}
]
const standingTabModel = [
  {index: 1, label: 'Standing Orders', icon: 'pi pi-fw pi-calendar'},
]
const retailTabModel = [
  {index: 2, label: 'Retail', icon: 'pi pi-fw pi-shopping-cart'},
]
const helpTabModel = [
  {index: 3, label: 'Help', icon: 'pi pi-fw pi-question-circle'},
]

const standingBlacklist = ['high', 'hios', 'sandos']


// *****************************************************************************
// Component
// *****************************************************************************
export const Orders = ({ useTestAuth }) => {
  const windowSize = useWindowSize()
  const wSize = windowSize.width >= 750 ? 'lg'
    : windowSize.width >= 440 ? 'md'
    : 'sm'

  const defaultAuth = useSettingsStore(state => state.authClass)
  const user = {
    name: useSettingsStore(state => state.user),
    sub: useSettingsStore(state => state.username),
    authClass: useTestAuth 
      ? 'admin'
      : defaultAuth,
    locNick: useSettingsStore(state => state.currentLoc),
    // locNick: "high",
  }

  const isLoading = useSettingsStore((state) => state.isLoading)

  const tabModel = user.authClass === 'bpbfull'
    ? cartTabModel.concat(standingTabModel, retailTabModel, helpTabModel)
    : standingBlacklist.includes(user.locNick)
      ? cartTabModel.concat(helpTabModel)
      : cartTabModel.concat(standingTabModel, helpTabModel)

  const [locNick, setLocNick] = useState(user.locNick)
  useEffect(() => setLocNick(user.locNick), [user.locNick])

  // Date data
  const nowDT = DateTime.now().setZone('America/Los_Angeles')
  // console.log('TIME', nowDT)
  const todayDT = nowDT.startOf('day')
  const ORDER_DATE_DT = nowDT.plus({ hours: 4 }).startOf('day')
  // const pastCutoff = todayDT.toMillis() !== ORDER_DATE_DT.toMillis()

  const [delivDateJS, setDelivDateJS] = useState(
    todayDT.plus({ days: 1 }).toJSDate()
  )
  const delivDateDT = DateTime.fromJSDate(delivDateJS)
    .setZone('America/Los_Angeles')
    .startOf('day')
  const delivWeekday = weekdays[delivDateJS.getDay()]
  const orderLeadTime = Interval
    .fromDateTimes(ORDER_DATE_DT, delivDateDT).length('days')
  const relativeDelivDate = 
    Interval.fromDateTimes(todayDT, delivDateDT).length('days')
    || -1 * Interval.fromDateTimes(delivDateDT, todayDT).length('days')
  const isDelivDate = orderLeadTime === 0
  const isPastDeliv = isNaN(orderLeadTime)
  const isXmas = delivDateDT.toFormat('MM-dd') === '12-25'
  const dateUpdated = useRef(false) // just a flag for controling state
  const dateProps = { 
    ORDER_DATE_DT, todayDT,
    delivDateJS, setDelivDateJS,
    delivDateDT, delivWeekday, 
    isDelivDate, isPastDeliv,
    orderLeadTime, relativeDelivDate,
    dateUpdated, 
  }
  //const [dayOfWeek, setDayOfWeek] = useState()
  const [activeIndex, setActiveIndex] = useState(0)
  const [showOrderDateDialog, setShowOrderDateDialog] = useState(false)

  const [showSidebar, setShowSidebar] = useState(false)
  const [selectedCartQty, setSelectedCartQty] = useState('')
  const [selectedCartProdNick, setSelectedCartProdNick] = useState()

  const toastRef = useRef(null)

  // **********************************
  // DATA
  // **********************************
  const shouldFetch = !!locNick

  // Location *************************
  const { data:location } = useLocationDetails({ locNick, shouldFetch })

  // Order ****************************
  const { data:cartOrder } = useFullOrderByDate({ 
    locNick, delivDateJS, shouldFetch 
  })
  
  // primary hook used to build the above useFullOrderByDate
  // we're calling this in to pass the mutate functions to the submit button
  const cartCache = useCartDataByLocation({ locNick, shouldFetch })
  // const { updateLocalData } = cartCache

  // const updateQueue = useRef({
  //   createdItems: [],
  //   updatedItems: [],
  //   deletedItems: [],
  // })

  // const debouncedUpdate = debounce(({
  //   createdItems=[], updatedItems=[], deletedItems=[],
  // }) => {
  //   updateLocalData({ createdItems, updatedItems, deletedItems })
  //   updateQueue.current = { createdItems: [],updatedItems: [],deletedItems: [] }
  // }, 500)


  // useEffect(() => {
  //   let createOrderSub
  //   let updateOrderSub

  //   if (user.authClass === 'bpbfull') {
  //     const subVariables = { filter: { 
  //       locNick: { eq: locNick ?? '' } 
  //     }}
  
  //     createOrderSub = API.graphql(
  //       graphqlOperation(
  //         subscriptions.onCreateOrder,
  //         subVariables
  //       )
  //     ).subscribe({
  //       next: ({ provider, value }) => {
  //         console.log({ provider, value })
  //         updateQueue.current = ({
  //           ...updateQueue.current,
  //           createdItems: updateQueue.current.createdItems
  //             .concat(value.data.onCreateOrder),
  //         })
  //         debouncedUpdate(updateQueue.current)
  //       },
  //       error: error => console.warn(error)
  //     })
  
  //     updateOrderSub = API.graphql(
  //       graphqlOperation(
  //         subscriptions.onUpdateOrder,
  //         subVariables
  //       )
  //     ).subscribe({
  //       next: ({ provider, value }) => {
  //         console.log({ provider, value })
  //         updateQueue.current = ({
  //           ...updateQueue.current,
  //           updatedItems: updateQueue.current.updatedItems
  //             .concat(value.data.onUpdateOrder),
  //         })
  //         debouncedUpdate(updateQueue.current)
  //       },
  //       error: error => console.warn(error)
  //     })

  //   }

  //   return () => {
  //     createOrderSub?.unsubscribe()
  //     updateOrderSub?.unsubscribe()
  //   }

  // }, [locNick, user.authClass, debouncedUpdate])



  const [cartHeader, setCartHeader] = useState({})
  const [cartItems, setCartItems] = useState([])
  useEffect(() => {
    setCartHeader(cartOrder?.header ?? {})
    setCartItems(cartOrder?.items ?? [])

  }, [cartOrder])



  // update the add-product menu's selection info when the date changes.
  // If the product is in the cart for the new date, set the selected qty
  // to the current qty in the cart, otherwise set to 0.
  useEffect(() => {
      if (!!dateUpdated.current && !!selectedCartProdNick) {
        const matchItem = (cartOrder?.items ?? []).find(i => 
          i.prodNick === selectedCartProdNick
        )
        setSelectedCartQty(matchItem?.qty ?? 0)
        dateUpdated.current = false
      }

  }, [cartOrder, selectedCartProdNick])

  const orderHasChanges = cartItems.some(item => item.qty !== item.baseQty)  
    || (
      //!isEqual(cartOrder?.header ?? {}, cartHeader)
      !!cartOrder && (

        cartOrder.header.ItemNote !== cartHeader.ItemNote
        || cartOrder.header.route !== cartHeader.route
      ) && cartItems.some(item => 
        
        item.orderType !== 'T' // && item.qty !== item.baseQty
      )
    )

  // Standing *************************
  const [standingView, setStandingView] = useState('byProduct')
  const [standingHeader, setStandingHeader] = useState({})
  const [standingItems, setStandingItems] = useState({})
  const [selectedDisplayProdNick, setSelectedDisplayProdNick] = useState()
  const [showStandingSidebar, setShowStandingSidebar] = useState(false)
  const { data:standingData } = useStandingOrderByLocation({
    locNick, 
    shouldFetch,
    options: {
      isStand: true,
      isWhole: true
    }
  })
  
  useEffect(() => {
    setStandingHeader(standingData?.header ?? {})
    setStandingItems(standingData?.items ?? {})
  }, [standingData])

  const standingProps = {
    standingData,
    standingHeader, setStandingHeader,
    standingItems, setStandingItems,
    standingView, setStandingView,
  }


  // Product Data:
  
  // specifying the fulfillmentOption helps us create 
  // more targeted metadata for products. For standing
  // orders we assume the default fulfillment method, as
  // there is no current method for editing the header.
  const fulfillmentOption = activeIndex === 0 
    ? cartHeader?.route ?? null     // index 0 --> Cart orders
    : standingHeader?.route ?? null // index 1 --> Standing orders
  
  // We add yet more metadata summarizing product availability
  // for the user-selected fulfillment/delivery date.
  const { data:PRD } = useCustomizedProducts({ 
    locNick, shouldFetch, format: 'list'
  })
  const products = useMemo(() => {
    if (!PRD || !fulfillmentOption || !delivDateJS) return undefined

    
    return Object.fromEntries(PRD.map(product => {
      // console.log(fulfillmentOption)
      // console.log(delivDateJS.getDay())
      // console.log(product)
      // option corresponding to the selected fulfillment/weekday
      const routeOption = product.meta
        .routeOptions[fulfillmentOption][delivDateJS.getDay()][0] ?? []
      const isValid = routeOption?.isValid ?? false
      const leadTime = routeOption?.adjustedLeadTime ?? product.leadTime
      const daysAvailable = routeOption?.adjustedDaysAvailable 
        ?? product.daysAvailable
      const isAvailable = !!daysAvailable[delivDateJS.getDay()]    
      const inProd =!(orderLeadTime >= leadTime)
      // values already consider delayed-delivery  
      const summary = { 
        isValid, isAvailable, leadTime, daysAvailable, inProd, routeOption, 
      }

      const newItem = {
        ...product,
        meta: { 
          ...product.meta,
          assignedRouteSummary: summary
        }
      }
      return [product.prodNick, newItem]

    })) // End return products.map...
  }, [PRD, fulfillmentOption, delivDateJS, orderLeadTime])

  // keyed on prodNick
  const cartMeta = getCartItemMeta(cartItems, products, user, dateProps)
  // console.log(cartMeta)
  const cartProps = { 
    cartOrder, 
    cartHeader, setCartHeader, 
    cartItems, setCartItems, 
    cartMeta 
  }

  const disableInputs = (user.authClass !== 'bpbfull' && !(orderLeadTime > 0))
    || isLoading 
    || (user.authClass !== 'bpbfull' && isXmas)
  const deactivated = (user.authClass !== 'bpbfull' && location?.isActive === false)

  // Warn before navigating away with unsaved changes
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (orderHasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [orderHasChanges]);
  // useEffect(() => {
  //   const visibilitychange = (e) => {
  //     if (orderHasChanges) {
  //       e.preventDefault();
  //       e.returnValue = "";
  //     }
  //   };
  //   window.addEventListener("visibilitychange", visibilitychange);
  //   return () => {
  //     window.removeEventListener("visibilitychange", visibilitychange);
  //   };
  // }, [orderHasChanges]);

  // Notes

  const [showNotesMenu, setShowNotesMenu] = useState(false)
  const { data:notes } = useOrderNotesByCustomer({
    locNick: locNick,
    shouldFetch: user.authClass === 'bpbfull'
  })

  return (
    <div className='ordering-page' 
      style={{
        padding: ".5rem .5rem 11.75rem .5rem",
        minWidth: "350px", 
        maxWidth: wSize === 'lg' ? "60rem" : "26rem",
        margin: "auto",
      }}
    >
      {/* ADMIN STUFF*/}

      {/* {user.authClass === 'bpbfull' &&  */}
      {defaultAuth === 'bpbfull' && 
        <div style={{
          display: "flex",
          gap: "1rem",
          alignItems: "flex-end", 
          paddingBlock: "1rem" 
        }}>
          <LocationDropdown
            locNick={locNick}
            setLocNick={setLocNick}
            // authClass={user.authClass}
            authClass={defaultAuth}
            setDelivDateJS={setDelivDateJS}
            todayDT={todayDT}
            disabled={activeIndex === 2}
          />

          <Button label={`Notes (${!!notes?.length ? notes.length - 1 : 0})`}
            icon="pi pi-pencil"
            className="p-button-rounded" 
            style={{ height: "46px" }} 
            onClick={() => setShowNotesMenu(true)}
          />

          <Dialog 
            visible={showNotesMenu}
            onHide={() => setShowNotesMenu(false)}
            header={`Notes for ${location?.locName ?? "..."}`}
            headerStyle={{gap: "1rem"}}
            //style={{ width: "26rem" }}
          >
            <OrderNotes locNick={locNick} user={user} />
          </Dialog>
        </div>
      }

      <TabMenu 
        model={tabModel} 
        activeIndex={activeIndex} 
        onTabChange={(e) => {
          setActiveIndex(tabModel[e.index].index)
        }}
        style={{marginBottom: "1rem"}}
      />

      {/* CART ORDER */}

      {activeIndex === 0 && !!cartOrder && <>

        <div className="cart-order-ui-container"
          style={{
            maxWidth: wSize === 'lg' ? "56rem" : "28rem",
            marginInline: wSize === 'lg' ? "" : ".5rem",
            margin: "auto",
          }}
        >

          <div className="cart-order-ui-body"
            style={wSize === 'lg'
              ? {
                display: "flex", 
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "1.5rem",
              }
              : {
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "center", 
                width: "100%",
              }
            }
          >
            <div className="column-1" 
              style={{
                flex: wSize === 'lg' ? "0 0 26rem" : "" 
              }}
            >
              {wSize !== 'lg' &&
                <CartHeaderSummary 
                  showOrderDateDialog={showOrderDateDialog}
                  setShowOrderDateDialog={setShowOrderDateDialog}
                  {...cartProps}
                  {...dateProps}
                  wSize={wSize}
                  user={user}
                />
              }

              <div className="calendar-fulfillment-container"
                style={wSize === 'lg'
                  ? {
                    display: "flex", 
                    flexDirection: "column", 
                  }
                  : {
                    display: "flex", 
                    justifyContent: "space-between", 
                    flexDirection: "row-reverse", 
                    gap: "1rem",
                    //maxWidth: '25.5rem',
                  }
                }
              >
                <CartCalendar 
                  // delivDate={delivDateJS}
                  // setDelivDate={setDelivDateJS}
                  // ORDER_DATE_DT={ORDER_DATE_DT}
                  // dateUpdated={dateUpdated}
                  {...dateProps}
                  locNick={locNick}
                  inline={wSize === 'lg'}
                  showHolidays={user.authClass !== 'bpbfull'}
                />

                <AddItemMenu
                  products={products}
                  {...cartProps}
                  dateProps={dateProps}
                  //{...dateProps}
                  //cartHeader={cartHeader}
                  //cartItems={cartItems}
                  //cartMeta={cartMeta}
                  //setCartItems={setCartItems}
                  showSidebar={showSidebar}
                  setShowSidebar={setShowSidebar}
                  selectedProdNick={selectedCartProdNick}
                  setSelectedProdNick={setSelectedCartProdNick}
                  selectedQty={selectedCartQty}
                  setSelectedQty={setSelectedCartQty}
                  disableInputs={disableInputs}
                  deactivated={deactivated}
                  user={user}
                  wSize={wSize}
                  mode={wSize === 'lg' ? 'card' : 'sidebar'}
                  cardStyle={{marginBlock: "1rem"}}
                />

                <FulfillmentDropdown
                  location={location}
                  cartHeader={cartHeader}
                  setCartHeader={setCartHeader}
                  disabled={disableInputs}
                  containerStyle={{
                    width: wSize === 'lg' ? "17rem" : undefined,
                    flex: wSize === 'lg' ? undefined : "0 1 100%", 
                  }}
                />
 
              </div>

              <div style={{
                width: wSize === 'lg' ? "17rem" : "100%",
                marginBlock: "1rem",
              }}>
                <ItemNoteInput 
                  cartHeader={cartHeader}
                  setCartHeader={setCartHeader}
                  disabled={disableInputs}
                />
              </div>

            </div> {/* End column-1 */}

            <div className="column-2 bpb-datatable-orders"
              style={{
                width: "100%", 
                maxWidth: "28rem",
              }}
            >

              {wSize === 'lg' &&
                <CartHeaderSummary
                  showOrderDateDialog={showOrderDateDialog}
                  setShowOrderDateDialog={setShowOrderDateDialog}
                  {...cartProps}
                  {...dateProps}
                  wSize={wSize}
                  user={user}
                />
              }
              
              {!!products && !!cartItems && !!delivDateJS && (!isXmas || user.authClass === 'bpbfull') &&
                <CartItemDisplay
                  {...cartProps}
                  cartCache={cartCache}
                  dateProps={dateProps}
                  wSize={wSize}
                  user={user}
                  location={location}
                  products={products}
                  setShowSidebar={setShowSidebar}
                  orderHasChanges={orderHasChanges}
                  disableInputs={disableInputs}
                  deactivated={deactivated}
                />
              }
            </div> {/* End column-2 */}

          </div> {/* End cart-order-ui-body */}

        </div>
      </>}

      {/* STANDING ORDER */}

      {!standingBlacklist.includes(user.locNick) && activeIndex === 1 && 
        <div className="standing-order-ui-container"
          style={{
            maxWidth: wSize === 'lg' ? "56rem" : "28rem",
            margin: "auto",
            marginInline: wSize === 'lg' ? "" : ".5rem",
            marginTop: "2rem"
        }}>

          <AddStandingItemMenu 
            standingItems={standingItems}
            setStandingItems={setStandingItems}
            products={products}
            wSize={wSize}
            locNick={locNick}
            user={user}
            disabled={disableInputs}
            showStandingSidebar={showStandingSidebar}
            setShowStandingSidebar={setShowStandingSidebar}
            selectedDisplayProdNick={selectedDisplayProdNick}
            setSelectedDisplayProdNick={setSelectedDisplayProdNick}
            cardStyle={{ 
              marginBlock: "1.5rem",
              width: "26rem",
            }}
          />
  
          <StandingItemDisplay 
            user={user} 
            locNick={locNick} 
            {...standingProps}
            {...dateProps}
            wSize={wSize}
            disabled={disableInputs}
            location={location}
            products={products}
            setShowStandingSidebar={setShowStandingSidebar}
            selectedProdNick={selectedDisplayProdNick}
            setSelectedProdNick={setSelectedDisplayProdNick}
          />
        </div>
      }

      {/* RETAIL ORDER */}

      {user.authClass === 'bpbfull' && activeIndex === 2 &&
        <RetailOrders />
      }

      {activeIndex === 3 &&
        <div>
            <Accordion >
              <AccordionTab header="Cart Orders">
                <h4>Basic Ordering</h4>
                <ul>
                  <li>
                    Select a date using the calendar. If you're on a small screen,
                    click/tap on the 'Date' field to show the calendar.
                  </li>
                  <li>
                    Use the dropdown menu to find your product. You can use the 
                    search bar to filter your options. For small screens, use 
                    the "Add" button to display product selection.
                  </li>
                  <li>
                    Pick a quantity and click the nearby "Add" button. Quantites 
                    for added items can also be changed in the main list. Note 
                    that some of our products are counted in packs. 
                  </li>
                  <li>
                    Use the "Submit Order" button to complete your order.
                  </li>
                </ul>

                <p>
                  Your calendar will be hilighted a darker gray on the selected 
                  date to indicate that a cart order has been set.
                </p>
                <h4>Fulfillment Options</h4>

                <p>
                  Your order can be set for {
                    !['slopick', 'atownpick'].includes(location?.zoneNick) 
                      && "delivery, or for "
                  }pickup at either of our locations. Orders will be preset
                  to handle your usual needs, but take care when you set
                  this option manually. If you pick an unintended option, your
                  order will end up in the wrong place!
                </p>

                <h4>Delivery Note</h4>
                <p>
                  Delivery notes will be printed on our paper invoices and are 
                  meant to assist with your own record keeping.
                </p>
                <p>
                  For now, we're better equipped to handle special requests 
                  for your order through the hotline.
                </p>
              </AccordionTab>

              {!standingBlacklist.includes(user.locNick) &&
                <AccordionTab header="Standing Orders">
                  <h4>Basic Ordering</h4>
                  <p>
                    Standing orders allow you to set recurring orders 
                    for a given day of the week.
                  </p>
                  <ul>
                    <li>
                      Use the dropdown menu to find your product. You can use the 
                      search bar to filter your options. For small screens, use 
                      the "Add" button to display product selection.
                    </li>                 
                    <li>
                      Fill out your grid with your desired quantites for each day 
                      of the week and for each product.
                    </li>
                    <li>
                      Finish by using the "Submit Changes" button.
                    </li>
                  </ul>

                  <p>
                    To prevent conflicts with individual product lead times, 
                    new changes to your standing order will need 4 days to start
                    up. If you need to adjust your orders sooner than that, you
                    can place cart orders for dates in that transition period.
                  </p>

                  <p>
                    Unedited standing orders will be hilighted light-gray on your 
                    cart order calendar.
                  </p>
                </AccordionTab>
              }

              <AccordionTab header='"Did My Order Go Through?"'>
                <p>
                  A confirmation message will pop up when your order is 
                  successfully submitted. Click the button below to see what 
                  it looks like.
                </p>
                <Button 
                  label="Show Confirmation"
                  onClick={()=>{
                    toastRef.current.show({ 
                      summary: 'Confirmed', 
                      detail: 'Order received', 
                      severity: 'success', 
                      life: 8000
                    })
                  }}
                />
                <Toast 
                  ref={toastRef} 
                  style={{ width: "15rem", opacity: ".98" }}
                />
                <p>
                  Cart orders that have been successfully submitted will also 
                  display when the most recent changes were made.
                </p>
                <p>
                  If something stange happens and you're still not sure if we 
                  got your order, try refreshing the page. What you see after
                  that will be the most up-to-date info stored on our
                  computers. If everything looks correct, then your order was
                  successfully submitted.
                </p>
              </AccordionTab>

              <AccordionTab header="Lead Times">
                <p>
                  Most of our products have a 2 or 3 day lead time. Items/quantities 
                  cannot be added to orders inside the lead time 
                  window and will be marked as "in production."
                </p>
              </AccordionTab>

              <AccordionTab header="Cutoff Time">
                <p>
                  Orders placed after 8:00pm will be handled as if made the next
                  day, which may affect product availability.
                </p>
              </AccordionTab>

              <AccordionTab header="Favorite Products">
                <p>
                  You can toggle products as favorites by clicking/tapping the 
                  star icon next to a product listed in the dropdown menu. Favorites 
                  allow for easy access to your most frequently ordered items.
                </p>
              </AccordionTab>
            </Accordion>


        </div>
      }

    </div>
  )  


}



// *****************************************************************************

// Add metadata to order items to assist with display & input behavior
const getCartItemMeta = (cartItems, products, user, dateProps) => {
  if (!cartItems || !products || !user) return undefined
  const { isDelivDate, isPastDeliv, ORDER_DATE_DT } = dateProps

  const metaList = cartItems.map(item => {
    const { prodNick, baseQty, qty, qtyUpdatedOn, sameDayMaxQty } = item
    const product = products[prodNick]
    const { 
      inProd, 
      isValid, 
      //isAvailable 
    } = product.meta.assignedRouteSummary
  
    const timingStatus = isPastDeliv ? 'past' 
      : isDelivDate ? 'deliv' 
      : inProd ? 'prod' 
      : '' 
    const sameDayUpdate = 
      getWorkingDateTime(qtyUpdatedOn).toMillis() === ORDER_DATE_DT.toMillis()
    
    // max for non-admin users   
    // const maxQty = !isValid ? 0
    //   : inProd ? (sameDayUpdate ? sameDayMaxQty : baseQty)
    //   : 999
    // removing isValid so that users can fix errors by setting qtys to 0 
    // in addition to changing fulfillment option
    const maxQty = inProd 
      ? (sameDayUpdate ? sameDayMaxQty : baseQty)
      : 999
    
    const qtyChanged = qty !== baseQty
    const disableInput = (user.authClass === 'bpbfull' && isPastDeliv)
      || (user.authClass !== 'bpbfull' && (isDelivDate || isPastDeliv))
      || (user.authClass !== 'bpbfull' && maxQty === 0)
      || (user.authClass !== 'bpbfull' && !product.defaultInclude)
    
    const meta = { 
      timingStatus, 
      sameDayUpdate, 
      maxQty, 
      qtyChanged, 
      disableInput,
      routeIsValid: isValid,
      productIsInProd: inProd,
    } 
    
    return [prodNick, meta] 
  }) // End map
  return Object.fromEntries(metaList)

}