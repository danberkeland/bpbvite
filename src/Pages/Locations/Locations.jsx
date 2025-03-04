import React, { useState } from "react";

import LocationList from "./LocationList";
import LocationDetails from "./LocationDetails";
import { withFadeIn } from "../../components/hoc/withFadeIn";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { Button } from "primereact/button";

function Locations() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const setIsEdit = useSettingsStore((state) => state.setIsEdit);

  const handleLocClick = () => {
    setSelectedLocation("");
    setIsEdit(false);
    
  };

  const FadeLocationList = withFadeIn(() => {
    return (
      <div style={{width: "60rem", display: "flex", flexDirection: "column"}}>
        <LocationList
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      </div>
    );
  });

  return (
    <div style={{display: "flex", justifyContent: "center"}}>
      {selectedLocation === "" ? (
        <FadeLocationList />
      ) : (
        <div style={{flex: "0 1 60rem"}}>
          <Button label="LOCATION LIST"
            icon="pi pi-fw pi-chevron-left"
            iconPos="left"
            className="fullButton" 
            style={{margin: ".5rem"}}
            onClick={handleLocClick}/>
          <LocationDetails initialState={selectedLocation} />
        </div>
      )}
    </div>
  );
}

export default Locations;
