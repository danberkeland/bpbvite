import { useEffect, useRef, useState } from "react"
import { useSettingsStore } from "../../../Contexts/SettingsZustand"
import { OrderingTabMenu } from "./ComponentTabMenu"
import { useOrderingData } from "./useOrderingData"
import { DT } from "../../../utils/dateTimeFns"
import { DBLocation, DBOrder, FulfillmentOption } from "../../../data/types.d"
import { OrderingAdminControls } from "./ComponentAdminControls"
import { CartCalendar } from "./ComponentCartCalendar"
import { useWindowSize } from "../../../utils/useWindowSize"
import { CartHeader } from "./ComponentCartHeader"
import { CartFulfillmentDropdown } from "./ComponentCartFulfillmentDropdown"
import { PICKUP_ZONES } from "../../../constants/constants"
import { CartItemProductToggler } from "./ComponentCartItemProductToggler"
import { compareBy, countBy, countByRdc } from "../../../utils/collectionFns"
import { ProductSelectorList } from "./ComponentProductSelectorList"
import { CartItemList } from "./ComponentCartItemList"
import { CreateOrderInput } from "../../../data/order/types.d"
import { ProductSelector } from "./ComponentProductSelector"
import { Toast } from "primereact/toast"

const CART_IDX = 0
const STANDING_IDX = 1
const RETAIL_IDX = 2
const HELP_IDX = 3

const PageOrdering = () => {
  const user = useSettingsStore(state => ({
    name: state.user,
    sub: state.userName,
    authClass: state.authClass,
    locNick: state.currentLoc,
  }))

  const windowSize = useWindowSize()
  const isMobile = windowSize.width < 700
  const isNarrowDisplay = windowSize.width < 410

  const toastRef = useRef(null)

  const todayDT = DT.today()
  const [delivDT, setDelivDT] = useState(todayDT.plus({ days: 1 }))
  const handleDateChange = jsDate => {
    console.log(jsDate)
    setDelivDT(DT.fromJs(jsDate))
  }

  // Page settings
  const [authClass, setAuthClass] = useState(user.authClass)
  const [locNick,   setLocNick]   = useState(user.locNick)
  useEffect(() => setLocNick(user.locNick), [user.locNick])

  const {
    location,
    locations,
    products,
    customizedProducts,
    fulfillmentOptions,
    FAVR,
    cartOrder,
  } = useOrderingData({ delivDT, locNick, user, shouldFetch: true})

  const [cartChanges, setCartChanges] = useState(/** @type {(CreateOrderInput|DBOrder)[]} */([]))
  const [fulfillmentOption, setFulfillmentOption] = useState(/** @type {FulfillmentOption} */ 'deliv') // independent header state needed when order has 0 items.
  const [ItemNote, setItemNote] = useState('')                   // header values otherwise treated as though derived from items.
  const [delivFee, setDelivFee] = useState(/** @type {number|null} */(null))
  useEffect(() => {
    if (!!cartOrder && !!fulfillmentOptions) {
      setCartChanges(structuredClone(cartOrder))
      setFulfillmentOption(cartOrder[0]?.route ?? fulfillmentOptions.find(option => option.isDefault)?.value)
      setItemNote(cartOrder[0]?.ItemNote ?? "")
      setDelivFee(cartOrder[0]?.delivFee ?? null)
    }
  }, [cartOrder])


  /**
   * for admin control
   * @param {DBLocation} newLocation 
   */
  const changeLocation = (newLocation) => {
    setLocNick(newLocation?.locNick)
    setDelivDT(todayDT.plus({ days: 1 }))
    setCartChanges([])
    window.scrollTo(0,0)
  }

  const [activeIndex, setActiveIndex] = useState(CART_IDX)
  const tabMenuComponent = OrderingTabMenu({
    authClass: user.authClass,
    locNick,
    activeIndex, 
    setActiveIndex,
    style: {paddingBottom: "1rem", maxWidth: "58rem", margin: "auto"},
  })

  const adminControlsComponent = user.authClass === 'bpbfull'
    ? OrderingAdminControls({
        authClass, 
        setAuthClass,
        location, 
        locations,
        changeLocation,
        disableLocationControl:false,
      })
    : undefined

  //  Cart Components
  // =================
  
  const [selectedProdNicks, setSelectedProdNicks] = useState({})
  const nItemsSelected = countBy(Object.values(selectedProdNicks), v => v === true)
  const [query, setQuery] = useState('')

  const [itemViewMode, setItemViewMode] = useState('cart')
  // console.log("itemViewMode", itemViewMode)
  const changeToCartView = () => {
    setItemViewMode('cart')
    /** @type {(CreateOrderInput | DBOrder)[]} */
    const productsToAdd = Object.entries(selectedProdNicks)
      .filter(entry => entry[1] === true)
      .map(entry => ({
        Type: "Orders",
        isWhole: true,
        delivDate: delivDT.toFormat('yyyy-MM-dd'),
        locNick,
        route: fulfillmentOption,
        delivFee,
        ItemNote,
        prodNick: entry[0],
        qty: 0,
        qtyShort: null,
        rate: customizedProducts?.find(P => P.prodNick === entry[0])?.wholePrice
          ?? products?.find(P => P.prodNick === entry[0])?.wholePrice,
        SO: null,
        updatedBy: user.name
      }))

    if (productsToAdd.length > 0) {
      toastRef.current.show({
        severity: 'info',
        summary: `${productsToAdd.length} items added.`,
      })
    }
    setCartChanges(cartChanges.concat(productsToAdd).sort(compareBy(order => products?.find(P => P.prodNick === order.prodNick)?.prodName ?? '')))
    setSelectedProdNicks({})
  }
  const changeToAddView = () => {
    setItemViewMode('add')
  }
  useEffect(() => {
    if (!isMobile) {
      if (activeIndex === 0) {
        changeToCartView()
      }
    }
  }, [isMobile])


  const handleFulfillmentOptionChange = newRoute => {
    if (!!newRoute) {
      setCartChanges(cartChanges.map(item => ({ ...item, route: newRoute })))
      setFulfillmentOption(newRoute)
    }
  }

  return (
    <div style={{maxWidth: "58rem", margin: "auto", paddingTop: "1rem"}}>
      
      {tabMenuComponent}
      <div>
        {activeIndex === CART_IDX &&
          <div style={isMobile ? {} : lgGridLayout}>
            <div>
              {adminControlsComponent}
              <CartHeader 
                delivDT={delivDT} 
                fulfillmentDropdownComponent={() =>
                  CartFulfillmentDropdown({ 
                    options: fulfillmentOptions,
                    currentOption: fulfillmentOption, 
                    handleChange: handleFulfillmentOptionChange, 
                    delivDT,
                  })
                }
                cartCalendarComponent={({ displayMode }) => 
                  <CartCalendar
                    todayDT={todayDT}
                    delivDT={delivDT}
                    handleDateChange={handleDateChange}
                    calendarSummary={{}}
                    displayMode={displayMode}
                  />
                }
                isMobile={isMobile}
              /> 
              {!isMobile && 
                <CartCalendar
                  todayDT={todayDT}
                  delivDT={delivDT}
                  handleDateChange={handleDateChange}
                  calendarSummary={{}}
                  displayMode='inline'
                />
              }
            </div>
            <div>
              {(isMobile) && 
                <CartItemProductToggler 
                  itemViewMode={itemViewMode}
                  changeToCartView={changeToCartView}
                  changeToAddView={changeToAddView}
                  nItemsSelected={nItemsSelected}
                />
              }
              {(isMobile && itemViewMode === 'add') && 
                <ProductSelectorList
                  locNick={locNick}
                  products={customizedProducts}
                  selectedProdNicks={selectedProdNicks}
                  setSelectedProdNicks={setSelectedProdNicks}
                  FAVR={FAVR}
                  orderChanges={cartChanges}
                  query={query}
                  setQuery={setQuery}
                />
              } 
              {/* {(!isMobile) &&
                <ProductSelector 
                  inputRef
                  addButtonRef
                  products={}
                  searchFields
                  value
                  setValue
                  displayValue
                  setDisplayValue
                  location
                  authClass
                  disabled
                  cartChanges
                  bottomRef
                />
              } */}
              {(!isMobile || itemViewMode === 'cart') &&
                <CartItemList
                  cartOrder={cartOrder}
                  cartChanges={cartChanges}
                  setCartChanges={setCartChanges}
                  products={products}
                  isMobile={isMobile}
                />
              }       
            </div>
          </div>
        }
      </div>
      <Toast ref={toastRef} />
    </div>
  )
}

export { PageOrdering as default }


/** @type {React.CSSProperties} */
const lgGridLayout = {
  display: "grid",
  gridTemplateColumns: "calc(50% - .5rem) calc(50% - .5rem)",
  columnGap: "1rem",
}


