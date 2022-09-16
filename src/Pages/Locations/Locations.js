import React, { useState, useEffect } from "react";

import { useSettingsStore } from "../../Contexts/SettingsZustand";

import { grabDetailedLocationList } from "../../restAPIs";
import LocationList from "./LocationList";
import LocationDetails from "./LocationDetails";

function Locations() {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  const [locationData, setLocationData] = useState([{}]);
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    setIsLoading(true);
    grabDetailedLocationList().then((result) => {
    
      setLocationData(result);
      setIsLoading(false);
    });
  }, []);

  const handleLocClick = () => {
    setSelectedLocation("");
  };

  return (
    <React.Fragment>
      
      {selectedLocation !== "" ? (
        <React.Fragment>
          <button onClick={handleLocClick}>LOCATION LIST</button>
          <LocationDetails selectedLocation={selectedLocation}/>
        </React.Fragment>
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
    </React.Fragment>
  );
}

export default Locations;
