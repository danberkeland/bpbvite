// Attempting to reduce boilerplate.
//
// We use a lot of list-type hooks. Lately I'm of the opinion that fetching 
// full lists (ie with all non-joined attributes) is the best approach for 
// most situations. Scanning tables has the same DDB/AppSync cost whether or 
// not we return all attributes or project to just a few, so unless we 
// specifically *need* to restrict content from users or we only need a small 
// fraction of items in a large table (like a location's subset of orders), a
// full table scan will will work best.
//
// Basic fetching is a repeatable pattern that can be factored out. Custom 
// hooks that transform/memoize imported data in any way can be built on top
// of these 'primitive' hooks.

import useSWR from 'swr'
import gqlFetcher from './_fetchers'
import { defaultSwrOptions, LIMIT, LIST_TABLES, TABLE_PKS } from './_constants'
import * as listQueries from '../customGraphQL/queries/_listQueries'
import * as mutations from '../customGraphQL/mutations'
import getNestedObject from '../functions/getNestedObject'



const coerceInput = (input) => input.constructor === Array ? input
  : input.constructor === Object ? [input] // coerce to array of objects
  : null // signals an error



// GraphQL queries/mutations are named nicely enough that they can be inferred
// from the table name, allowing us to make a generic mutator for the given
// table.
const submitMutation = async ({ input, mutationType, tableName, pkAtt }) => {
  const mutationName = `${mutationType}${tableName}`
  const mutation = mutations[mutationName]

  if (mutationType !== 'create' && pkAtt !== 'id' &&!input[pkAtt]) {
    console.warn(`Primary Key '${pkAtt}' not found. Mutation may fail.`)
  }

  try {
    const { data, errors } = await gqlFetcher(mutation, { input })
    if (data ) return ({ data: data[mutationName], errors: null })
    else return ({ data: null, errors: errors }) // probably a malformed query

  } catch (error) {
    return ({ data: null, errors: error }) // probably a network error
  }

}



const batchMutate = async ({ 
  createInputs=[], updateInputs=[], deleteInputs=[], 
  createItem, updateItem, deleteItem 
}) => {
  const _create = coerceInput(createInputs)
  const _update = coerceInput(updateInputs)
  const _delete = coerceInput(deleteInputs)
  if (!_create || !_update || !_delete) {
    console.error(
      "ERROR: Invalid input: " 
      + "expecting an object item or array of object items."
    )
    return
  }

  try {
    const cResps = await Promise.all(
      _create.map(C => createItem(C))
    )

    const uResps = await Promise.all(
      _update.map(U => updateItem(U))
    )

    const dResps = await Promise.all(
      _delete.map(D => deleteItem(D))
    )

    return ({
      createdItems: cResps.map(r => r.data),
      updatedItems: uResps.map(r => r.data),
      deletedItems: dResps.map(r => r.data)
    })

  } catch (err) {
    console.err("async mutation failed; should use async revalidation")
    console.error(err)
    return undefined

  }

}



/**
 * Custom mutate functions require shouldFetch: true in order to read/update 
 * local data.
 * @function
 * @param {Object} input
 * @param {typeof LIST_TABLES[number]} input.tableName
 * @param {boolean} input.shouldFetch External control for when data should be fetched
 * @param {Object} input.variables Part of SWR cache key; changing this changes the cache.
 *  @param {number} input.variables.limit Integer; default 5000. 
 * @returns {}
 */
export const useListData = ({ 
  tableName, 
  shouldFetch = false, 
  variables = { limit: LIMIT }, 
  swrOptions = defaultSwrOptions 
}) => {

  if (!LIST_TABLES.includes(tableName)) {
    console.error(
      `tableName '${tableName}' not supported. Valid names:`,
      JSON.stringify(LIST_TABLES)
    )
  }

  const queryName = `list${tableName}s`
  const query = listQueries[queryName]
  const pkAtt = TABLE_PKS[tableName]
  
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    shouldFetch ? [query, variables] : null,
    gqlFetcher,
    swrOptions
  )

  // const _data = data?.data[queryName].items ?? undefined
  const _data = getNestedObject(data, ['data', queryName, 'items'])

  if (_data && _data.length === LIMIT) {
    console.warn("WARNING: item limit reached")
  }

  const createItem = (input) => submitMutation({ 
    input, 
    mutationType: "create", 
    tableName, 
    pkAtt 
  })
  const updateItem = (input) => submitMutation({ 
    input, 
    mutationType: "update", 
    tableName, 
    pkAtt 
  })
  const deleteItem = (input) => submitMutation({ 
    input, 
    mutationType: "delete",
    tableName, 
    pkAtt 
  })

  /**
   * On success, returns an object of created/updated/deleted items that can be
   * used directly to update the cache locally with 'updateLocalData'.
   * @function
   * @param {Object} input
   * @param {Object | Object[]} input.createInputs items to submit to GQL 
   * create mutation.
   * @param {Object | Object[]} input.updateInputs items to submit to GQL 
   * update mutation.
   * @param {Object | Object[]} input.deleteInputs items to submit to GQL 
   * delete mutation.
   */
  const submitMutations = ({ 
    createInputs=[], updateInputs=[], deleteInputs=[] 
  }) => batchMutate({ 
    createInputs, updateInputs, deleteInputs, 
    createItem, updateItem, deleteItem 
  })
  
  /**
   * Use data returned from GraphQL mutations to update the cache locally 
   * without async revalidation.
   * @function
   * @param {Object} input
   * @param {Object | Object[]} input.createdItems items returned from GQL
   * create mutation.
   * @param {Object | Object[]} input.updatedItems items returned from GQL
   * update mutation.
   * @param {Object | Object[]} input.deletedItems items returned from GQL
   * delete mutation. 
   */
  const updateLocalData = ({ 
    createdItems=[], 
    updatedItems=[], 
    deletedItems=[] 
  }) => {
    if (!_data) {
      console.error(
        "ERROR: cache data not found. Refresh page before trying again"
      )
      return
    }

    const _create = coerceInput(createdItems)
    const _update = coerceInput(updatedItems)
    const _delete = coerceInput(deletedItems)

    const newData = _data
      .concat(_create)
      .filter(item => {
        const matchIdx = _delete.findIndex(_d => _d[pkAtt] === item[pkAtt])
        return matchIdx === -1
      })
      .map(item => {
        const matchUpdateItem = _update.find(_u => _u[pkAtt] === item[pkAtt])
        return matchUpdateItem ? matchUpdateItem : item
      })

    mutate({ data: {[`list${tableName}s`]: { items: newData } } }, false)
  }
  
  return ({
    data: _data,
    error,
    isLoading,
    isValidating,
    mutate,
    // createItem,
    // updateItem,
    // deleteItem,
    submitMutations,
    updateLocalData: updateLocalData
  })
}







// ***OBSOLETE***

// const mutateItem = async ({ input, pkAttName, mutationType, tableName, mutate, listData, shouldMutateLocal }) => {
//   const mutationName = `${mutationType}${tableName}`
//   const mutation = mutations[mutationName]

//   console.log(input, pkAttName, mutationType, tableName, listData)

//   if (!listData) {
//     console.log("list data not found: try setting shouldFetch: true?")
//     return
//   }
//   if (mutationType !== 'create' && pkAttName !== 'id' &&!input[pkAttName]) console.error("ERROR: primary Key is required.")

//   try {
//     const response = await gqlFetcher(mutation, { input })
//     // console.log("listData", listData)
//     // console.log("MUATION RESP:", response.data[mutationName])
//     if (!!response.data) {
//       const newItem = response.data[mutationName]

//       let newData
//       switch (mutationType) {
//         case 'create':
//           newData = listData.concat([newItem])
//           console.log("newData", newData)
//           break
          
//         case 'update':
//           newData = listData.map(item => 
//             item[pkAttName] === newItem[pkAttName] 
//               ? newItem 
//               : item
//           )
//           break

//         case 'delete':
//           newData = listData.filter(item => 
//             item[pkAttName] !== newItem[pkAttName]
//           )
//           break

//         default:
//           console.log(`mutation type '${mutationType}' not recognized.`);
//       }

//       if (shouldMutateLocal) {
//         mutate({ data: {[`list${tableName}s`]: { items: newData } } }, false)
//       }

//       return ({ 
//         data: newItem,
//         errors: null
//       })

//     } else {
//       console.error(response.errors) // malformed query
//       return ({
//         data: null,
//         errors: response.errors
//       })

//     }

//   } catch (err) {
//     console.error(err) // probably a network error
//     return ({
//       data: null,
//       errors: err
//     })

//   }

// }