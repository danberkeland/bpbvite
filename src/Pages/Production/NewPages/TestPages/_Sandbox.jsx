// // import { DataTable } from "primereact/datatable"
// // import { useOrderSubscription } from "../../../../data/swr2.x.x/useSubscription"
// // import { Column } from "primereact/column"
// import { DateTime } from "luxon"
// import { keyBy } from "lodash"
// // import TimeAgo from "timeago-react"
// import { Button } from "primereact/button"
// import { croixCountFlip, syncSquareOrders, testLegacyCroixFlip } from "../../../../helpers/databaseFetchers"
// import { useListData } from "../../../../data/_listData"
// import { useT0T7ProdOrders } from "../../../../data/useT0T7ProdOrders"
// import { useLegacyFormatDatabase } from "../../../../data/legacyData"


// // const formatTime = (isoStr) => DateTime.fromISO(isoStr)
// //   .setZone('America/Los_Angeles')
// //   .toFormat('MMM dd, h:mm a')

// const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
// const todayISO = todayDT.toFormat('yyyy-MM-dd')

// const syncSquare = ({ productCache, orderCache }) => {
//   (!!productCache.data && !!orderCache.data) 
//     ? syncSquareOrders({ productCache, orderCache })
//     : console.log("product data required to execute")
// }

// const croixFlip = ({ productCache, orderCache }) => {
//   return (!!productCache.data && !!orderCache.data) 
//     ? croixCountFlip({ productCache, orderCache })
//     : console.log("product data required to execute")

// }

// const legacyCroixFlip = (database) => {
//   return !!database
//     ? testLegacyCroixFlip(database)
//     : console.log("database required to execute")

// }


// export const Sandbox = () => {

//   const { data: database } = useLegacyFormatDatabase()
//   const productCache = useListData({ tableName: "Product", shouldFetch: true })
//   const orderCache = useListData({ tableName: "Order", shouldFetch: true })
//   const prodOrderCache = useT0T7ProdOrders({ shouldFetch: true, reportDate: todayISO})

//   // const { data } = useOrderSubscription()

//   // const tableData = orderBy(
//   //   data,
//   //   'updatedOn', 
//   //   'desc'
//   // )

//   return (<div>
//     {/* <DataTable 
//       value={tableData}
//       size='small'
//     >
//       <Column header='locNick' field='locNick' />
//       <Column header='prodNick' field='prodNick' />
//       <Column header='qty' field='qty' />
//       <Column header='updatedBy' field='updatedBy' />

//       <Column header='timeAgo'
//         body={row => <TimeAgo datetime={row?.updatedOn} />}
//       />
//       <Column header='updatedOn' 
//         body={row => <span>
//           {formatTime(row?.updatedOn)} 
//         </span>
//         } 
//       />
//       <Column header='action' field='_action' />
//     </DataTable> */}

//     <Button label="Test Square" 
//       onClick={() => syncSquare({ productCache, orderCache })}
//       style={{margin: "1rem"}}
//     />

//     <Button label="Test Croix Inventory Flip" 
//       onClick={() => croixFlip({ productCache, orderCache: prodOrderCache })}
//       style={{margin: "1rem"}}
//     />

//     <Button label="Test Legacy Croix Flip" 
//       onClick={() => legacyCroixFlip(database)}
//       style={{margin: "1rem"}}
//     />

//     <Button label="Test Croix Flip versions" 
//       onClick={() => {
//         const legacyItems = legacyCroixFlip(database)
//         const newItems = croixFlip({ productCache, orderCache: prodOrderCache })

//         console.log(legacyItems, newItems)

//         const _legacy = keyBy(legacyItems, "prodNick")

//         console.log("Testing new vs old overnight flip values")
//         newItems.forEach(item => {
//           const oldItem = _legacy[item.prodNick]
//           console.log(`${item.prodNick}:`)
//           console.log('freezerCount', item.freezerCount, oldItem.freezerCount)
//           console.log('freezerClosing', item.freezerClosing, oldItem.freezerClosing)
//           console.log('freezerNorth', item.freezerNorth, oldItem.freezerNorth)
//           console.log('freezerNorthClosing', item.freezerNorthClosing, oldItem.freezerNorthClosing)
//           console.log('sheetMake', item.sheetMake, oldItem.sheetMake)
//         })

//       }}
//       style={{margin: "1rem"}}
//     />


//   </div>)
// }


export const Sandbox = () => {

  return <h1>Not in use for now</h1>
}

