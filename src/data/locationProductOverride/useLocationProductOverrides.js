import { useListData } from "../_listData"
import { DBLocationProductOverride } from "../types.d.js"

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 */
const useLocationProductOverrides = ({ shouldFetch }) => {
  const { data, ...otherCacheItems} = 
    useListData({ tableName: "LocationProductOverride", shouldFetch })

  /**@type {DBLocationProductOverride[] | undefined} */
  const overrides = data

  return { data: overrides, ...otherCacheItems}

}


/**
 * @param {Object} input
 * @param {string} input.locNick
 * @param {boolean} input.shouldFetch 
 */
const useLocationProductOverridesByLocNick = ({ locNick, shouldFetch }) => {
  const { data, ...otherCacheItems} = 
    useListData({ 
      tableName: "LocationProductOverride", 
      customQuery: "locationProductOverridesByLocNick",
      variables: { locNick, limit: 5000 },
      shouldFetch 
    })

  //Might want to Dedupe this one!
  /**@type {DBLocationProductOverride[] | undefined} */
  const overrides = data

  return { data: overrides, ...otherCacheItems}

}

export {
  useLocationProductOverrides,
  useLocationProductOverridesByLocNick,
}