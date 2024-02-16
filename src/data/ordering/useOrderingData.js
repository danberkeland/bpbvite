// import { useMemo } from "react"
// import { useLocation } from "../location/useLocations.ts"
// import { useLocationProductOverridesByLocNick } from "../locationProductOverride/useLocationProductOverrides"
// import { useOrdersByLocNick } from "../order/useOrders"
// import { useProducts } from "../product/useProducts"
// import { useStandingsByLocNick } from "../standing/useStandings"
// import { useTemplateProdsByLocNick } from "../templateProd/useTemplateProd"
// import { overrideProduct } from "../locationProductOverride/overrideProduct.js"
// import { useLoadedGetRouteOptions } from "../routing/useRouting.js"



// const useOrderingDataByLocNick = ({ locNick }) => {

//   const shouldFetch = !!locNick
//   const { data:loc } = useLocation({ shouldFetch, locNick })
//   const { data:PRD } = useProducts({ shouldFetch: true })
//   const { data:OVR } = useLocationProductOverridesByLocNick({ shouldFetch, locNick })

//   const { data:ORD } = useOrdersByLocNick({ shouldFetch, locNick })
//   const { data:STD } = useStandingsByLocNick({ shouldFetch, locNick })
//   const { data:TMP } = useTemplateProdsByLocNick({ shouldFetch, locNick })

//   const getOptions = useLoadedGetRouteOptions({ shouldFetch })




  

// }