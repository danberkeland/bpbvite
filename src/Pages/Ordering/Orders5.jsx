// import React, { useState } from "react";
// import { useSettingsStore } from "../../Contexts/SettingsZustand";
// import { useOrderData } from "./DataFetching/hooks";
// import { OrderDisplay2 } from "./OrderComponents/OrderDisplay";
// import { OrderSelection2 } from "./OrderComponents/OrderSelection";

// import { DateTime } from "luxon";



// const Orders5 = () => {
//   const bpbTime = DateTime.now().setZone('America/Los_Angeles')
//   const bpbHour = bpbTime.hour
//   const orderSubmitDate = bpbHour >= 18 ? bpbTime.plus({ days: 1 }) : bpbTime

//   const globalState = useSettingsStore()
//   const user = {
//     name: globalState.user,
//     authClass: globalState.authClass,
//     location: globalState.userObject.attributes["custom:defLoc"]
//   }
//   const [selection, setSelection] = useState({
//     location: user.location === 'backporch' ? null : user.location,
//     date: null,
//   })
//   const orderSelectionProps = { user, selection, setSelection }

//   // auto fetches data when location and date are selected
//   const { orderData, orderDataErrors } = useOrderData(selection)

//   if (orderDataErrors) return <pre>{JSON.stringify(orderDataErrors, null, 2)}</pre>
//   return (
//     <div>
//       <h4>Orders5</h4>
//       <p>{"BPB Time: " + bpbTime.toLocaleString(DateTime.DATETIME_MED)}</p>
//       <p>{"Order Submit Date: " + orderSubmitDate.toLocaleString() + " (6:00PM cutoff)"}</p>
//       <p>{"Selected delivDate: " + (selection && selection.date && DateTime.fromISO(selection.date.toISOString()).toLocaleString())}</p>
//       <OrderSelection2 props={orderSelectionProps} />
//       {orderData && user && 
//         <OrderDisplay2 data={orderData} user={user} selection={selection} />
//       }

//       <pre>{JSON.stringify(selection, null, 2)}</pre>

//       <div style={{height: "150px"}}></div>
//     </div>

//   )
// }

// export default Orders5

