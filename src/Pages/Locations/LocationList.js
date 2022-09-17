import React, { useState, useEffect } from "react";

import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { FilterMatchMode } from "primereact/api";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { grabDetailedLocationList } from "../../restAPIs";
import CreateLocation from "./CreateLocation";
import { motion } from "framer-motion";

const submitButtonStyle = {
  width: "100px",
  margin: "20px",
  fontSize: "1.2em",
  backgroundColor: "red",
};

function LocationList({
  selectedLocation,
  setSelectedLocation,
  locationData,
  setLocationData,
}) {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  const [filter, setFilter] = useState({
    locName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [isCreate, setIsCreate] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    grabDetailedLocationList().then((result) => {
      
      setLocationData(result);
      setIsLoading(false);
    });
  }, []);

  const handleClick = () => {
    setIsCreate(!isCreate);
  };

  const handleSubmit = () => {
    setIsCreate(!isCreate);
  };

  return (
    <React.Fragment>
      {!isCreate ? (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
          <button onClick={handleClick}>+ CREATE LOCATION</button>

          <DataTable
            className="dataTable"
            value={locationData}
            selectionMode="single"
            metaKeySelection={false}
            selection={selectedLocation}
            onSelectionChange={(e) => setSelectedLocation(e.value)}
            sortField="locNick"
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
          <div className="bottomSpace"></div>
          </motion.div>
      ) : (
        <React.Fragment>
          
          <div className="submitButton">
            <Button
              label="Submit"
              className="p-button-raised p-button-rounded"
              style={submitButtonStyle}
              onClick={handleSubmit}
            />
          </div>
          <button onClick={handleClick}>+ LOCATION LIST</button>
          <CreateLocation />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default LocationList;
