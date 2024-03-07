// /**
//  * Variation of groupBy that buckets straight into nested arrays.
//  * 
//  * This is a type-safe equivalent to Object.values(groupBy(data, callback)),
//  * as Object.values is not type-safe!!! (kill me)
//  * 
//  * https://github.com/microsoft/TypeScript/issues/38520
//  * 
//  * @function
//  * @template T
//  * @param {T[]} data 
//  * @param {Function} callback 
//  * @returns {T[][]}
//  */
// const bucketBy = (data, callback) => {
//   let groupArray = []
//   let cbValues = []

//   for (let i = 0; i < data.length ; i++) {
//     const key = callback(data[i])
//     const idx = cbValues.indexOf(key)

//     if (idx > -1) {
//       groupArray[idx].push(data[i])
//     } else {
//       cbValues.push(key)
//       groupArray.push([data[i]])
//     }

//   }

//   return groupArray
// }



// /**
//  * @function
//  * @template T
//  * @param {T[]} data 
//  * @param {Function} callback 
//  * @returns {([string, T[]])[]}
//  */
// const bucketByEntries = (data, callback) => {
//   /**@type {([string, T[]])[]} */
//   let entryArray = []

//   for (let i = 0; i < data.length ; i++) {
//     const key = String(callback(data[i]))
//     const idx = entryArray.findIndex(item => item[0] === key)

//     if (idx > -1) {
//       (entryArray[idx][1]).push(data[i])
//     } else {
//       entryArray.push([key, [data[i]]])
//     }

//   }

//   return entryArray

// }

// /**
//  * @function
//  * @template T
//  * @param {string[]} keyArr 
//  * @param {[string, T[]]} kvItem
//  * @returns {[string[], T[]]} 
//  */
// const prependKeys = (keyArr, kvItem) => [[...keyArr, kvItem[0]], kvItem[1]]

// /**
//  * @function
//  * @template T
//  * @param {T[]} data 
//  * @param {Function[]} callbacks 
//  * @returns {([ string[], T[] ])[]}
//  */
// const nestedBucketByEntries = (data, callbacks) => {

//   /** @type {([string[], T[]])[]} */
//   let keyedData = [[[], data]]

//   for (let callback of callbacks) {

//     keyedData = keyedData.flatMap(kv => {
//       let [keyArr, kData] = kv

//       return bucketByEntries(kData, callback)
//         .map(kvItem => prependKeys(keyArr, kvItem))
      
//     })

//   }

//   return keyedData
// }

// // /**
// //  * @function
// //  * @template T
// //  * @param {T[]} data 
// //  * @param {Function} callback
// //  */
// // const groupBy = (data, callback) => {
// //   let groupedData = {}

// //   for (let i = 0; i < data.length ; i++) {

// //     const key = callback(data[i])
// //     if (groupedData.hasOwnProperty(key)) {
// //       groupedData[key].push(data[i])

// //     } else {
// //       groupedData[key] = [data[i]]
      
// //     }

// //   }
// //   return groupedData

// // }

// /**
//  * @function
//  * @template T
//  * @param {T[]} data 
//  * @param {Function} callback
//  */
// const groupBy = (data, callback) => Object.fromEntries(bucketByEntries(
//   data, callback
// ))

// /**
//  * In the event of multiple items with the same key, 
//  * implementation picks the last item for the returned object
//  * @function
//  * @template T
//  * @param {T[]} data 
//  * @param {Function} callback
//  * @returns {Object.<string, T>} 
//  */
// const keyBy = (data, callback) => 
//   Object.fromEntries(data.map(item => [callback(item), item]))



// /**
//  * Extends groupBy. Creates nested objects by successively 
//  * applying groupBy iteratees to object values.
//  * @function
//  * @template T
//  * @param {T[]} data
//  * @param {Function[]} callbacks
//  * @returns {Object.<string, T[]>|T[]}
//  */
// const nestedGroupBy = (data, callbacks) => {
//   if (callbacks.length === 0) return /**@type {T[]} */ data
//   const [iter, ...remainingIters] = callbacks
//   const groupedData = groupBy(data, iter)
//   return Obj.mapValues(
//     groupedData, 
//     (/** @type T[] */ group) => nestedGroupBy(group, remainingIters)
//   )
// }

// /**
//  * @typedef {(a: any, b: any) => number} CompareFn
//  */

// /**
//  * @type {CompareFn}
//  */
// const stdCompare = (a, b) => 
//   a > b ?  1 : 
//   a < b ? -1 : 
//   0

// /**
//  * In-house implementation that hopefully respects Type safety.
//  * For predictability, make sure callback function always returns the 
//  * same type of (scalar) value.
//  * @function
//  * @template T
//  * @param {T[]} data 
//  * @param {(Function)[]} callbacks 
//  * @param {("asc"|"desc")[]} orders
//  * @returns {T[]}
//  */
// const orderBy = (data, callbacks, orders) => {
//   let _data = [...data]

//   for (let i = callbacks.length - 1; i >= 0; i--) {
//     let cb = callbacks[i]
//     _data = orders[i] === "desc"
//       ? _data.sort((a, b) => stdCompare( cb(b), cb(a) ))
//       : _data.sort((a, b) => stdCompare( cb(a), cb(b) ))
    
//   }

//   return _data

// }

// /**
//  * Used directly in Array.prototype.sort()
//  * @param {function} callback Function should a single value type of either string, number, or boolean.
//  * @param {boolean} [reverse=false] Default is false. If true, reverses the sort order.
//  * @returns {CompareFn}
//  */
// const compareBy = (callback, reverse=false) =>  
//   (a, b) => stdCompare(callback(reverse ? b : a), callback(reverse ? a : b))


// // mutating the prev value is kinda bad, but we're making sure
// // we're accumulating on a brand new initial value.

// // const groupByCallback = (prev, curr) => {
// //   const key = callback(curr)
// //   if (prev.hasOwnProperty(key)) prev[key].push(curr)
// //   else prev[key] = [curr]
// //   return prev
// // }
// /**
//  * uniqBy variant that plugs into an Array.prototype.reduce() callback
//  */
// // const _uniqBy = callback => {
  
// //   const initialValue = []

// //   const uniqByCallback = (prev, curr) => {
// //     const currentCbValue = callback(curr)
// //     const L = prev.length
// //     for (let i=0; i < L; ++i) {
// //       if (callback(prev[i]) === currentCbValue) return prev
// //     }
// //     prev.push(curr)
// //     return curr
// //   }

// //   return [uniqByCallback, initialValue]
// // }

// /**
//  * uniqBy variant intended for use with Array.prototype.reduce().
//  * 
//  * Returns the first of any duplicate items.
//  * Should be supplied with an initial value (typically a new empty array).
//  * 
//  * WARNING: function mutates the initial value.
//  * 
//  * @param {function} [iterFn] 
//  * @returns 
//  * @example ```js myData.reduce(_uniqBy(item => item.name), []) ```
// */
// const _uniqBy = (iterFn=(x => x)) => 
//   (prev, curr) => {
//     const currIterValue = iterFn(curr)
//     for (let i=0; i < prev.length; ++i) {
//       if (iterFn(prev[i]) === currIterValue) {
//         return prev
//       }
//     }
//     prev.push(curr)
//     return prev
//   }

// /**
//  * goupBy variant intended for use with Array.prototype.reduce().
//  * 
//  * Returns the first of any duplicate items.
//  * Should be supplied with an initial value (typically a new empty object).
//  * 
//  * WARNING: function mutates the initial value.
//  * 
//  * @param {function} iterFn
//  * @returns 
//  * @example ```js myData.reduce(_groupBy(item => item.name), {}) ```
// */
// const _groupBy = iterFn => (prev, curr) => {
//   const key = iterFn(curr)
//   if (prev.hasOwnProperty(key)) {
//     prev[key].push(curr)
//   }

//   else {
//     prev[key] = [curr]
//   }

//   return prev
// }
// /**
//  * @function
//  * @param {function} iterFn 
//  */
// const _bucketBy = iterFn => (prev, curr) => {
//   const currIterValue = iterFn(curr)
//   const matchIdx = prev.findIndex(group => iterFn(group[0]) === currIterValue)

//   if (matchIdx > -1) prev[matchIdx].push(curr)
//   else prev.push([curr])

//   return prev

// }

// /**
//  * sumBy variant for use with Array.prototype.reduce().
//  * 
//  * Remember to initialize with a starting total (e.g. 0).
//  * @param {function} iterFn 
//  * @example ```js myData.reduce(_sumBy(item => item.qty * item.rate), 0) ```
//  */
// const _sumBy = iterFn => (prev, curr) => {
//   return prev + iterFn(curr)
// }

// /**
//  * keyBy variant intended for use with Array.prototype.reduce().
//  * 
//  * If the iterFn maps 2 items to the same key, the last one encountered
//  * will remain in the final object.
//  * 
//  * WARNING: function mutates the initial value.
//  * 
//  * @param {function} iterFn
//  * @returns 
//  * @example ```js myData.reduce(_keyBy(item => item.name), {}) ```
// */
// const _keyBy = iterFn => (prev, curr) => {
//   prev[iterFn(curr)] = curr
//   return prev
// }

// /**
//  * Callback should not return an array or object as
//  * the internal comparison will not compare by value.
//  * 
//  * Function picks the first of any duplicate items.
//  * @function
//  * @template T
//  * @param {T[]} data
//  * @param {Function} callback
//  * @returns {T[]}
//  */
// const uniqBy = (
//   data, 
//   callback
// ) => {
//   let uniqArray = []
//   let cbValues = []

//   for (let i = 0; i < data.length; i++) {
//     let newCbValue = callback(data[i])
//     if (!cbValues.includes(newCbValue)) {
//       uniqArray.push(data[i])
//       cbValues.push(newCbValue)
//     }
//   }

//   return uniqArray
// }


// /** 
//  * "Data" functions that specialize in processing 
//  * common array-of-object type data 
//  */
// export const Data = { 
//   bucketBy,
//   bucketByEntries,
//   groupBy,
//   keyBy,
//   orderBy,
//   uniqBy,
//   compareBy,
//   _uniqBy,
//   _groupBy,
//   _bucketBy,
//   _keyBy,
//   _sumBy,
//   nestedBucketByEntries,
//   nestedGroupBy,
// }