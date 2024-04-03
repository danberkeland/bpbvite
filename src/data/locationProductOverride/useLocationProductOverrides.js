import { ListDataCache, useListData } from "../_listData"
import { DBLocationProductOverride } from "../types.d.js"

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @returns {ListDataCache<DBLocationProductOverride>}
 */
const useLocationProductOverrides = ({ shouldFetch }) => 
  useListData({ tableName: "LocationProductOverride", shouldFetch })


/**
 * @param {Object} input
 * @param {string} input.locNick
 * @param {boolean} input.shouldFetch 
 * @returns {ListDataCache<DBLocationProductOverride>}
 */
const useLocationProductOverridesByLocNick = ({ locNick, shouldFetch }) =>
  useListData({ 
    tableName: "LocationProductOverride", 
    customQuery: "locationProductOverridesByLocNick",
    variables: { locNick, limit: 5000 },
    shouldFetch 
  })


export {
  useLocationProductOverrides,
  useLocationProductOverridesByLocNick,
}