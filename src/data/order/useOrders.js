import { useMemo } from "react"
import { useListData } from "../_listData.js"

import { compareBy, groupByArray } from "../../utils/collectionFns.js"

/**
 * Cleans incoming data by separating out any "duplicate" records. Strategy to
 * pick the correct one is to pick the one with the most recent update timestamp.
 * @param {Object} input
 * @param {boolean} input.shouldFetch
 * @param {'orderByDelivDate'|'orderByLocByDelivDate'} [input.customQuery]
 * @param {Object} [input.variables]
 */
const useOrdersGeneric = ({ shouldFetch, customQuery, variables }) => {

  const { data:cacheData , ...otherCacheItems } = useListData({ 
    tableName: "Order", 
    shouldFetch,
    customQuery,
    variables,
  })

  //console.log("CACHE DATA", cacheData)

  const calculateValue = () => {
    if (!cacheData) return { data: undefined, dupes: undefined }

    /** @type {import('../types.d.js').DBOrder[]} */ 
    const orders = cacheData

    const groupList = groupByArray(orders, 
      I => `${I.isWhole}#${I.delivDate}#${I.locNick}#${I.prodNick}`
    )
    const sortedGroupList = groupList.map(grp => 
      grp.sort(compareBy(item => item.updatedOn, "desc"))
    )
    const returnData = sortedGroupList.map(grp => grp[0])
    const dupes = sortedGroupList.flatMap(grp => grp.slice(1))

    if (dupes.length) {
      console.warn("warning: duplicate orders found", dupes)
    }
    return { data: returnData, dupes }

  }

  return { 
    ...useMemo(calculateValue, [cacheData]),
    otherCacheItems 
  }

}

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 */
const useOrders = ({ shouldFetch }) => useOrdersGeneric({ shouldFetch })

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch
 * @param {string} input.locNick
 */
const useOrdersByLocNick = ({ shouldFetch, locNick }) =>
  useOrdersGeneric({ 
    shouldFetch: shouldFetch && !!locNick, 
    customQuery: "orderByLocByDelivDate", 
    variables: {
      locNick,
      limit: 5000
    }, 
  })

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch
 * @param {string} input.locNick
 * @param {string} input.delivDate
 */
const useOrdersByLocNickByDelivDate = ({ shouldFetch, locNick, delivDate }) =>
  useOrdersGeneric({ 
    shouldFetch: shouldFetch && !!locNick && !!delivDate, 
    customQuery: "orderByLocByDelivDate", 
    variables: {
      locNick,
      delivDate: { eq: delivDate },
      limit: 5000
    }, 
  })

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch
 * @param {string} input.delivDate
 */
const useOrdersByDelivDate = ({ shouldFetch, delivDate }) =>
  useOrdersGeneric({ 
    shouldFetch: shouldFetch && !!delivDate, 
    customQuery: "orderByDelivDate", 
    variables: {
      delivDate,
      limit: 5000
    }, 
  })



export { 
  useOrders,
  useOrdersByLocNick,
  useOrdersByDelivDate,
  useOrdersByLocNickByDelivDate,
}