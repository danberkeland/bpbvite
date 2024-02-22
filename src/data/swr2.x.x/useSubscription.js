// import useSWRSubscription from "swr/subscription"
// import * as subscriptions from "./gqlQueries/subscriptions"
// import { API } from "aws-amplify"
// import { maxBy, sortBy } from "lodash"
// import { useCartOrderData } from "../orderData"
// import { useListData } from "../_listData"
// import { useMemo } from "react"
// import { DateTime } from "luxon"

// /**
//  * @param {string} queryName - Name of one of the queries exported from ./gqlQueries/subscriptions.js
//  * @param {*} variables - For amplify's API.graphql. Can set subscription filters
//  */
// const useGenericSubscription = (queryName, variables) => useSWRSubscription(
//   [subscriptions[queryName], variables], 
//   ([query, variables], { next }) => {
  
//     const sub = API.graphql({ query, variables })
//       .subscribe({ 
//         next: ({ provider, value }) => 
//           next(
//             null, 
//             prev => {
//               console.log({ provider, value })
//               return (prev || []).concat(value.data[queryName])
//             }
//           ),
//         error: (err) => 
//           next(console.warn(err), null),
//       })
  
//     return () => sub.unsubscribe()
//   }
// )

// const useGenericSubscription_v2 = (queryName, variables) => {

//   const subFn = ([query, variables], { next }) => {
//     const sub = API.graphql({ query, variables }).subscribe({ 
//       next: ({ provider, value }) => next(null, prev => {
//             console.log({ provider, value })
//             return (prev || []).concat(value.data[queryName])
//           }
//         ),
//       error: (err) => next( console.warn(err), null ),
//     })
  
//     return () => sub.unsubscribe()
//   }

//   return useSWRSubscription([subscriptions[queryName], variables], subFn)

// }



// // Capure a 'stream' of table mutations. We add a label describing the
// // mutation type: C, U, D => create, update, delete. We defensively sort
// // by updatedOn -- one would assume subscriptions are published in the order 
// // that database actions happen, but async can be weird.
// export const useOrderSubscription = ({
//   variables={},
// }={}) => {
  
//   const { data:createData, error:createError } = useGenericSubscription('onCreateOrder', variables)
//   const { data:updateData, error:updateError } = useGenericSubscription('onUpdateOrder', variables)

//   // In practice, cart order records are only deleted through ttl
//   // const { data:deleteData, error:deleteError } = useGenericSubscription('onDeleteOrder', variables)

//   const streamData = sortBy(
//     (createData || []).map(item => ({ ...item, _action: 'C' }))
//       .concat((updateData || []).map(item => ({ ...item, _action: 'U'}))),
//     'updatedOn',
//   )

//   return ({ 
//     data: streamData, 
//     error: (createError || []).concat(updateError || [])
//   })
// }



// // Start by fetching cache data
// export const useLiveCartOrderDataByLocByDelivDate = ({ 
//   shouldFetch, 
//   locNick, 
//   delivDate 
// }) => {

//   const { data:orderCache, ...otherReturns } = useListData({ 
//     tableName:"Order", 
//     customQuery:"orderByLocByDelivDate", 
//     shouldFetch: shouldFetch,
//     variables: {
//       limit: 5000,
//       locNick: locNick,
//       delivDate: delivDate,
//     }
//   })

//   const variables = locNick 
//     ? { filter: { locNick: { eq: locNick } } }
//     : {}
//   const { data:orderStream } = useOrderSubscription({ variables })
  
//   const composeLiveData = () => {
//     if (!orderCache || !orderStream) return undefined

//     const cacheTimestamp = maxBy(orderCache, 'updatedOn').updatedOn
//     let _cache = orderCache 
//       ? Object.fromEntries(orderCache.map(item => [item.id, item]))
//       : {}

//     let _stream = sortBy(
//       (orderStream || []),
//       'updatedOn'
//     ).filter(item => item.updatedOn > cacheTimestamp )
    
//     console.log(cacheTimestamp)
//     console.log('orderStream', orderStream)
//     console.log('_stream', _stream)

//     for (let subItem of _stream) {
//       if (subItem['_action'] !== 'D') _cache[subItem.id] = subItem
//       else delete _cache[subItem.id]
//     }

//     return _cache

//   }


//   return {
//     data: useMemo(composeLiveData, [orderCache, orderStream]),
//   }

// }

