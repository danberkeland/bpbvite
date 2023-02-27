import React, { useState } from "react";

import { FilterMatchMode } from "primereact/api";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import LocationDetails from "./LocationDetails";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { withFadeIn } from "../../hoc/withFadeIn";
import { useLocationListFull } from "../../data/locationData";

const initialState = {
  Type: "Location",
  locNick: "",
  locName: "",
  zoneNick: "",
  addr1: "",
  addr2: "",
  city: "",
  zip: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  toBePrinted: true,
  toBeEmailed: true,
  printDuplicate: false,
  terms: "",
  invoicing: "",
  latestFirstDeliv: 7,
  latestFinalDeliv: 10,
  webpageURL: "",
  picURL: "",
  gMap: "",
  specialInstructions: "",
  delivOrder: 0,
  qbID: "",
  currentBalance: "",
};

function LocationList({ selectedLocation, setSelectedLocation }) {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const setIsCreate = useSettingsStore((state) => state.setIsCreate);
  const isCreate = useSettingsStore((state) => state.isCreate);

  const [filter] = useState({
    locName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const { data:locationList, errors:locationListErrors } = useLocationListFull(true);
  const formKeys = Object.keys(initialState)
  const tableData = locationList?.map(item => {
    let cleanedItem = formKeys.reduce((cItem, key) => {
      if (item.hasOwnProperty(key)) return {...cItem, [key]: item[key]}
      else return {...cItem, [key]: initialState[key]}
    }, {})

    return cleanedItem
  })

  const handleClick = () => {
    setIsCreate(!isCreate);
  };

  const FadeLocationDataTable = withFadeIn(() => {
    return (
      <div className="bpbDataTable">
        <DataTable
        className="datatable"
        value={tableData}
        selectionMode="single"
        metaKeySelection={false}
        selection={selectedLocation}
        onSelectionChange={(e) => 
          setSelectedLocation({ ...initialState, ...e.value })
        }
        sortField="locName"
        sortOrder={1}
        responsiveLayout="scroll"
        filterDisplay="row"
        filters={filter}
      >
        <Column field="locName" filterPlaceholder="Search Locations" filter />
        <Column field="locNick"  />
      </DataTable>
      </div>
      
    );
  });

  return (
    <React.Fragment>
      {isCreate ? (
        <React.Fragment>
          <button onClick={handleClick}>+ LOCATION LIST</button>
          <LocationDetails
            initialState={initialState}
            locationList={locationList.data}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <button onClick={handleClick}>+ CREATE LOCATION</button>
          {(!locationList && !locationListErrors) ? setIsLoading(true) : setIsLoading(false)}

          {locationListErrors && <div>Table Failed to load</div>}
          {locationList && <FadeLocationDataTable />}
          <div className="bottomSpace"></div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default LocationList;
