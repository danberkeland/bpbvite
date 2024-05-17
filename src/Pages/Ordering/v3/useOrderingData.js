import { keyBy } from "lodash"
import { combineOrders } from "../../../core/production/combineOrders"
import { useLocation, useLocations } from "../../../data/location/useLocations"
import { useLocationProductOverridesByLocNick } from "../../../data/locationProductOverride/useLocationProductOverrides"
import { overrideProduct, useOverrideProduct } from "../../../data/locationProductOverride/useOverrideProduct"
import { useOrdersByLocNick } from "../../../data/order/useOrders"
import { useProducts } from "../../../data/product/useProducts"
import { useStandingsByLocNick } from "../../../data/standing/useStandings"
import { useTemplateProdsByLocNick } from "../../../data/templateProd/useTemplateProd"
import { compareBy } from "../../../utils/collectionFns"
import { useMemo } from "react"
import { PICKUP_ZONES } from "../../../constants/constants"
import { useRoutes, useRoutes_v2 } from "../../../data/route/useRoutes"
import { useZoneRoutes } from "../../../data/zoneRoute/useZoneRoutes"

/** @type {import("../../../data/location/useLocations").DBLocationAttribute[]} */
const locationFields = [
  "locNick", 
  "locName", 
  "latestFirstDeliv",
  "latestFinalDeliv",
  "zoneNick",
  "dfFulfill",
]

/** @type {import("../../../data/product/useProducts").ProductKey[]} */
const productFields = [
  "prodNick",
  "prodName",

  "packSize",
  "packGroup",
  "doughNick",
  "defaultInclude",

  "isWhole",
  "wholePrice",
  "descrip",

  "isRetail",
  "retailPrice",
  "retailDescrip",

  "bakedWhere",
  "daysAvailable",
  "leadTime",
  "readyTime",
]



export const useOrderingData = ({
  delivDT,
  locNick,
  shouldFetch,
  user,
}) => {
  // console.log("USER", user)
  const delivDate = delivDT.toFormat('yyyy-MM-dd')
  const dayOfWeek = delivDT.toFormat('EEE')
  const isAdmin    = user.authClass === 'bpbfull'
  const isCustomer = user.authClass === 'customer'

  const { data:loc } = useLocation({ locNick, shouldFetch: !!locNick && isCustomer })
  const { data:LOC } = useLocations({ projection: locationFields, shouldFetch: isAdmin })
  const { data:PRD } = useProducts({ projection: productFields, shouldFetch: true })
  const { data:OVR } = useLocationProductOverridesByLocNick({ locNick, shouldFetch: !!locNick })
  const { data:ORD } = useOrdersByLocNick({ locNick, shouldFetch: !!locNick })
  const { data:STD } = useStandingsByLocNick({ locNick, shouldFetch: !!locNick })
  const { data:RTE } = useRoutes_v2({ shouldFetch: true })
  const { data:ZRT } = useZoneRoutes({ shouldFetch: true })

  
  const FAVR = useTemplateProdsByLocNick({ locNick, shouldFetch: !!locNick })

  const location = isAdmin ? LOC?.find(L => L.locNick === locNick)
    : isCustomer ? loc
    : undefined

  const isPickupLocation = PICKUP_ZONES.some(z => z === location?.zoneNick)
  const autoFulfillmentOption = isPickupLocation ? location?.zoneNick : 'deliv'
  const defaultFulfillmentOption = !location ? 'deliv'
    : !!location.dfFulfill ? location.dfFulfill
    : isPickupLocation ? location.zoneNick 
    : 'deliv'


  const getFulfillmentOptions = () => {
    if (!RTE || !ZRT || !location) return [{ 
      value: '', 
      label: '', 
      validDays: [true, true, true, true, true, true, true] 
    }]

    const getScheduledDays = zoneNick => [0, 1, 2, 3, 4, 5, 6].map(weekdayNum => 
      RTE.some(R => 1
        && ZRT.some(zrt => zrt.zoneNick === zoneNick && zrt.routeNick === R.routeNick)
        && R.RouteSched[weekdayNum] === true
      )
    )

    const _fflOpts = [
      { value: 'deliv',     label: 'Delivery' },
      { value: 'slopick',   label: 'Pickup in SLO' },
      { value: 'atownpick', label: 'Pickup in Atascadero' },
    ].map(option => ({
      value: option.value,
      label: option.label,
      isDefault: defaultFulfillmentOption === option.value,
      validDays: getScheduledDays(option.value === 'deliv' ? location.zoneNick : option.value)
    }))

    return isPickupLocation ? _fflOpts.slice(1) : _fflOpts
  }



  function getCustomizedProducts () {
    if (!PRD || !OVR) return undefined 
    return PRD
      .filter(P => {
        const productOverride = OVR.find(ovr => ovr.prodNick === P.prodNick)
        return (0 
          || isAdmin 
          || (1 
            && P.defaultInclude 
            && !productOverride?.defaultInclude === false
          )
          || productOverride?.defaultInclude === true
        ) && (P.isWhole === true)

      })
      .map(P => overrideProduct(P, locNick, OVR))
      .sort(compareBy(P => P.prodName))
  } 

  function getCartOrder () {
    if (!ORD || !STD || !OVR || !PRD || !autoFulfillmentOption) return undefined

    const orders = ORD.filter(order => order.delivDate === delivDate && order.isWhole === true)
    const stands = STD.filter(stand => stand.dayOfWeek === dayOfWeek && stand.isWhole === true && stand.isStand === true)

    // Make sure header props are constant among all items
    const orderFulfillmentOption = orders.find(order => !!order.route)?.route
    const fflOption = orderFulfillmentOption ?? autoFulfillmentOption
    const ItemNote = orders.find(order => !!order.ItemNote)?.ItemNote ?? ""
    const delivFee = orders.find(order => !!order.delivFee)?.delivFee ?? null

    const getUnitPrice = prodNick => null
      ?? OVR.find(O => O.prodNick === prodNick)?.wholePrice 
      ?? PRD.find(P => P.prodNick === prodNick)?.wholePrice 
      ?? -1

    return combineOrders(orders, stands, [delivDate])
      .map(order => ({
        ...order,
        rate: getUnitPrice(order.prodNick),
        route: fflOption,
        delivFee,
        ItemNote,
      }))

  }

  function getStandingOrder () {
    return !STD ? undefined
      : STD.filter(item => item.isStand === true)
  }

  function getHoldingOrder () {
    return !STD ? undefined
      : STD.filter(item => item.isStand === false)
  }

  return {
    location,
    locations: LOC,
    products: PRD,
    customizedProducts: useMemo(getCustomizedProducts, [PRD, OVR]),
    fulfillmentOptions: useMemo(getFulfillmentOptions, [isPickupLocation, defaultFulfillmentOption, RTE, ZRT, location]),
    FAVR,
    cartOrder: useMemo(getCartOrder, [ORD, STD, OVR, PRD, autoFulfillmentOption, delivDate, dayOfWeek])
  }

}
