import React, { useEffect } from "react";

import { Form, Formik } from "formik";

import { Button } from "primereact/button";

import { motion } from "framer-motion";
import {
  CustomIDInput,
  CustomInput,
  CustomFloatInput,
  CustomIntInput,
  CustomYesNoInput,
} from "../../FormComponents/CustomIDInput";
import { validationSchema } from "./ValidationSchema";

import styled from "styled-components";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { updateProduct } from "../../restAPIs";

const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  border: 1px solid lightgrey;
  width: 95%;
  margin: 5px 10px 20px 10px;
  padding: 5px 5px 10px 5px;
`;

function ProductDetails({ initialState, create }) {
  const setIsEdit = useSettingsStore((state) => state.setIsEdit);
  const isEdit = useSettingsStore((state) => state.isEdit);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const editButtonStyle = {
    width: "100px",
    margin: "20px",
    fontSize: "1.2em",
  };

  const handleEdit = (e, props) => {
    console.log("values", props.values);
    window.scrollTo(0, 0);
    setIsEdit(!isEdit);
  };

  const handleSubmit = (e, props) => {
    console.log("values", props.values);
    window.scrollTo(0, 0);
    updateProduct(props.values).then(() => {
      window.location = "/Products";})
    setIsEdit(!isEdit);
  };

  return (
    <div>
      <Formik initialValues={initialState} validationSchema={validationSchema}>
        {(props) => (
          <React.Fragment>
            {isEdit && (
              <div className="floatButtonsTop">
                <Button
                  label="Submit"
                  className="p-button-raised p-button-rounded p-button-danger"
                  style={editButtonStyle}
                  onClick={(e) => handleSubmit(e, props)}
                />
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, x: "0", y: "0" }}
              animate={{ opacity: 1, x: "0" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              exit={{ opacity: 0, x: "0" }}
            >
              <Form>
                <GroupBox>
                  <h2>
                    <i className="pi pi-user"></i> Product Description
                  </h2>
                  <CustomIDInput
                    label="Product ID"
                    name="prodNick"
                    type="text"
                    placeholder="Enter product id"
                  />
                  <CustomInput
                    label="Product Name"
                    name="prodName"
                    type="text"
                    placeholder="Enter product name"
                  />
                  <CustomInput
                    label="Square ID"
                    name="squareID"
                    type="text"
                    placeholder="Enter square ID"
                  />
                  <CustomInput
                    label="QB ID"
                    name="qbID"
                    type="text"
                    placeholder="Enter QB ID"
                  />
                </GroupBox>
                <GroupBox>
                  <h2>
                    <i className="pi pi-dollar"></i> Billing
                  </h2>
                  <CustomFloatInput
                    label="Wholesale Price"
                    name="wholePrice"
                    type="tel"
                    placeholder="Enter Wholesale Price"
                    converter={props}
                  />
                  <CustomFloatInput
                    label="Retail Price"
                    name="retailPrice"
                    type="tel"
                    placeholder="Enter Retail Price"
                    converter={props}
                  />
                  <CustomYesNoInput
                    label="Default Include"
                    name="defaultInclude"
                    converter={props}
                  />
                </GroupBox>

                <GroupBox>
                  <CustomInput
                    label="Pack Group"
                    name="packGroup"
                    type="text"
                    placeholder="Enter Pack Group"
                  />
                  <CustomIntInput
                    label="Pack Group Order"
                    name="packGroupOrder"
                    type="tel"
                    placeholder="Enter Pack Group Order"
                    converter={props}
                  />
                  <CustomIntInput
                    label="Pack Size"
                    name="packSize"
                    type="tel"
                    placeholder="Enter Pack Size"
                    converter={props}
                  />
                  <CustomYesNoInput
                    label="Freezer Thaw"
                    name="freezerThaw"
                    converter={props}
                  />
                </GroupBox>
                <GroupBox>
                  <h2>
                    <i className="pi pi-dollar"></i> Baking Info
                  </h2>
                  <CustomInput
                    label="Dough Type"
                    name="doughNick"
                    type="text"
                    placeholder="Enter Dough Type"
                  />
                  <CustomIntInput
                    label="Lead Time"
                    name="leadTime"
                    type="tel"
                    placeholder="Enter Lead Time"
                    converter={props}
                  />
                  <CustomInput
                    label="For Bake"
                    name="forBake"
                    type="text"
                    placeholder="Enter Bake Name"
                  />
                  <CustomIntInput
                    label="Ready Time"
                    name="readyTime"
                    type="tel"
                    placeholder="Enter Ready Time"
                    converter={props}
                  />
                  <CustomIntInput
                    label="Batch Size"
                    name="batchSize"
                    type="tel"
                    placeholder="Enter Batch Size"
                    converter={props}
                  />
                  <CustomIntInput
                    label="Batch Extra"
                    name="batchExtra"
                    type="tel"
                    placeholder="Enter Batch Extra"
                    converter={props}
                  />
                  <CustomFloatInput
                    label="Weight"
                    name="weight"
                    type="tel"
                    placeholder="Enter Pocket Weight"
                    converter={props}
                  />
                </GroupBox>

                {!isEdit && (
                  <Button
                    label="Edit"
                    className="editButton p-button-raised p-button-rounded p-button-success"
                    style={editButtonStyle}
                    onClick={(e) => handleEdit(e, props)}
                  />
                )}
              </Form>
            </motion.div>
          </React.Fragment>
        )}
      </Formik>
      <div className="bottomSpace"></div>
    </div>
  );
}

export default ProductDetails;
