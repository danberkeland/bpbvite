import React, { useEffect, useMemo, useRef, useState } from "react"

import { useSettingsStore } from "../../../Contexts/SettingsZustand"
import { DT } from "../../../utils/dateTimeFns"
import { TabMenu } from "primereact/tabmenu"
import { Dialog } from "primereact/dialog"
import { CartTab } from "./Tabs/Cart/CartTab.jsx"
import { StandingTab } from "./Tabs/Standing/StandingTab.jsx"
import { RetailTab } from "./Tabs/Retail/RetailTab.jsx"
import { HelpTab } from "./Tabs/Help/HelpTab.jsx"
import { AdminControls } from "./Components/AdminControls.jsx"

import { buildTabModel } from "./Tabs/tabModel.js"
import { useOrderingPageData } from "./orderingPageData.js"
import { DBLocation } from "../../../data/types.d.js"
import { useWindowSize } from "../../../utils/useWindowSize.js"

import "./ordering.css"
import { DateObj } from "./orderingTypes.d.js"
import { getSelectedDateList } from "./orderingPageCalcs.js"
import { isEqual } from "lodash"

const OrdersPage = () => {
  const user = useSettingsStore(state => ({
    name: state.user,
    sub: state.userName,
    authClass: state.authClass,
    locNick: state.currentLoc,
  }))

  // Page settings
  const [authClass, setAuthClass] = useState(user.authClass)
  const [locNick,   setLocNick]   = useState(user.locNick)

  const tabModel = buildTabModel(authClass, locNick)
  const [activeIndex, setActiveIndex] = useState(0)

  const [showLocationDialog, setShowLocationDialog] = useState(false)
  const windowSize = useWindowSize()
  const isMobile = windowSize.width < 700
  const isNarrowDisplay = windowSize.width < 410
  const bottomRef = useRef(null)

  // ***** Dates in various formats *****
  const localNowDT = DT.localNow()
  const bpbNowDT = localNowDT.setZone('America/Los_Angeles')
  const todayDT = bpbNowDT.startOf('day')
  const orderDT = bpbNowDT.plus({ hours: 4 }).startOf('day')

  const [delivDtBegin, setDelivDtBegin] = 
    useState(localNowDT.plus({ days: 1 }).startOf('day'))

  const [delivDtEnd, setDelivDtEnd] = 
    useState(null)

  const calendarDateRange = [
    delivDtBegin.toJSDate(), 
    !!delivDtEnd ? delivDtEnd.toJSDate() : null
  ]

  /**@type {DateObj[]}*/
  const selectedDates = useMemo(() => 
    getSelectedDateList(delivDtBegin, delivDtEnd), 
    [delivDtBegin, delivDtEnd]
  )
  //const dateProps = { delivDtBegin, setDelivDtBegin, delivDtEnd, setDelivDtEnd }

  const resetDate = () => {
    setDelivDtBegin(localNowDT.plus({ days: 1}).startOf('day'))
    setDelivDtEnd(null)
  }

  // Calendar action compatible with "single" or "range" selection modes.
  const changeDelivDate = jsDateOrDates => {
    if (Array.isArray(jsDateOrDates)) {
      const dt0 = DT.fromJs(jsDateOrDates[0])
      const dt1 = DT.fromJs(jsDateOrDates[1])

      setDelivDtBegin(dt0)
      setDelivDtEnd(dt1.isValid ? dt1 : null)

    } else {
      setDelivDtBegin(DT.fromJs(jsDateOrDates).startOf('day'))
      setDelivDtEnd(null)

    }

  }

  const {
    locations,
    location,
    products,
    productInfo,
    cartOrders,
    cartOrderInfo,
    templateOrderItems,
    calendarSummary,
    // standing,
  } = useOrderingPageData(
    user, 
    locNick, 
    orderDT,
    selectedDates,
    true
  )

  const [cartChanges, setCartChanges] = useState()
  useEffect(() => setCartChanges(structuredClone(cartOrders)), [cartOrders])

  // const headerHasChangesByIdx = !!cartOrders && !!cartChanges 
  //   ? cartChanges.map((ccOrder, idx) => 
  //     !isEqual(ccOrder.header, cartOrders?.[idx].header)
  //   )
  //   : []
  // const headerChangeExists = headerHasChangesByIdx.some(flag => flag === true)

  // const itemsHaveChangesByIdx = !!cartOrders && !!cartChanges 
  //   ? cartChanges.map((ccOrder, idx) => 
  //       ccOrder.items.some((item, itemIdx) => {
  //         const baseItem = cartOrders[idx].items[itemIdx] ?? null
  //         return (!baseItem && item.qty !== 0) || (!!baseItem && baseItem.qty !== item.qty) 
  //       })
  //   )
  //   : []
  // const itemChangeExists = itemsHaveChangesByIdx.some(flag => flag === true)

  // const changeDetected = headerChangeExists || itemChangeExists

  const cartInfo = cartChanges?.map((changeOrder, orderIdx) => {
    const baseOrder = cartOrders?.[orderIdx]

    const headerHasChange = !!baseOrder && !isEqual(changeOrder.header, baseOrder.header)
    const itemSummaries = changeOrder.items.map((item, itemIdx) => {
      const baseItem = baseOrder?.items[itemIdx]
      const hasChange = (!baseItem && item.qty !== 0) || (!!baseItem && baseItem.qty !== item.qty) 

      const maxQty = ''
      const shouldDisableQtyInput = ''


      return {
        hasChange,
        maxQty,
        shouldDisableQtyInput,
      }

    })

    return {
      hasChange: headerHasChange || itemSummaries.some(item => item.hasChange),
      header: {
        hasChange: headerHasChange
      },
      items: itemSummaries,
      
    }
  }) ?? []

  const changeDetected = cartInfo.some(orderSummary => orderSummary.hasChange)


  /**
   * for admin control
   * @param {DBLocation} newLocation 
   */
  const changeLocation = (newLocation) => {
    setLocNick(newLocation?.locNick)
    resetDate()
    setCProduct(null)
    setCProductDisplay(null)
    setSProduct(null)
    //setCartChanges(null)
    window.scrollTo(0,0)
  }

  /**
   * Watch out: if your update item has a property, it will get written
   * to the header at the specified index, even if the value is null/undefined.
   * 
   * Only include the props you intend to update!
   * @param {number} index
   * @param {Object} updateItem
   * @param {string|null} [updateItem.ItemNote]
   * @param {string|null} [updateItem.route]
   */
    const updateCartHeader = (index, updateItem) => {
      if (index >= cartChanges.length || index < 0) {
        console.error("Index out of bounds")
        return
      }
  
      let newState = structuredClone(cartChanges)
      for (let key in updateItem) {
        newState[index].header[key] = updateItem[key]
      }
      
      setCartChanges(newState)
  
    }

  const updateCartItemQty = (
    orderIdx, 
    itemIdx, 
    newQty
  ) => {
    if (orderIdx >= cartChanges.length || orderIdx < 0) {
      console.error("order idx out of bounds")
    }
    if (itemIdx >= cartChanges[orderIdx].items.length || itemIdx < 0) {
      console.log(cartChanges)
      console.error("item idx out of bounds")
    }
    console.log("new qty:", newQty)
    let newState = structuredClone(cartChanges)

    newState[orderIdx].items[itemIdx].qty = newQty
    setCartChanges(newState)
  }

  const appendCartItem = (orderIdx, cartItem, qty) => {
    const newCartItem = {
      ...cartItem,
      qty,
      meta: { ...cartItem.meta, idx: cartChanges[orderIdx].items.length }
    }

    let newState = structuredClone(cartChanges)
    newState[orderIdx].items.push(newCartItem)
    setCartChanges(newState)
  }

  // Product Selection
  const [cProduct, setCProduct] = useState(null) // Cart
  const [cProductDisplay, setCProductDisplay] = useState(null)

  const productSelectorProps = {
    products, // will get processed into options list at the component
    value: cProduct,
    setValue: setCProduct,
    displayValue: cProductDisplay,
    setDisplayValue: setCProductDisplay,

    location,
    authClass,
    disabled: false,
    cartChanges,
    bottomRef,
  }

  

  // Standing Orders

  // Product Selection
  const [sProduct, setSProduct] = useState(null) // Standing
  const handleStandingProductSelection = newProduct => setSProduct(newProduct)




  // **********************************************************************
  // * Prop Groupings                                                     *
  // **********************************************************************

  // Cart Tab

  const cartProps = {
    orderDT,
    selectedDates,
    // delivDates: selectedDates.map(D => D.iso),
    cartOrders,
    cartChanges,
    templateOrderItems,
    products,
    productInfo,
    updateCartItemQty,
    appendCartItem,
    location,
    authClass,
  }

  const cartHeaderProps = {
    delivDTList: selectedDates.map(D => D.DT), 
    cartChanges,
    updateCartHeader,
    todayDT,
    orderDT,
    location,
  }

  const cartCalendarProps = {
    todayDT,
    delivDTList: selectedDates.map(D => D.DT),
    changeDelivDate,
    calendarDateRange,
    calendarSummary,
    locNick,
    location,
  }

  const adminControlsComponent = 
    <AdminControls 
      authClass={authClass}
      setAuthClass={setAuthClass}
      location={location}
      changeLocation={changeLocation}
      locations={locations}
      disableLocationControl={activeIndex > 2}
      setShowLocationDialog={setShowLocationDialog}
    />

  return (<>
    <div className="ordering-v2-body"
      style={{paddingInline: isMobile ? "" : "1rem"}}
    >
      <TabMenu 
        model={tabModel} 
        activeIndex={activeIndex} 
        onTabChange={(e) => setActiveIndex(tabModel[e.index].index)}
        style={{paddingBottom: "1rem", maxWidth: "58rem", margin: "auto"}}
      />

      {activeIndex === 0 && <>
        <CartTab 
          isMobile={isMobile}
          cartProps={cartProps}
          productSelectorProps={productSelectorProps}
          headerProps={cartHeaderProps}
          calendarProps={cartCalendarProps}
          dateProps={{
            bpbNowDT,
            orderDT,
          }}
        >
          {user.authClass === 'bpbfull' && user.locNick === 'backporch' &&
            adminControlsComponent
          }
        </CartTab>
        {changeDetected && <div>CHANGE DETECTED</div>}
      </>}
      {activeIndex === 1 && 
        <StandingTab 
        
        >
          {user.authClass === 'bpbfull' && user.locNick === 'backporch' &&
            adminControlsComponent
          }
        </StandingTab>
      }
      {activeIndex === 2 && <RetailTab />}
      {activeIndex === 3 && <HelpTab />}

      <Dialog 
        visible={showLocationDialog}
        onHide={() => setShowLocationDialog(false)}
        header={location?.locName}
        headerStyle={{gap: "2rem"}}
      >
        {locationDialogContent(location)}
      </Dialog>


    </div>
    <div className="-ordering-page-bottom-div" ref={bottomRef}></div>
  </>)

}

export {
  OrdersPage
}

const locationDialogContent = (location) => {

  if (!location) return null
  return (
    <>
      <pre>zone: {location.zoneNick}</pre>
      {!location.zoneNick.includes('pick') && 
        <pre>
          availability: {location.latestFirstDeliv} - {location.latestFinalDeliv}
        </pre>
      }
      <pre>routes:</pre>
      {location?.meta?.servingRoutes?.map((R, idx) => 
        <pre key={`-rt-srv-${idx}`}>
          {R.routeNick} {R.timeBegin} - {R.timeEnd}
        </pre>
      )}
      <pre>{JSON.stringify(location?.meta, null, 2)}</pre>
    </>
  )
  
}