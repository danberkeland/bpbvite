import React, { useState, useEffect } from "react";

import { FilterMatchMode } from "primereact/api";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import LocationDetails from "./LocationDetails";
import { motion } from "framer-motion";
import { useLocationList } from "../../hooks";
import { useSettingsStore } from "../../Contexts/SettingsZustand";


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

  const { locationList } = useLocationList();

  useEffect(() => {
    console.log("locationList", locationList);
  }, [locationList]);

  const handleClick = () => {
    setIsCreate(!isCreate);
  };

  return (
    <React.Fragment>
      {!isCreate ? (
        <React.Fragment>
          <button onClick={handleClick}>+ CREATE LOCATION</button>
          {locationList.isLoading ? setIsLoading(true) : setIsLoading(false)}

          {locationList.isError && <div>Table Failed to load</div>}
          {locationList.data && (
            <motion.div
              initial={{ opacity: 0, x: "0", y: "0" }}
              animate={{ opacity: 1, x: "0" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              exit={{ opacity: 0, x: "0" }}
            >
              <DataTable
                className="dataTable"
                value={locationList.data}
                selectionMode="single"
                metaKeySelection={false}
                selection={selectedLocation}
                onSelectionChange={(e) => setSelectedLocation({...initialState,...e.value})}
                sortField="locName"
                sortOrder={1}
                responsiveLayout="scroll"
                filterDisplay="row"
                filters={filter}
              >
                <Column
                  field="locName"
                  filterPlaceholder="Search Locations"
                  filter
                />
              </DataTable>
            </motion.div>
          )}
          <div className="bottomSpace"></div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <button onClick={handleClick}>+ LOCATION LIST</button>
          <LocationDetails
            initialState={
              selectedLocation !== "" ? selectedLocation : initialState
            }
            locationList={locationList.data}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default LocationList;
