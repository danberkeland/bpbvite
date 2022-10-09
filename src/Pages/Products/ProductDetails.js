import React, { useEffect, useState } from "react";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { SelectButton } from "primereact/selectbutton";

import { motion } from "framer-motion";
import styled from "styled-components";

const options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

// Styles
const YesNoBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 5px;
`;

const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  border: 1px solid lightgrey;
  width: 95%;
  margin: 5px 10px 20px 10px;
  padding: 5px 5px 10px 5px;
`;

const InfoBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  flex-direction: column;
  align-content: flex-start;

  margin: 5px 15px;
`;

function ProductDetails({ selectedProduct }) {
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const editButtonStyle = {
    width: "100px",
    margin: "20px",
    fontSize: "1.2em",
    backgroundColor: "#006aff",
  };

  function InfoBlock({ id, title }) {
    return (
      <InfoBox>
        <span className="p-inputgroup-addon">
          <label htmlFor={id}>{title}</label>
        </span>

        <InputText
          id={id}
          value={selectedProduct[id] ? selectedProduct[id] : ""}
          disabled={!edit}
        />
      </InfoBox>
    );
  }

  function IntBlock({ id, title }) {
    return (
      <InfoBox>
        <span className="p-inputgroup-addon">
          <label htmlFor={id}>{title}</label>
        </span>

        <InputNumber
          id={id}
          value={selectedProduct[id] ? selectedProduct[id] : 0}
          disabled={!edit}
        />
      </InfoBox>
    );
  }

  function FloatBlock({ id, title }) {
    return (
      <InfoBox>
        <span className="p-inputgroup-addon">
          <label htmlFor={id}>{title}</label>
        </span>

        <InputNumber
          id={id}
          value={selectedProduct[id] ? selectedProduct[id] : 0}
          disabled={!edit}
        />
      </InfoBox>
    );
  }

  function YesNoBlock({ id, title }) {
    return (
      <YesNoBox>
        <label htmlFor={id}>{title}</label>
        <SelectButton
          value={selectedProduct[id] ? selectedProduct[id] : ""}
          id={id}
          options={options}
          disabled={!edit}
        />
      </YesNoBox>
    );
  }

  const handleEdit = () => {
    setEdit(!edit);
  };

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, x: "0", y: "0" }}
        animate={{ opacity: 1, x: "0", y: "0" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        exit={{ opacity: 0, x: "0" }}
      >
        <div className="productDetails">
          <h1>{selectedProduct.prodName}</h1>

          <GroupBox>
            <h2>
              <i className="pi pi-user"></i> Product Description
            </h2>
            <InfoBlock id="prodName" title="Product Name" />
            <InfoBlock id="prodNick" title="Product ID" />
            <InfoBlock id="squareID" title="Square ID" />
            <InfoBlock id="qbID" title="QB ID" />
          </GroupBox>
          <GroupBox>
            <h2>
              <i className="pi pi-dollar"></i> Billing
            </h2>
            <FloatBlock id="wholePrice" title="Whole Price" />
            <FloatBlock id="retailPrice" title="Retail Price" />
            <YesNoBlock id="defaultInclude" title="Default Include" />
          </GroupBox>
          <GroupBox>
            <h2>
              <i className="pi pi-dollar"></i> Packing Info
            </h2>
            <InfoBlock id="packGroup" title="Pack Group" />
            <IntBlock id="packGroupOrder" title="Pack Order" />
            <IntBlock id="packSize" title="Pack Size" />
            <YesNoBlock id="freezerThaw" title="Freezer Thaw" />
          </GroupBox>

          <GroupBox>
            <h2>
              <i className="pi pi-dollar"></i> Baking Info
            </h2>

            <InfoBlock id="doughNick" title="Dough Type" />
            <IntBlock id="leadTime" title="Lead Time" />
            <InfoBlock id="forBake" title="For Bake" />
            <FloatBlock id="readyTime" title="Ready Time" />
            <IntBlock id="batchSize" title="Batch Size" />
            <IntBlock id="batchExtra" title="Batch Extra" />
            <FloatBlock id="weight" title="Weight" />
          </GroupBox>
          <Button
            label="Edit"
            className="editButton p-button-raised p-button-rounded"
            style={editButtonStyle}
            onClick={handleEdit}
          />
        </div>
      </motion.div>

      <div className="bottomSpace"></div>
    </React.Fragment>
  );
}

export default ProductDetails;
