import React, { useEffect, useState } from "react";
import Loader from "../../AppStructure/Loader";

// State Management
import { useLocUserList } from "../../swr";

// Components
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Accordion, AccordionTab } from "primereact/accordion";

import { Dropdown } from "primereact/dropdown";
import { BreadCrumb, Breadcrumb } from "primereact/breadcrumb";

import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { useLocationListFull } from "../../data/locationData";
import { useZoneListFull } from "../../data/zoneData";
import dynamicSort from "../../functions/dynamicSort";
import LogisticsTraining from "./LogisticsTraining";

function Logistics() {
  const { currentLoc: locNick, user: name, authClass } = useSettingsStore();
  const user = { locNick, name, authClass };

  const readAuthorized =
    user.authClass === "bpbreadonly" || user.authClass === "bpbfull";

  const { data: locationData } = useLocationListFull(readAuthorized);
  const { data: zoneData } = useZoneListFull(readAuthorized);

  const [zone, setZone] = useState(null);
  const [loc, setLoc] = useState(null);
  const [location, setLocation] = useState(null);
  const [training, setTraining] = useState(false);

  const gMapLink = makeLink(location?.gMap)
  const tableData = makeTableData(locationData, zone, loc)
  const directionsString = tableData
  .map(loc => getGMapEntity(loc.gMap))
  .filter(item => item !== '')
  .join('/')

  const os = getMobileOperatingSystem()

  const handleTraining = () => {
    setTraining(!training)
  }

  return (
    <div>
      {readAuthorized &&
        <div style={{padding: "0.5rem", marginBottom: "200px"}}>
          <h1>Logistics: Locations</h1>
          <button onClick={handleTraining}>Long Driver Training</button>

          {training && <LogisticsTraining />}

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
          
          <div style={{margin: "0.5rem"}}>
          {!loc &&
            <div>
              <DataTable
                value={tableData}
                responsiveLayout
                reorderableRows
                selectionMode="single"
                onSelectionChange={e => {
                  setLoc(e.value.locNick)
                  setLocation(locationData.find(i => i.locNick === e.value.locNick))
                  //console.log(e.value.locName, e.value.gMap)
                  console.log(getGMapEntity(e.value.gMap))
                }}
              >
                {/* <Column rowReorder style={{width: '3em'}} /> */}
                <Column
                  field="locName"
                  header="Location"
                />
                <Column 
                  field="gMap"
                  body={rowData => {
                    if (!!rowData.gMap) return <i className="pi pi-map-marker" />
                    return null
                  }}
                />
              </DataTable>

              {!!zone && 
                <div style={{marginTop: "1.5rem", padding: ".5rem"}}>
                  {/* <a href={`${os === 'iOS' ? 'maps' : 'https'}://www.google.com/maps/dir//${directionsString}`} target="_blank" rel="noopener noreferrer">Load Directions in Google Maps</a> */}
                  <div style={{marginTop: "1.5rem", padding: ".5rem"}}>
                    <a href={`https://www.google.com/maps/dir//${directionsString}`} target="_blank" rel="noopener noreferrer">Load Directions in Google Maps ("Android Link")</a>
                  </div>
                  <div style={{marginTop: "1.5rem", padding: ".5rem"}}>
                    <a href={`maps://www.google.com/maps/dir//${directionsString}`} target="_blank" rel="noopener noreferrer">Load Directions in Google Maps ("iOS Link")</a>
                  </div>
                
                </div>
              }
            </div>
          }

          {!!loc &&
            <div>
              <Button label="Back to list" icon="pi pi-chevron-left" onClick={() => {
                setLoc(null)
                setLocation(null)
              }}/>


              <Card
                title={location.locName}
              >
                {/* <p>{location.addr1}</p> */}

                <div style={{margin: ".25rem", display: "flex", gap: "1rem"}}>
                  <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <i className="pi pi-map-marker"></i>
                  </div>
                  <div>
                    <div>{location.addr2}</div>
                    <div>{location.city + ", CA " + location.zip}</div>
                  </div>

                </div>
                <div style={{margin: ".25rem", padding: ".75rem", backgroundColor: "#f4cc8b", border: "1px solid #e1b163", borderRadius: ".25rem", width: "fit-content", display: "flex", justifyContent: "left", gap: "1rem"}}>
                  <i className="pi pi-phone" /> <span>{location.phone}</span>
                </div>

                {!!location.gMap && 
                  <>
                    <div style={{margin: ".25rem"}}>
                      <i style={{marginRight: "1rem"}} className="pi pi-map" />
                      <a href={location.gMap} target="_blank" rel="noopener noreferrer">View in Google Maps (Android Link)</a>
                    </div>
                    <div style={{margin: ".25rem"}}>
                      <i style={{marginRight: "1rem"}} className="pi pi-map" />
                      <a href={location.gMap.replace('https', 'maps')} target="_blank" rel="noopener noreferrer">View in Google Maps (iOS Link)</a>
                    </div>
                  </>
                }
                {!location.gMap && <p>Google Maps link not found.</p>}


              </Card>

              <pre>{getMobileOperatingSystem()}</pre>
              <pre>{zone + ", " + loc}</pre>
              {/* <pre>{JSON.stringify(location, null, 2)}</pre> */}

            </div>
          }

          </div>
        </div>
      }
    </div>
  );
}

export default Logistics;

const makeTableData = (locationData, zone, loc) => {
  if (!locationData) return [];
  if (!zone && !loc) return locationData.sort(dynamicSort("prodName"));
  return locationData
    .filter((item) => !zone || item.zoneNick === zone)
    .filter((item) => !loc || item.locNick === loc)
    .sort(dynamicSort("delivOrder"));
};

/**
 * Adjusts google maps link for iOS users by changing the
 * stored address from "https://..." to "maps://..." as recommended from
 * https://medium.com/@colinlord/opening-native-map-apps-from-the-mobile-browser-afd66fbbb8a4
 *
 * Allows mobile users to open links in the native maps app.
 *
 * @param {string} gMapLink - googleMaps address value stored in DDB
 * @returns
 */
const makeLink = (gMapLink) => {
  if (!gMapLink) return "";
  let os = getMobileOperatingSystem();

  if (os === "iOS") return gMapLink.replace("https", "maps");
  else return gMapLink;
};

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

const getGMapEntity = (gMapLink) => {
  if (!gMapLink) return "";
  const parts = gMapLink.split("/");

  return parts[5];
};

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
