import useSWR from "swr"
import gqlFetcher from "../_fetchers.js"
import { defaultSwrOptions } from "../_constants.js"
import { getLocation } from "../../graphqlCustom/queries/_getQueries.js"
import { ListDataCache, useListData } from "../_listData.js"
import { DBLocation } from "../types.d.js"

/**
 * @typedef {  "Type" |
 * "locNick" |
 * "locName" |
 * "zoneNick" |
 * "addr1" |
 * "addr2" |
 * "city" |
 * "zip" |
 * "email" |
 * "orderCnfEmail" |
 * "phone" |
 * "firstName" |
 * "lastName" |
 * "toBePrinted" |
 * "toBeEmailed" |
 * "printDuplicate" |
 * "terms" |
 * "invoicing" |
 * "latestFirstDeliv" |
 * "latestFinalDeliv" |
 * "dfFulfill" |
 * "webpageURL" |
 * "picURL" |
 * "gMap" |
 * "specialInstructions" |
 * "delivOrder" |
 * "qbID" |
 * "currentBalance" |
 * "isActive" |
 * "ttl" |
 * "createdAt" |
 * "updatedAt" |
 * "locationCreditAppId"
 * } DBLocationAttribute
 */

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @param {DBLocationAttribute[]} [input.projection]
 * @returns {ListDataCache<DBLocation>}
 */
const useLocations = ({ shouldFetch, projection }) => 
  useListData({ tableName: "Location", shouldFetch, projection })


/**
 * @param {Object} input
 * @param {string|undefined} input.locNick ID value for the desired location.
 * @param {boolean} input.shouldFetch Fetches data only when true.
 * @returns {{ data:(DBLocation | undefined) }}
 */
const useLocation = ({ locNick, shouldFetch }) => {
  const { data } = useSWR(
    (!!locNick && shouldFetch) ? [getLocation, { locNick: locNick }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  /** @returns {DBLocation | undefined} */ // JSDOC type-jank to get the return type to show DBLocation instead of 'any'
  const getData = (data) => data?.data?.getLocation
  const location = getData(data)

  return { data: location }
}

export {
  useLocation,
  useLocations,
}