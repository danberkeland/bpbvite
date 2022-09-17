import React, { useState } from "react";

import { Button } from "primereact/button";

import { motion } from "framer-motion";
import UpdateProductForm from "./UpdateProductForm";

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
        <UpdateProductForm selectedProduct={selectedProduct} />
      )}

      <div className="bottomSpace"></div>
    </React.Fragment>
  );
}

export default ProductDetails;
