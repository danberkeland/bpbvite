import React, { useState } from "react";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";

import { motion } from "framer-motion";
import CreateProduct from "./EditProduct";
import styled from "styled-components";

const options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const YesNoBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 5px;
`;

function ProductDetails({ selectedProduct }) {
  const [edit, setEdit] = useState(false);

  const editButtonStyle = {
    width: "100px",
    margin: "20px",
    fontSize: "1.2em",
    backgroundColor: "#006aff",
  };

  function InfoBlock({ id, title }) {
    return (
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor={id}> {title}</label>
          <br />
        </span>

        <InputText id={id} value={selectedProduct[id]} disabled />
      </div>
    );
  }

  function YesNoBlock({ id, title }) {
    return (
      <YesNoBox>
        <label htmlFor={id}>{title}</label>
        <SelectButton value={selectedProduct[id]} id={id} options={options} />
      </YesNoBox>
    );
  }

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

            <InfoBlock id="prodNick" title="Product ID" />
            <InfoBlock id="wholePrice" title="Whole Price" />
            <InfoBlock id="retailPrice" title="Retail Price" />
            <InfoBlock id="packSize" title="Pack Size" />
            <InfoBlock id="packGroup" title="Pack Group" />
            <InfoBlock id="packGroupOrder" title="Pack Order" />
            <InfoBlock id="readyTime" title="Ready Time" />
            <InfoBlock id="doughNick" title="dough" />
            <InfoBlock id="weight" title="Weight" />
            <InfoBlock id="leadTime" title="Lead Time" />
            <InfoBlock id="batchSize" title="Batch Size" />
            <InfoBlock id="batchExtra" title="Batch Extra" />
            <InfoBlock id="forBake" title="For Bake" />
            <InfoBlock id="squareID" title="Square ID" />
            <InfoBlock id="qbID" title="QB ID" />
            <YesNoBlock id="freezerThaw" title="Freezer Thaw" />
            <YesNoBlock id="defaultInclude" title="Default Include" />
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
