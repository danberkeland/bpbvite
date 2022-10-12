import React, { useState } from "react";

import LocationList from "./LocationList";
import LocationDetails from "./LocationDetails";
import { withFadeIn } from "../../utils";

function Locations() {
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleLocClick = () => {
    setSelectedLocation("");
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
      {selectedLocation !== "" ? (
        <React.Fragment>
          <button onClick={handleLocClick}>LOCATION LIST</button>
          <LocationDetails initialState={selectedLocation} create={false} />
        </React.Fragment>
      ) : (
        <div></div>
      )}
      {selectedLocation === "" ? <FadeLocationList /> : <div></div>}
    </React.Fragment>
  );
}

export default Locations;
