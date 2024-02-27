// import { DateTime } from "luxon"
// import React, { useState, useMemo } from "react"
// // import { useCombinedOrdersByDate, useLogisticsDimensionData } from "../../../../data/productionData";

// import { Button } from "primereact/button"
// import TimeAgo from "timeago-react";
// import { flatten, groupBy, sumBy } from "lodash";
// import dynamicSor_t from "../../../../functions/dynamicSor_t";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// // import { dateToMmddyyyy } from "../../../../functions/dateAndTime";
// import { useT0T7orders } from "../_hooks/dataHooks";


// // const TODAY = DateTime.now().setZone("America/Los_Angeles").startOf("day")

// export const SevenDayList = () => {
//   const [shouldRefresh, setShouldRefresh] = useState(false)
//   const { data:T0T7data } = useT0T7orders({ 
//     shouldFetch: true, 
//     useLocal: true,
//     manualRefresh: shouldRefresh
//   })
  
//   const prepareData = () => {
//     if (!T0T7data) return []

//     const { timestamp, dimensionData, ...ordersByDate } = T0T7data
//     const { products } = dimensionData
    
//     const _withTimestamp = flatten(Object.values(ordersByDate).map((dateGroup, idx) => {
//       return dateGroup.map(order => ({ ...order, relativeDate: idx }))
//     }))

//     const _byProdNick = groupBy(_withTimestamp, order => order.prodNick)

//     const _byProdNickByDate = Object.keys(_byProdNick).map(prodNick => {
//       return ({
//         packGroup: products[prodNick].packGroup,
//         prodNick,
//         T0: _byProdNick[prodNick].filter(order => order.relativeDate === 0 && order.isStand !== false),
//         T1: _byProdNick[prodNick].filter(order => order.relativeDate === 1),
//         T2: _byProdNick[prodNick].filter(order => order.relativeDate === 2),
//         T3: _byProdNick[prodNick].filter(order => order.relativeDate === 3),
//         T4: _byProdNick[prodNick].filter(order => order.relativeDate === 4),
//         T5: _byProdNick[prodNick].filter(order => order.relativeDate === 5),
//         T6: _byProdNick[prodNick].filter(order => order.relativeDate === 6),
//         T7: _byProdNick[prodNick].filter(order => order.relativeDate === 7),
//       })
//     })
//     console.log("_byProdNickByDate", _byProdNickByDate)

//     return _byProdNickByDate.sort(dynamicSor_t('packGroup'))
//   }
//   const reportData = useMemo(prepareData, [T0T7data]) ?? []
//   const [expandedRows, setExpandedRows] = useState()
//   const rowExpansionTemplate = (rowData) => {
//     // console.log(data)
//     const { packGroup, prodNick, ...ordersByDate } = rowData
//     console.log(ordersByDate)
//     const rowByLocNick = groupBy(flatten(Object.values(ordersByDate)), order => order.locNick)
//     const rowByLocNickByDate = Object.keys(rowByLocNick).map(locNick => {
//       return ({
//         locNick,
//         T0: rowByLocNick[locNick].filter(order => order.relativeDate === 0),
//         T1: rowByLocNick[locNick].filter(order => order.relativeDate === 1),
//         T2: rowByLocNick[locNick].filter(order => order.relativeDate === 2),
//         T3: rowByLocNick[locNick].filter(order => order.relativeDate === 3),
//         T4: rowByLocNick[locNick].filter(order => order.relativeDate === 4),
//         T5: rowByLocNick[locNick].filter(order => order.relativeDate === 5),
//         T6: rowByLocNick[locNick].filter(order => order.relativeDate === 6),
//         T7: rowByLocNick[locNick].filter(order => order.relativeDate === 7),
//       })
//     })
//     console.log(rowByLocNickByDate)
//     return <DataTable value={rowByLocNickByDate} size="small" 
//       paginator rows={10} alwaysShowPaginator={false} style={{width: "95%", margin: "auto"}}
//     >
//       <Column header="Location" field="locNick"/>
//       <Column header="T0" body={rowData => sumBy(rowData.T0, order => order.qty) || ""} />
//       <Column header="T1" body={rowData => sumBy(rowData.T1, order => order.qty) || ""} />
//       <Column header="T2" body={rowData => sumBy(rowData.T2, order => order.qty) || ""} />
//       <Column header="T3" body={rowData => sumBy(rowData.T3, order => order.qty) || ""} />
//       <Column header="T4" body={rowData => sumBy(rowData.T4, order => order.qty) || ""} />
//       <Column header="T5" body={rowData => sumBy(rowData.T5, order => order.qty) || ""} />
//       <Column header="T6" body={rowData => sumBy(rowData.T6, order => order.qty) || ""} />
//       <Column header="T7" body={rowData => sumBy(rowData.T7, order => order.qty) || ""} />
//     </DataTable>
//   }
  
//   return(<>
//     <h1>7 Day List</h1>
//     <Button label="Fetch" onClick={() => setShouldRefresh(true)} />
//     <p>Data fetched & saved in local storage <TimeAgo datetime={T0T7data?.timestamp}/>.</p>
//     <p>Each new day, data will be considered stale and refetched on page load. Use the button to refresh more frequently if needed.</p>

//     <DataTable 
//       value={reportData} 
//       size="small"
//       rowGroupMode="subheader" groupRowsBy="packGroup"
//       sortMode="single" sortField="packGroup"
//       rowGroupHeaderTemplate={data => <div><b>{data.packGroup}</b></div>}
//       scrollable
//       scrollHeight="48rem"
//       expandedRows={expandedRows} 
//       onRowToggle={(e) => setExpandedRows(e.data)}
//       rowExpansionTemplate={rowExpansionTemplate}
//     >
//       {/* <Column field="packGroup" header="packGroup" /> */}
//       <Column expander style={{ width: '5rem' }} />
//       <Column field="prodNick" header="Product" />
//       <Column header="T0" body={rowData => sumBy(rowData.T0, order => order.qty)}/>
//       <Column header="T1" body={rowData => sumBy(rowData.T1, order => order.qty)}/>
//       <Column header="T2" body={rowData => sumBy(rowData.T2, order => order.qty)}/>
//       <Column header="T3" body={rowData => sumBy(rowData.T3, order => order.qty)} />
//       <Column header="T4" body={rowData => sumBy(rowData.T4, order => order.qty)}/>
//       <Column header="T5" body={rowData => sumBy(rowData.T5, order => order.qty)}/>
//       <Column header="T6" body={rowData => sumBy(rowData.T6, order => order.qty)}/>
//       <Column header="T7" body={rowData => sumBy(rowData.T7, order => order.qty)}/>
//     </DataTable>
  
//   </>)
// }



export const SevenDayList = () => <div>deactivated</div>
