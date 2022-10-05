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
          <LocationDetails selectedLocation={selectedLocation} />
        </motion.div>
      ) : (
        <div></div>
      )}
      {selectedLocation === "" ? (
        <LocationList
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      ) : (
        <div></div>
      )}
    </motion.div>
  );
}

export default Locations;
