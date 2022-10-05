import React, { useState } from "react";

import { Button } from "primereact/button";

import { motion } from "framer-motion";
import CreateProduct from "./EditProduct";

function ProductDetails({ selectedProduct }) {
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
          initial={{ opacity: 1, x: "100%", y: "0" }}
          animate={{ opacity: 1, x: "0%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          exit={{ opacity: 0, x: "100%" }}
        >
          <div className="productDetails">
            <h1>{selectedProduct.prodName}</h1>
            <Button
              label="Edit"
              className="editButton p-button-raised p-button-rounded"
              style={editButtonStyle}
              onClick={handleEdit}
            />
            <h2>ID: {selectedProduct.prodNick}</h2>
            <h3>Wholesale Price: {selectedProduct.wholePrice}</h3>
            <h3>Pack Size: {selectedProduct.packSize}</h3>
          </div>
        </motion.div>
      ) : (
        <CreateProduct initialState={selectedProduct} />
      )}

      <div className="bottomSpace"></div>
    </React.Fragment>
  );
}

export default ProductDetails;
