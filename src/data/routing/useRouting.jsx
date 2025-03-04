import { useMemo } from "react";
import { useRoutes } from "../route/useRoutes";
import { DBLocation, DBProduct } from "../types.d";
import { useZoneRoutes } from "../zoneRoute/useZoneRoutes";
import { Routing } from "../../core/logistics/routingFns";
// import { IsoDate } from "../../utils/dateTimeFns";


// /**
//  * 
//  * @param {DBRoute[] | undefined} routes 
//  * @param {DBZoneRoute[] | undefined} zoneRoutes 
//  */
// const buildGetRouteOptions = (routes, zoneRoutes) => {
//   /**
//    * @param {DBLocation} location 
//    * @param {DBProduct} product 
//    * @param {import("../../core/logistics/routingFns").WeekdayEEE} dayOfWeek 
//    */
//   const _getOptions = !!routes && !!zoneRoutes 
//     ? (location, product, dayOfWeek) => Routing.getOptions(
//         Routing.cast.fromDBLocation(location),
//         Routing.cast.fromDBProduct(product),
//         dayOfWeek,
//         routes.map(route => Routing.cast.fromDBRoute(route, zoneRoutes))
//       )
//     : undefined

//   return _getOptions

// }

/**
 * Generates function pre-loaded with fetched route/zoneRoute data.
 * Can generate options for a given location, product, and dayOfWeek
 */
const useLoadedGetRouteOptions = ({ shouldFetch }) => {
  const { data:dbRoutes } = useRoutes({ shouldFetch })
  const { data:dbZoneRoutes } = useZoneRoutes({ shouldFetch })

  // return useMemo(
  //   () => buildGetRouteOptions(dbRoutes, dbZoneRoutes), 
  //   [dbRoutes, dbZoneRoutes]
  // )

  return useMemo(() => {
    if (!dbRoutes || !dbZoneRoutes) return undefined

    /**
     * @param {DBLocation} location 
     * @param {DBProduct} product 
     * @param {import("../../core/logistics/routingFns").WeekdayEEE} dayOfWeek 
     */
    const _getOptions = (location, product, dayOfWeek) => Routing.getOptions(
      Routing.cast.fromDBLocation(location),
      Routing.cast.fromDBProduct(product),
      dayOfWeek,
      dbRoutes.map(route => Routing.cast.fromDBRoute(route, dbZoneRoutes))
    )

    return _getOptions

  }, [dbRoutes, dbZoneRoutes])

}



// TODO: 
// Make a "Routing.getOptionsByDate" function that looks for & deals with
// holidays/closures. Need to think about how to implement...

// /**
//  * @param {DBRoute[]} routes 
//  * @param {DBZoneRoute[]} zoneRoutes 
//  */
// const buildGetRouteOptionsByDate = (routes, zoneRoutes) => {
//   if (!routes || !zoneRoutes) return undefined
  
//   /**
//    * @param {DBLocation} location 
//    * @param {DBProduct} product 
//    * @param {import("./routingFns").WeekdayEEE} dayOfWeek 
//    */
//   const getOptions = 
//     (location, product, isoDate) => 
//       Routing.getOptions(
//         Routing.cast.fromDBLocation(location),
//         Routing.cast.fromDBProduct(product),
//         IsoDate.toWeekdayEEE(isoDate),
//         routes.map(route => Routing.cast.fromDBRoute(route, zoneRoutes))
//       )

//   return getOptions

// }

// const useGetRouteOptionsByDate = ({ shouldFetch }) => {
//   const { data:dbRoutes } = useRoutes({ shouldFetch })
//   const { data:dbZoneRoutes } = useZoneRoutes({ shouldFetch })

//   return useMemo(
//     () => buildGetRouteOptionsByDate(dbRoutes, dbZoneRoutes), 
//     [dbRoutes, dbZoneRoutes]
//   )
// }

const useLoadedGetServingRoutes = ({ shouldFetch }) => {
  const { data:dbRoutes } = useRoutes({ shouldFetch })
  const { data:dbZoneRoutes } = useZoneRoutes({ shouldFetch })

  const getServingRoutes = useMemo(() => 
    !!dbRoutes && !!dbZoneRoutes
      ? location => Routing.getServingRoutes(
          Routing.cast.fromDBLocation(location), 
          dbRoutes.map(R => Routing.cast.fromDBRoute(R, dbZoneRoutes)), 
        )
      : undefined
  , [dbRoutes, dbZoneRoutes])

  return getServingRoutes

}


export {
  useLoadedGetRouteOptions,
  useLoadedGetServingRoutes,
}