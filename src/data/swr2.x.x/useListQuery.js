// // General-purpose data hook for GraphQL list & query operations.
// // Intended as an upgrade for useListData
// //
// // We forego some expressiveness with our queries so that we can standardize
// // our approach to managing data from all tables. In particular, 
// //  * We avoid GQL queries that join data from multiple tables
// //  * We fetch with list and query by index operations.
// //      List operations can be programmatically baked into the hook, but
// //      custom queries by index may need to be handled specially
// //  * We return all non-joining attributes specified in the schema in all
// //      responses so that we can efficiently sync data to our local cache while 
// //      maintining maximum reusability of the cache.

// import gqlFetcher from "../_fetchers"
// import useSWR from "swr"

// import * as queries from "./gqlQueries/queries"
// import * as mutations from "./gqlQueries/mutations"
// import * as subscriptions from "./gqlQueries/subscriptions"

// import { defaultSwrOptions, LIMIT, LIST_TABLES, TABLE_PKS } from '../_constants'


// export const useListData = ({ 
//   table, 
//   customQuery = '',
//   shouldFetch = false, 
//   variables = { limit: LIMIT }, 
//   swrOptions = defaultSwrOptions,
// }) => {

//   if (!!shouldFetch && !LIST_TABLES.includes(tableName)) {
//     console.error(
//       `tableName '${tableName}' not supported. Valid names:`,
//       JSON.stringify(LIST_TABLES)
//     )
//   }

//   const queryName = customQuery || `list${table}s`
//   const query = listQueries[queryName]
//   if (shouldFetch && !query) console.error('query not found')

//   const pkAtt = TABLE_PKS[tableName]
  
//   const swrCache = useSWR(
//     shouldFetch ? [query, variables] : null,
//     gqlFetcher,
//     swrOptions
//   )

// }