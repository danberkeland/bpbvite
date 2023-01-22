// import React from "react"

// import { Dropdown } from "primereact/dropdown"

// import { useLocationList } from "../Data/locationData"

// export const StandingSelection = ({selection, canChooseLocation}) => {
//   const { location, setLocation, dayOfWeek, setDayOfWeek } = selection
//   const { data:locationList, errors:locationListErrors } = useLocationList(canChooseLocation)

//   return(
//     <div>
//         {canChooseLocation && 
//           <span className="p-float-label p-fluid" style={{marginTop: "25px"}}>
//             <Dropdown 
//               id="locationDropdown"
//               options={locationList || null}
//               optionLabel="locName"
//               optionValue="locNick"
//               value={location}
//               onChange={e => setLocation(e.value)}
//             />
//             <label htmlFor="locationDropdown">{locationList ? "Location" : (locationListErrors ? "Error" : "Loading...")}</label>
//           </span>
//         }

        
//     </div>

//   )


// }