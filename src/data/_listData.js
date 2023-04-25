// Attempting to reduce boilerplate.
//
// We use a lot of list-type hooks. Lately I'm of the opinion that
// fetching full lists (ie with all non-joined attributes) is the
// best approach for most situations. Scanning tables has the same
// DDB/AppSync cost whether or not we return all attributes or project
// to just a few, so unless we specifically *need* to restrict content
// from users or we only need a small fraction of items in a large 
// table (like a location's subset of orders), a full table scan will
// will work best.
//
// Basic fetching is a repeatable pattern that can be factored out.
// Custom hooks that transform/memoize imported data in any way can
// be built on top of these 'primitive' hooks.

import useSWR from 'swr'
import gqlFetcher from './_fetchers'
import { defaultSwrOptions, LIMIT, LIST_TABLES, TABLE_PKS } from './_constants'
import * as listQueries from '../customGraphQL/queries/_listQueries'
import * as mutations from '../customGraphQL/mutations'
import getNestedObject from '../functions/getNestedObject'

/**
 * Custom mutate functions require shouldFetch: true in order to read/update local data.
 * @param {Object} input
 * @param {typeof LIST_TABLES[number]} input.tableName
 * @param {boolean} input.shouldFetch External control for when data should be fetched
 * @param {Object} input.variables - Part of SWR cache key; changing this changes the cache.
 *  @param {number} input.variables.limit - Integer; default 5000. 
 * @returns {}
 */
export const useListData = ({ 
  tableName, 
  shouldFetch = false, 
  variables = { limit: LIMIT }, 
  swrOptions = defaultSwrOptions 
}) => {

  if (!LIST_TABLES.includes(tableName)) {
    console.error(`tableName '${tableName}' not supported. Try one of the following instead:`, JSON.stringify(LIST_TABLES))
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

  const createItem = (input) => submitMutation({ input, mutationType: "create", tableName, pkAtt })
  const updateItem = (input) => submitMutation({ input, mutationType: "update", tableName, pkAtt })
  const deleteItem = (input) => submitMutation({ input, mutationType: "delete", tableName, pkAtt })
  
  const mutateLocal = ({ createdItems=[], updatedItems=[], deletedItems=[] }) => {
    if (!_data) {
      console.error("ERROR: cache data not found. Refresh page before trying again")
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
    createItem,
    updateItem,
    deleteItem,
    mutateLocal
  })
}

// List Mutations
// 
// A common use case is to fetch a detailed list, then mutate one item at a time
// revalidate involves calling a simple mutate() which invalidates the cache
// and refetches the entire list.  While relatively inefficient, it is simple
// and, most importantly, guarantees that the rendered information reflects
// the current state of the database (ie the mutation was successful).
//
// An alternate strategy would be to sidestep revalidation on the entire list.
// We can confirm the database is updated by looking at the response data from
// our mutation. We can use that object to update just the single item in the 
// list cache. For create, we simply push/concatenate the item. For update, we
// find/replace. For delete, we remove the item.
//
// these generic hooks & mutations will retrieve the full set of non-joined 
// attributes, so they will always match up exactly -- no surgery within an item
// will be necessary. Since the local cache mutation will be a relatively cheap,
// synchronous action, batch mutations will not need to be handled specially.

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

const submitMutation = async ({ input, mutationType, tableName, pkAtt }) => {
  const mutationName = `${mutationType}${tableName}`
  const mutation = mutations[mutationName]
  //console.log(input, pkAtt, mutationType, tableName, listData)

  if (mutationType !== 'create' && pkAtt !== 'id' &&!input[pkAtt]) {
    console.warn(`Primary Key '${pkAtt}' not found. Mutation request may fail.`)
  }

  try {
    const response = await gqlFetcher(mutation, { input })
    if (response.data ) return ({ data: response.data[mutationName], errors: null })
    else return ({ data: null, errors: response.errors }) // probably a malformed query

  } catch (error) {
    return ({ data: null, errors: error }) // probably a network error
  }

}

const coerceInput = (input) => input.constructor === Array ? input
: input.constructor === Object ? [input] // coerce to array of objects
: null // signals an error

// const submitMutations = async ({ createInputs=[], updateInputs=[], deleteInputs=[], createItem, updateItem, deleteItem }) => {
//   const _create = coerceInput(createInputs)
//   const _update = coerceInput(updateInputs)
//   const _delete = coerceInput(deleteInputs)

//   const cResps = await Promise.all(
//     _create.map(C => createItem(C))
//   )

//   const uResps = await Promise.all(
//     _update.map(U => updateItem(U))
//   )

//   const dResps = await Promise.all(
//     _delete.map(D => updateItem(D))
//   )

// }