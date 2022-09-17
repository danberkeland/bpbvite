import React, { useState } from "react";

import { Button } from "primereact/button";
import { motion } from "framer-motion";

import UpdateLocationForm from "./UpdateLocationForm";

function LocationDetails({ selectedLocation }) {
  const [edit, setEdit] = useState(false);

  const editButtonStyle = {
    width: "100px",
    margin: "20px",
    fontSize: "1.2em",
    backgroundColor: "#006aff",
  };

  const handleEdit = () => {
    setEdit(!edit);
  };

  return (
    <React.Fragment>
      {/*<pre>Selected Product: {JSON.stringify(selectedProduct, null, 4)}</pre>*/}

      {!edit ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="productDetails">
            <h1>{selectedLocation.locName}</h1>
            <Button
              label="Edit"
              className="editButton p-button-raised p-button-rounded"
              style={editButtonStyle}
              onClick={handleEdit}
            />
            <h2>ID: {selectedLocation.locNick}</h2>
            <h3>City: {selectedLocation.city}</h3>
            <h3>Email: {selectedLocation.email}</h3>
          </div>
        </motion.div>
      ) : (
        <UpdateLocationForm selectedLocation={selectedLocation} />
      )}
      <div className="bottomSpace"></div>
    </React.Fragment>
  );
}

export default LocationDetails;
