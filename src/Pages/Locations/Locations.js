import React, { useState } from "react";

import LocationList from "./LocationList";
import LocationDetails from "./LocationDetails";
import { motion } from "framer-motion";

function Locations() {
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleLocClick = () => {
    setSelectedLocation("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y:0 }}
      exit={{ opacity: 0 }}
    >
      {selectedLocation !== "" ? (
        <React.Fragment>
          <button onClick={handleLocClick}>LOCATION LIST</button>
          <LocationDetails initialState={selectedLocation} create={false}/>
        </React.Fragment>
      ) : (
        <div></div>
      )}
      {selectedLocation === "" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y:0 }}
          exit={{ opacity: 0 }}
        >
          <LocationList
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </motion.div>
      ) : (
        <div></div>
      )}
    </motion.div>
  );
}

export default Locations;
