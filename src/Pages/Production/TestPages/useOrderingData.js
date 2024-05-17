import { useLocation, useLocations } from "../../../data/location/useLocations"
import { useLocationProductOverridesByLocNick } from "../../../data/locationProductOverride/useLocationProductOverrides"
import { useOverrideProduct } from "../../../data/locationProductOverride/useOverrideProduct"
import { useProducts } from "../../../data/product/useProducts"
import { useTemplateProdsByLocNick } from "../../../data/templateProd/useTemplateProd"
import { compareBy } from "../../../utils/collectionFns"

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
  locNick,
  delivDate,
  shouldFetch,
  user,
}) => {
  const isAdmin = user.authClass === 'bpbfull'
  const isCustomer = user.authClass === 'customer'
  const { data:loc } = useLocation({ locNick, shouldFetch: !!locNick && isCustomer })
  const { data:LOC } = useLocations({ projection: locationFields, shouldFetch: isAdmin })
  const { data:PRD } = useProducts({ projection: productFields, shouldFetch:true })
  const { data:FAV } = useTemplateProdsByLocNick({ locNick, shouldFetch: !!locNick })
  const { data:OVR } = useLocationProductOverridesByLocNick({ locNick, shouldFetch: !!locNick })
  
  const selectedLocation = isAdmin
    ? LOC?.find(L => L.locNick === locNick)
    : loc

  const customizedProducts = (!PRD || !OVR) 
    ? undefined
    : PRD.filter(P => 0 
        || isAdmin 
        || !!P.defaultInclude 
        || OVR.some(ovr => ovr.prodNick === P.prodNick && !!ovr.defaultInclude)
      ).sort(
        compareBy(P => P.prodName)
      )


}