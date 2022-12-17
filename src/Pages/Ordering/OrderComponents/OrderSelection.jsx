import React from "react"

import { Card } from "primereact/card"
import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"

import { useLocationList } from "../DataFetching/hooks"

export const OrderSelection = ({selection, canChooseLocation}) => {
  const { location, setLocation, delivDate, setDelivDate } = selection
  const { locationList, locationListErrors } = useLocationList(canChooseLocation)

  return(
    <Card 
      title="Order Selection"
    >
      <div>
        {canChooseLocation && 
          <span className="p-float-label p-fluid" style={{marginTop: "25px"}}>
            <Dropdown 
              id="locationDropdown"
              options={locationList ? locationList : []}
              optionLabel="locName"
              optionValue="locNick"
              value={location}
              onChange={e => setLocation(e.value)}
            />
            <label htmlFor="locationDropdown">{locationList ? "Location" : (locationListErrors ? "Error" : "Loading...")}</label>
          </span>
        }

        <span className="p-float-label p-fluid" style={{marginTop: "30px"}}>
          <Calendar 
            id="calendar"
            touchUI={true}
            style={{width: "100%"}}
            value={delivDate}
            onChange={e => setDelivDate(e.value)}
          />
          <label htmlFor="calendar">{"Delivery Date"}</label>
        </span>

      </div> 
    </Card>
    
  )
}

// export function OrderSelection({user, selectionProps, debug}) {
//   // user (context) values are not expected to change during component lifecycle
//   const { location, setLocation, date, setDate } = selectionProps
  
//   // user.location is used to decide whether or not to fetch
//   const { locationList, locationListErrors } = useLocationList(user.location)

//   const CardTitle = () => "Order Selection"
  
//   return(
//     <Card 
//       style={{margin: "10px"}}
//       title={<CardTitle />}
//     >
//       <div>

//         {(user.location === 'backporch') && 
//           <span className="p-float-label p-fluid" style={{marginTop: "25px"}}>
//             <Dropdown 
//               id="locationDropdown"
//               options={locationList ? locationList : []}
//               optionLabel="locName"
//               optionValue="locNick"
//               value={location}
//               onChange={e => {
//                 setLocation(e.value)
//               }}
//             />
//             <label htmlFor="locationDropdown">{true ? "Location" : "Loading..."}</label>
//           </span>
//         }

//         <span className="p-float-label p-fluid" style={{marginTop: "30px"}}>
//           <Calendar 
//             id="calendar"
//             touchUI={true}
//             style={{width: "100%"}}
//             value={date}
//             onChange={e => {
//               setDate(e.value)
//             }}
//           />
//           <label htmlFor="calendar">{"Delivery Date"}</label>
//         </span>

//         {debug && 
//           <Panel header="OrderSelection Variables" toggleable collapsed={true} style={{marginTop: "15px"}}>
//             <pre>{"user: " + JSON.stringify(user, null, 2)}</pre>
//             <pre>{"selection: " + JSON.stringify(selectionProps, null, 2)}</pre>
//             <pre>{"locationList (head): " + (locationList ? JSON.stringify(locationList.slice(0,5), null, 2) : "null")}</pre>
//           </Panel>
//         }
//       </div> 
//     </Card>
//   )
// }



// export function OrderSelection2({props}) {
//   const { user, selection, setSelection } = props
//   const { locationList, locationListErrors } = useLocationList(user.location)
  
//   return(
//     <Card 
//       style={{margin: "10px"}}
//       title="Order Selection"
//     >
//       <div>

//         {(user.location === 'backporch') && 
//           <span className="p-float-label p-fluid" style={{marginTop: "25px"}}>
//             <Dropdown 
//               id="locationDropdown"
//               options={locationList ? locationList : []}
//               optionLabel="locName"
//               optionValue="locNick"
//               value={selection.location}
//               onChange={e => setSelection({
//                   ...selection,
//                   ...{location: e.value}
//               })}
//             />
//             <label htmlFor="locationDropdown">{locationList ? "Location" : "Loading..."}</label>
//           </span>
//         }

//         <span className="p-float-label p-fluid" style={{marginTop: "30px"}}>
//           <Calendar 
//             id="calendar"
//             touchUI={true}
//             style={{width: "100%"}}
//             value={selection.date}
//             onChange={e => setSelection({
//               ...selection,
//               ...{date: e.value}
//             })}
//           />
//           <label htmlFor="calendar">{"Delivery Date"}</label>
//         </span>

//       </div> 
//     </Card>
    
//   )
// }