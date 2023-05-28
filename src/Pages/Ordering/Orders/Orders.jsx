import React, { useState, useEffect, useMemo } from "react"

import { TabMenu } from "primereact/tabmenu"
import { Dialog } from "primereact/dialog"

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
import { useWindowSizeDetector } from "../../../functions/detectWindowSize"
import { getWorkingDateTime } from "../../../functions/dateAndTime"
import { useLocationDetails } from "./data/locationHooks"
import { isEqual } from "lodash"
import { StandingItemDisplay } from "./Components/StandingComponents/StandingItemDisplay"


// Constants, Non-Reactive Data ************************************************
/**
 * Compatible with JSDates .getDay() conventions. If using luxon's 
 * DateTime.weekday(), use '% 7' first to change Sunday from 7 to 0.
 */
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const cartTabModel = [
  {label: 'Cart Orders', icon: 'pi pi-fw pi-shopping-cart'}
]
const standingTabModel = [
  {label: 'Standing Orders', icon: 'pi pi-fw pi-calendar'},
]

const standingBlacklist = ['high', 'hios', 'sandos']


// *****************************************************************************
// Component
// *****************************************************************************
export const Orders = ({ useTestAuth }) => {
  const windowSize = useWindowSizeDetector()
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


  const tabModel = standingBlacklist.indexOf(user.locNick) === -1
    ? cartTabModel.concat(standingTabModel)
    : cartTabModel

  const [locNick, setLocNick] = useState(user.locNick)

  // Date data
  const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
  const ORDER_DATE_DT = DateTime.now().setZone('America/Los_Angeles')
    .plus({ hours: 4 }).startOf('day')
  const pastCutoff = todayDT.toMillis() !== ORDER_DATE_DT.toMillis()

  const [delivDateJS, setDelivDateJS] = useState(
    ORDER_DATE_DT.plus({ days: 1 }).toJSDate()
  )
  const delivDateDT = DateTime.fromJSDate(delivDateJS)
  const delivWeekday = weekdays[delivDateJS.getDay()]
  const orderLeadTime = Interval
    .fromDateTimes(getWorkingDateTime('NOW'), delivDateDT).length('days')
  const isDelivDate = orderLeadTime === 0
  const isPastDeliv = isNaN(orderLeadTime)
  const dateProps = { 
    ORDER_DATE_DT,
    delivDateJS, delivDateDT, delivWeekday, 
    orderLeadTime, isDelivDate, isPastDeliv
  }
  //const [dayOfWeek, setDayOfWeek] = useState()
  const [activeIndex, setActiveIndex] = useState(0)
  const [showSidebar, setShowSidebar] = useState(false)

  // **********************************
  // DATA
  // **********************************
  const shouldFetch = !!locNick

  // Location *************************
  const { data:location } = useLocationDetails({ locNick, shouldFetch })

  // Order ****************************
  const [showOrderDateDialog, setShowOrderDateDialog] = useState(false)
  const { data:cartOrder } = useFullOrderByDate({ 
    locNick, delivDateJS, shouldFetch 
  })
  const cartCache = useCartDataByLocation({ locNick, shouldFetch })

  const [cartHeader, setCartHeader] = useState({})
  const [cartItems, setCartItems] = useState([])
  useEffect(() => {
    setCartHeader(cartOrder?.header ?? {})
    setCartItems(cartOrder?.items ?? [])

  }, [cartOrder])

  const orderHasChanges = cartItems.some(item => item.qty !== item.baseQty)  
    || (
      !isEqual(cartOrder?.header ?? {}, cartHeader)
      && cartItems.some(item => 
        item.orderType !== 'T' && item.qty !== item.baseQty
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
    // if (!standingData) return undefined
    // setStandingHeader(standingData.header)
    // setStandingItems(standingData.items)
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

  const fulfillmentString = cartHeader 
    ? cartHeader.route === 'deliv' 
      ? "Delivery"
      : "Pickup"
    : "Order"

  const relativeDateString = orderLeadTime === 0 
    ? `(Today)${user.authClass !== 'bpbfull' ? " ― Read Only" : ""}`
    : orderLeadTime === 1 
      ? "(Tomorrow)"
      : orderLeadTime > 1 ? `(Today +${orderLeadTime})`
    : ` (Yesterday) ${user.authClass !== 'bpbfull' ? " ― Read Only" : ""}`

  const headerMessage = <>
    <span style={{display: "inline-block"}}>
      {`${fulfillmentString} for ${delivDateDT.toFormat('EEEE')}, `}

    </span> <span style={{display: "inline-block"}}>
      {delivDateDT.toFormat('MMM d')}
      
    </span> <span style={{display: "inline-block"}}>
      {relativeDateString}
    </span>
  
  </>
  
  const mobileHeaderMessage = orderLeadTime > 0
    ? `For ${delivDateDT.toFormat('EEEE')} ${relativeDateString}`
    : orderLeadTime === 0
      ? `For Today ${user.authClass !== 'bpbfull' ? "― Read Only" : ""}`
      : `Yesterday ${user.authClass !== 'bpbfull' ? "― Read Only" : ""}`

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
        <div style={{ paddingBlock: "1rem" }}>
          <LocationDropdown
            locNick={locNick}
            setLocNick={setLocNick}
            // authClass={user.authClass}
            authClass={defaultAuth}
          />     
        </div>
      }

      <TabMenu 
        model={tabModel} 
        activeIndex={activeIndex} 
        onTabChange={(e) => setActiveIndex(e.index)} 
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
              <div className="cart-ui-header"
                style={{
                  color: "hsl(37, 100%, 5%)",
                  background: "var(--bpb-surface-content-header)",
                  padding: "1px 1rem",
                  marginBlock: "1rem",
                  borderRadius: "3px",
                  boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
                    + " 0 1px 1px 0 rgba(0, 0, 0, 0.14),"
                    + " 0 1px 3px 0 rgba(0, 0, 0, 0.12)",
                }}
              >
                <h2 style={{marginBlock: ".75rem"}}>
                  {wSize === 'lg' ? headerMessage : mobileHeaderMessage}
                </h2>
                
                <div 
                  style={{
                    marginBottom: ".75rem", 
                    display: "inline-flex", 
                    justifyContent: "start",
                    alignItems: "center",
                    gap: ".25rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowOrderDateDialog(true)}
                >
                  <span>
                    {"Your order date: "}
                  </span>
                  <span style={{
                    color: pastCutoff ? "hsl(0, 96%, 38%)" : undefined, 
                    fontWeight: pastCutoff ? "bold" : undefined, 
                    paddingInline: ".25rem"
                  }}>
                    {ORDER_DATE_DT.toFormat('MMM d')}
                  </span>
                  <i className="pi pi-fw pi-question-circle" 
                    style={{color: 'hsl(218, 65%, 50%)'}}
                  />
              </div>

            </div>

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
                  delivDate={delivDateJS}
                  setDelivDate={setDelivDateJS}
                  ORDER_DATE_DT={ORDER_DATE_DT}
                  locNick={locNick}
                  inline={wSize === 'lg'}
                />

                <AddItemMenu
                  products={products}
                  // {...cartProps}
                  {...dateProps}
                  cartHeader={cartHeader}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  cartMeta={cartMeta}
                  dateProps={dateProps}
                  user={user}
                  wSize={wSize}
                  mode={wSize === 'lg' ? 'card' : 'sidebar'}
                  showSidebar={showSidebar}
                  setShowSidebar={setShowSidebar}
                  disableInputs={disableInputs}
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
 
              </div> {/* End column-1 */}

              <div style={{
                width: wSize === 'lg' ? "17rem" : "100%",
                marginTop: "1rem",
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
                marginBlock: "1rem",
              }}
            >
              {!!products && !!cartItems && !!delivDateJS &&
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
                />
              }
            </div> {/* End column-2 */}

          </div> {/* End cart-order-ui-body */}

        </div>
      </>}

      {/* STANDING ORDER */}

      {standingBlacklist.indexOf(user.locNick) === -1 && activeIndex === 1 && 
        <div className="standing-order-ui-container"
          style={{
            maxWidth: wSize === 'lg' ? "54rem" : "28rem",
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
            location={location}
            products={products}
            setShowStandingSidebar={setShowStandingSidebar}
            selectedProdNick={selectedDisplayProdNick}
            setSelectedProdNick={setSelectedDisplayProdNick}
          />
        </div>
      }

      <Dialog visible={showOrderDateDialog}
        header="Cutoff at 8:00pm"
        onHide={() => setShowOrderDateDialog(false)}
        style={{maxWidth: "26rem", margin: ".75rem"}}
      >
        <p>
          Our system rolls forward at 8:00pm each day. 
        </p>
        <p>
          Orders may be placed after the cutoff but will be 
          treated as placed the next day.
        </p>
      </Dialog>

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