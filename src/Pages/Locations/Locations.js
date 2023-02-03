import React, { useState } from "react";

import LocationList from "./LocationList";
import LocationDetails from "./LocationDetails";
import { withFadeIn } from "../../hoc/withFadeIn";
import { useSettingsStore } from "../../Contexts/SettingsZustand";

function Locations() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const setIsEdit = useSettingsStore((state) => state.setIsEdit);

  const handleLocClick = () => {
    setSelectedLocation("");
    setIsEdit(false);
    
  };

  const FadeLocationList = withFadeIn(() => {
    return (
      <LocationList
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
    );
  });

  return (
    <React.Fragment>
      {selectedLocation === "" ? (
        <FadeLocationList />
      ) : (
        <React.Fragment>
          <button className="fullButton" onClick={handleLocClick}>LOCATION LIST</button>
          <LocationDetails initialState={selectedLocation} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default Locations;
