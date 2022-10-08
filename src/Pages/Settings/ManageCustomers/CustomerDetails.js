import React, { useEffect, useState } from "react";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";

import { motion } from "framer-motion";
import CreateCustomer from "./EditCustomer";
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

function CustomerDetails({ selectedCustomer }) {
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    window.scrollTo(0,0)
  },[])

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

        <InputText id={id} value={selectedCustomer[id]} disabled />
      </InfoBox>
    );
  }

  function YesNoBlock({ id, title }) {
    return (
      <YesNoBox>
        <label htmlFor={id}>{title}</label>
        <SelectButton value={selectedCustomer[id]} id={id} options={options} disabled/>
      </YesNoBox>
    );
  }

  const handleEdit = () => {
    setEdit(!edit);
  };

  return (
    <React.Fragment>
      

      {!edit ? (
        <motion.div
          initial={{ opacity: 0, x: "0", y: "0" }}
          animate={{ opacity: 1, x: "0", y:"0" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          exit={{ opacity: 0, x: "0"}}
        >
          <div className="productDetails">
            <h1>{selectedCustomer.custName}</h1>
            
            <GroupBox>
              <h2>
                <i className="pi pi-user"></i> Product Description
              </h2>
              <InfoBlock id="custName" title="Customer Name" />
              <InfoBlock id="authType" title="Auth Type" />
            </GroupBox>
           
           

            <Button
              label="Edit"
              className="editButton p-button-raised p-button-rounded"
              style={editButtonStyle}
              onClick={handleEdit}
            />
          </div>
        </motion.div>
      ) : (
        <CreateCustomer initialState={selectedCustomer} />
      )}

      <div className="bottomSpace"></div>
    </React.Fragment>
  );
}

export default CustomerDetails;
