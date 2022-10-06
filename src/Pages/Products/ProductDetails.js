import React, { useState } from "react";

import { Button } from "primereact/button";

import { motion } from "framer-motion";
import CreateProduct from "./EditProduct";
import styled from "styled-components";

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  margin: 2px;
  padding: 10px 10px;
  align-items: center;
  justify-items: left;
`;

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
          animate={{ opacity: 1, x: "0" }}
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
            <InfoGrid>
              <label>Product ID:</label>
              <h2>{selectedProduct.prodNick}</h2>
              <label>Whole Price:</label>
              <h3>{selectedProduct.wholePrice}</h3>
              <label>Retail Price:</label>
              <h3>{selectedProduct.retailPrice}</h3>
              <label>Pack Size:</label>
              <h3>{selectedProduct.packSize}</h3>
              <label>Pack Group:</label>
              <h3>{selectedProduct.packGroup}</h3>
              <label>Pack Order:</label>
              <h3>{selectedProduct.packGroupOrder}</h3>
              <label>Thaw:</label>
              <h3>{selectedProduct.freezerThaw ? "YES" : "NO"}</h3>
              <label>Ready Time:</label>
              <h3>{selectedProduct.readyTime}</h3>
              <label>Dough:</label>
              <h3>{selectedProduct.doughNick}</h3>
              <label>Weight:</label>
              <h3>{selectedProduct.weight}</h3>
              <label>Lead Time:</label>
              <h3>{selectedProduct.leadTime}</h3>
              <label>Batch Size:</label>
              <h3>{selectedProduct.batchSize}</h3>
              <label>Bake Extra:</label>
              <h3>{selectedProduct.backExtra}</h3>
              <label>Baker Name:</label>
              <h3>{selectedProduct.forBake}</h3>
              <label>Square ID:</label>
              <h3>{selectedProduct.squareID}</h3>
              <label>QB ID:</label>
              <h3>{selectedProduct.qbID}</h3>
              <label>Default Include:</label>
              <h3>{selectedProduct.defaultInclude ? "YES" : "NO"}</h3>
            </InfoGrid>
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
