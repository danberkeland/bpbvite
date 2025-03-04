import { useMemo } from "react"
import { ListDataCache, useListData } from "../_listData.js"

import { compareBy, groupByArray } from "../../utils/collectionFns.js"
import { DBOrder } from "../types.d.jsx"
import { objPickByEntries } from "../../utils/objectFns.js"
import { orderValidation } from "./changesets.jsx"
import { CreateOrderInput, UpdateOrderInput, DeleteOrderInput } from "./changesets.jsx"

const stripUndefinedFields = (object) => objPickByEntries(object, (k,v) => v !== undefined)

/**
 * Cleans incoming data by separating out any "duplicate" records. Strategy to
 * pick the correct one is to pick the one with the most recent update timestamp.
 * @param {Object} input
 * @param {boolean} input.shouldFetch
 * @param {'orderByDelivDate'|'orderByLocByDelivDate'} [input.customQuery]
 * @param {Object} [input.variables]
 * @param {boolean} [input.useValidations]
 * @returns {ListDataCache<DBOrder> & { dupes: DBOrder[] | undefined }}
 */
const useOrdersGeneric = ({ shouldFetch, customQuery, variables, useValidations=false }) => {

  const { 
    data:cacheData, 
    error,
    isLoading,
    isValidating,
    mutate,
    submitMutations,
    updateLocalData
  } = useListData({ 
    tableName: "Order", 
    shouldFetch,
    customQuery,
    variables,
  })

  //console.log("CACHE DATA", cacheData)

  const calculateValue = () => {
    if (!cacheData || !submitMutations) {
      return { data: undefined, dupes: undefined, submitMutations: undefined }
    }

    /** @type {import('../types.d.jsx').DBOrder[]} */ 
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

    
    
    /**
     * Uses yup validations
     * strips fields with undefined values before submitting
     * @param {Object} args
     * @property {CreateOrderInput[]} args.createInputs 
     * @property {UpdateOrderInput[]} args.updateInputs 
     * @property {DeleteOrderInput[]} args.deleteInputs 
     */
    const _submitMutations = ({ createInputs, updateInputs, deleteInputs }) => {

      const errors = orderValidation.validateOrderInputs({ createInputs, updateInputs, deleteInputs })
      if (errors !== null) { 
        console.warn("validation failed:", errors)
        return
      }

      return submitMutations({
        createInputs: createInputs.map(stripUndefinedFields),
        updateInputs: updateInputs.map(stripUndefinedFields),
        deleteInputs: deleteInputs.map(stripUndefinedFields),
      })
    }

    return { 
      data: returnData, 
      dupes, 
      submitMutations: useValidations ? _submitMutations : submitMutations 
    }
  }

  return { 
    ...useMemo(calculateValue, [cacheData]),
    error,
    isLoading,
    isValidating,
    mutate,
    // submitMutations,
    updateLocalData,
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