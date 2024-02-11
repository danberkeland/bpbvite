import useSWR from "swr"
import gqlFetcher from "../_fetchers.js"
import { defaultSwrOptions } from "../_constants.js"
import { getLocation } from "../../customGraphQL/queries/_getQueries.js"
import { useListData } from "../_listData.js"
import { DBLocation } from "../types.d.js"
import { GraphQLResult } from '@aws-amplify/api-graphql'

type DBLocationAttribute = 
  "Type" |
  "locNick" |
  "locName" |
  "zoneNick" |
  "addr1" |
  "addr2" |
  "city" |
  "zip" |
  "email" |
  "orderCnfEmail" |
  "phone" |
  "firstName" |
  "lastName" |
  "toBePrinted" |
  "toBeEmailed" |
  "printDuplicate" |
  "terms" |
  "invoicing" |
  "latestFirstDeliv" |
  "latestFinalDeliv" |
  "dfFulfill" |
  "webpageURL" |
  "picURL" |
  "gMap" |
  "specialInstructions" |
  "delivOrder" |
  "qbID" |
  "currentBalance" |
  "isActive" |
  "ttl" |
  "createdAt" |
  "updatedAt" |
  "locationCreditAppId"

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @param {DBLocationAttribute[]} input.projection
 */
const useLocations = ({ shouldFetch, projection }: { shouldFetch:boolean, projection:DBLocationAttribute[] }) => {
    const { data, ...otherCacheItems} = 
      useListData({ 
        tableName: "Location", 
        shouldFetch,
        projection
      })

  /**@type {DBLocation[] | undefined} */
  const locations:DBLocation[]|undefined = data

  return { data: locations, ...otherCacheItems}
  
}


/**
 * @param {Object} input
 * @param {string} input.locNick ID value for the desired location.
 * @param {boolean} input.shouldFetch Fetches data only when true.
 * @returns {{ data:DBLocation }}
 */
const useLocation = ({ locNick, shouldFetch }) => {
  const { data } = useSWR<GraphQLResult<{ getLocation: DBLocation }>>(
    shouldFetch ? [getLocation, { locNick: locNick }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )
  const location = data ? data.data?.getLocation : undefined

  return { data: location }
}

export {
  useLocation,
  useLocations,
}