import React, { useState, useEffect } from "react";
import { fetcher } from "../../restAPIs";

import { useSettingsStore } from "../../Contexts/SettingsZustand";

import { grabDetailedLocationList } from "../../restAPIs";
import LocationList from "./LocationList";
import LocationDetails from "./LocationDetails";
import { motion } from "framer-motion";
import { sortAtoZDataByIndex } from "../../utils";
import useSWR from "swr";

function Locations() {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  const [locationData, setLocationData] = useState([{}]);
  const [selectedLocation, setSelectedLocation] = useState("");
  
  useEffect(() => {
    setIsLoading(true);
    grabDetailedLocationList().then((result) => {
      result = sortAtoZDataByIndex(result, "locName")
      setLocationData(result);
      setIsLoading(false);
    });
  }, []);
  
  

  const handleLocClick = () => {
    setSelectedLocation("");
  };

  return (
    <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
      
      {selectedLocation !== "" ? (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
          <button onClick={handleLocClick}>LOCATION LIST</button>
          <LocationDetails selectedLocation={selectedLocation}/>
          </motion.div>
      ) : (
        <div></div>
      )}
      {selectedLocation === "" ? (
        <LocationList
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          locationData={locationData}
          setLocationData={setLocationData}
        />
      ) : (
        <div></div>
      )}
     </motion.div>
  );
}

export default Locations;
