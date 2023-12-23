// Route Assignment is powered by table data that is slightly customized on the
// front end. typedefs here describe the specification for this context.
//
// Types that aren't 100% the same as fetched from the DB are prefixed with
// 'Routing' to signify a special usage for this context

import { API } from "aws-amplify"
import { useListData } from "../_listData"
import { locationAttributes } from "../../customGraphQL/standardAttributes"
import { groupBy, mapValues } from "lodash/fp"

import { RoutingLocation, _RoutingLocation, RoutingProduct, _RoutingProduct, RoutingRoute, _RoutingRoute, ZoneRoute } from "./types.d.js"
import useSWR from "swr"
import gqlFetcher from "../_fetchers.js"
import { defaultSwrOptions } from "../_constants.js"

/** @typedef {boolean[]} WeekdayFlags */

/**
 * @param {RoutingLocation} location 
 * @returns {_RoutingLocation}
 */
const to_Location = location => ({
  locNick: location.locNick,
  zoneNick: location.zoneNick,
  delivTimeStart: location.latestFirstDeliv,
  delivTimeFinis: location.latestFinalDeliv
})

/**
 * @param {RoutingProduct} product 
 * @returns {_RoutingProduct}
 */
const to_Product = product => ({
  prodNick: product.prodNick,
  bakedWhere: product.bakedWhere,
  readyTime: product.readyTime,
  // @ts-ignore
  validDays: product.daysAvailable?.map(dValue => !!dValue) 
    || [true,true,true,true,true,true,true]
})

const legacyWeekdays = ['1','2','3','4','5','6','7']

/** 
 * @param {RoutingRoute[]} routes
 * @param {ZoneRoute[]} zoneRoutes 
 * @returns {_RoutingRoute[]}
 */
const to_Routes = (routes, zoneRoutes) => {
  const zrByRouteNick = groupBy('routeNick')(zoneRoutes)

  return routes.map(route => ({
    routeNick: route.routeNick,
    timeStart: route.routeStart,
    timeFinis: route.routeStart + route.routeTime,
    validDays: legacyWeekdays.map(wd => route.RouteSched.includes(wd)),
    hubStart: route.RouteDepart,
    hubFinis: route.RouteArrive,
    zonesServed: zrByRouteNick[route.routeNick]?.map(zr => zr.zoneNick) ?? []
  }))

}

/** 
 * @typedef {Object} ZoneRoute
 * @property {string} id
 * @property {string} zoneNick
 * @property {string} routeNick
 */


/** @returns {_RoutingRoute[]} */
const useRoutes = () => {
  const { data:RTE=[] } = useListData({ tableName: "Route", shouldFetch: true })
  const { data:ZRT=[] } = useListData({ tableName: "ZoneRoute", shouldFetch: true })

  return to_Routes(RTE, ZRT)
}

const useLocation = ({ locNick }) => {
  const query = /* GraphQL */ `
    query GetLocation($locNick: String!) {
      getLocation(locNick: $locNick) {
        ${locationAttributes}
      }
    }
  `
  const variables = { locNick }
  const key = [query, variables]

  const { data } = useSWR(key, gqlFetcher, defaultSwrOptions)

  return data ? to_Location(data.data.getLocation) : undefined
  
}

/** @returns {_RoutingLocation[]} */
const useLocations = () => {
  const { data:LOC=[] } = useListData({ tableName: "Location", shouldFetch: true })

  return LOC.map(to_Location)
}

/** @returns {_RoutingProduct[]} */
const useProducts = () => {
  const { data:PRD=[] } = useListData({ tableName: "Product", shouldFetch: true})

  return PRD.map(to_Product)
}

/** Data fetchers that prep raw DB data for use with routing logic */
export const useRoutingData = {
  routes: useRoutes,
  location: useLocation,
  locations: useLocations,
  products: useProducts,
}

