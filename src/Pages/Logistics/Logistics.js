import React, {useEffect, useState} from "react";
import Loader from "../../AppStructure/Loader";

// State Management
import { useLocUserList } from "../../swr";

// Components
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button"
import { Card } from "primereact/card"


import { Dropdown } from "primereact/dropdown"
import { BreadCrumb, Breadcrumb } from "primereact/breadcrumb"


import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { useLocationListFull } from "../../data/locationData"
import { useZoneListFull } from "../../data/zoneData"
import dynamicSort from "../../functions/dynamicSort";

function Logistics() {
  const { currentLoc:locNick, user:name, authClass } = useSettingsStore()
  const user = { locNick, name, authClass }

  const readAuthorized = user.authClass === 'bpbreadonly' || user.authClass === 'bpbfull'
  
  const { data:locationData } = useLocationListFull(readAuthorized)
  const { data:zoneData } = useZoneListFull(readAuthorized)

  const [zone, setZone] = useState(null)
  const [loc, setLoc] = useState(null)
  //const location = locationData?.find(() => i=> i.locNick === loc)
  const [location, setLocation] = useState(null)

  return (
    <div>
      {readAuthorized &&
        <div style={{padding: "0.5rem", marginBottom: "200px"}}>

          <h1>Logistics: Locations</h1>
          <pre>{zone + ", " + loc}</pre>
          <pre>{JSON.stringify(location, null, 2)}</pre>
          <pre>{getMobileOperatingSystem()}</pre>
          <div style={{padding: "0.5rem"}} className="p-fluid">
            <Dropdown 
              className="p-column-filter"
              options={zoneData?.sort(dynamicSort("zoneName"))}
              optionLabel="zoneName"
              optionValue="zoneNick"
              placeholder="Filter by Zone"
              value={zone}
              onChange={e => setZone(e.value)}
              filter
              resetFilterOnHide
              showClear
              disabled={!!loc}
            />
          </div>
          
          <div style={{padding: "0.5rem"}}>
          <DataTable
            value={makeTableData(locationData, zone, loc)}
            responsiveLayout
            selectionMode="single"
            onSelectionChange={e => {
              setLoc(e.value.locNick)
              setLocation(locationData.find(i => i.locNick === e.value.locNick))
            }}
          >
            <Column
              field="locName"
              header="Location"
            />
          </DataTable>

          {!!loc &&
            <div style={{marginTop: "2rem"}}>
              <Button label="Back to list" icon="pi pi-chevron-left" onClick={() => {
                setLoc(null)
                setLocation(null)
              }}/>

              <Card
                title={location.locName}
              >
                <p>{location.addr1}</p>
                <p>{location.addr2}</p>
                <p>{location.city + ", CA " + location.zip}</p>
                <p>{location.phone}</p>

                <p>{`${location.addr1.replaceAll(' ', '+')}+${location.addr2.replaceAll(' ', '+')},+${location.city.replaceAll(' ', '+')}+,${location.zip}`}</p>
                {/* <p>{mapsSelector(`${location.addr1.replaceAll(' ', '+')}+${location.addr2.replaceAll(' ', '+')},+${location.city.replaceAll(' ', '+')}+,${location.zip}`)}</p> */}
                <p><a href={`${getMapsLink()}/place/${location.addr2.replaceAll(' ', '+')},+${location.city.replaceAll(' ', '+')}+,${location.zip}`} target="_blank" rel="noopener noreferrer">{'Find on Google Maps'}</a></p>

                {/* <a href={"tel:" + location.phone.replaceAll('-', '')} className="tel-link">{location.phone}</a> */}

                {/* <Button label='View with Maps' 
                  onClick={() => mapsSelector(`${location.addr1.replaceAll(' ', '+')}+${location.addr2.replaceAll(' ', '+')},+${location.city.replaceAll(' ', '+')}+,${location.zip}`)}
                /> */}

              </Card>

            </div>
          }

          </div>
        </div>
      }
    </div>
  )


}

export default Logistics;


const makeTableData = (locationData, zone, loc) => {
  if (!locationData) return []
  if (!zone && !loc) return locationData.sort(dynamicSort('prodName'))
  return locationData
    .filter(item => !zone || item.zoneNick === zone)
    .filter(item => !loc || item.locNick === loc)
    .sort(dynamicSort('delivOrder'))
}


const getMapsLink = () => {
  let os = getMobileOperatingSystem()
  if (os === 'iOS') return 'maps://maps.google.com/maps'
  else return 'https://maps.google.com/maps'}


function mapsSelector(placeString) {
  let os = getMobileOperatingSystem()
  if (os === 'iOS') {
    window.open(`maps://maps.google.com/maps/place/${placeString}`)
  } else {
    window.open(`https://maps.google.com/maps/place/${placeString}`)
  } 
}

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
      return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
  }

  return "unknown";
}


// locations by zone, sorted in delivOrder


// <div>
//   <iframe
//     width="85%"
//     height="400px"
//     style={{border: "0"}}
//     loading="lazy"
//     allowFullScreen
//     referrerpolicy="no-referrer-when-downgrade"
//     src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD0DRHSaGgc8xMVAkYfmAptJDJMIEzmtN8&q=350+High+St,+San+Luis+Obispo,+CA+93401"
//   >
//   </iframe>
// 
// </div>


//   <React.Fragment>
//     {locationList.isLoading && <Loader />}
//     {locationList.isError && <div>Table Failed to load</div>}
//     {locationList.data && (
//       <DataTable
//         value={locationList.data}
//         selectionMode="single"
//         metaKeySelection={false}
//         responsiveLayout="scroll"
//         size="small"
//         showGridlines
//       >
//         <Column field="locName" header="Locations" />
//       </DataTable>
//     )}
//   </React.Fragment>