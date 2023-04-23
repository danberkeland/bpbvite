// Attempting to reduce boilerplate.
//
// We use a lot of list-type hooks. Lately I'm of the opinion that
// fetching full lists (including all non-joined attributes) is the
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
import * as mutations from '../graphql/mutations'
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
    console.error("tableName not supported. Try one of the following instead:", JSON.stringify(LIST_TABLES))
  }

  const queryName = `list${tableName}s`
  const query = listQueries[queryName]
  
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

  const createItem = (input) => mutateItem({ input, pkAttName: TABLE_PKS[tableName], mutationType: "create", tableName, mutate: mutate, listData: _data })
  const updateItem = (input) => mutateItem({ input, pkAttName: TABLE_PKS[tableName], mutationType: "update", tableName, mutate: mutate, listData: _data })
  const deleteItem = (input) => mutateItem({ input, pkAttName: TABLE_PKS[tableName], mutationType: "delete", tableName, mutate: mutate, listData: _data })

  return ({
    data: _data,
    error,
    isLoading,
    isValidating,
    mutate,
    createItem,
    updateItem,
    deleteItem
  })
}

// const foo = useListData({ tableName: })

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

const mutateItem = async ({ input, pkAttName, mutationType, tableName, mutate, listData }) => {
  const mutationName = `${mutationType}${tableName}`
  const mutation = mutations[mutationName]

  console.log(input, pkAttName, mutationType, tableName, listData)

  if (!listData) {
    console.log("list data not found")
    return
  }
  if (!input[pkAttName]) console.error("ERROR: primary Key is required.")

  try {
    const response = await gqlFetcher(mutation, { input })
    console.log("listData", listData)
    console.log("MUATION RESP:", response.data[mutationName])
    if (!!response.data) {
      const newItem = response.data[mutationName]

      let newData
      switch (mutationType) {
        case 'create':
          newData = listData.concat([newItem])
          console.log("newData", newData)
          break
          
        case 'update':
          newData = listData.map(item => 
            item[pkAttName] === newItem[pkAttName] 
              ? newItem 
              : item
          )
          break

        case 'delete':
          newData = listData.filter(item => 
            item[pkAttName] !== newItem[pkAttName]
          )
          break

        default:
          console.log(`mutation type '${mutationType}' not recognized.`);
      }
      mutate({ data: {[`list${tableName}s`]: { items: newData } } }, false)

      return newItem

    } else {
      console.error(response.errors) // malformed query
    }

  } catch (err) {
    console.error(err) // probably a network error
  }

}