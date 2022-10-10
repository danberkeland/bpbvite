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
  CustomDropdownInput,
} from "../../FormComponents/CustomIDInput";
import { validationSchema } from "./ValidationSchema";

import styled from "styled-components";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { updateProduct } from "../../restAPIs";
import { createProduct } from "../../restAPIs";

const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  border: 1px solid lightgrey;
  width: 95%;
  margin: 5px 10px 20px 10px;
  padding: 5px 5px 10px 5px;
`;

function ProductDetails({ initialState, productList }) {
  const setIsEdit = useSettingsStore((state) => state.setIsEdit);
  const isEdit = useSettingsStore((state) => state.isEdit);
  const isCreate = useSettingsStore((state) => state.isCreate);
  const setIsCreate = useSettingsStore((state) => state.setIsCreate);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsEdit(false);
  }, [setIsEdit]);

  const editButtonStyle = {
    width: "100px",
    margin: "20px",
    fontSize: "1.2em",
  };

  const handleEdit = (e, props) => {
    console.log("values", props.values);
    window.scrollTo(0, 0);
    setIsEdit(true);
  };

  return (
    <div>
      <Formik
        initialValues={initialState}
        validationSchema={validationSchema(productList)}
        onSubmit={(props) => {
          console.log("values", props);
          window.scrollTo(0, 0);
          setIsEdit(false);
          setIsCreate(false);
          if (isCreate) {
            createProduct(props).then(() => {
              window.location = "/Products";
            });
          } else {
            updateProduct(props).then(() => {
              window.location = "/Products";
            });
          }
        }}
      >
        {(props) => (
          <React.Fragment>
            <Form>
              {(isEdit | isCreate) ? (
                <div className="floatButtonsTop">
                  <Button
                    label="Submit"
                    type="submit"
                    className="p-button-raised p-button-rounded p-button-danger"
                    style={editButtonStyle}
                  />
                </div>
              ): <div></div>}
              <motion.div
                initial={{ opacity: 0, x: "0", y: "0" }}
                animate={{ opacity: 1, x: "0" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                exit={{ opacity: 0, x: "0" }}
              >
                <GroupBox>
                  <h2>
                    <i className="pi pi-user"></i> Product Description
                  </h2>
                  <CustomIDInput
                    label="Product ID"
                    name="prodNick"
                    type="text"
                    placeholder="Enter product id"
                    converter={props}
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
                    label="Available Wholesale?"
                    name="isWhole"
                    converter={props}
                  />
                  <CustomYesNoInput
                    label="Default Include?"
                    name="defaultInclude"
                    converter={props}
                  />
                </GroupBox>

                <GroupBox>
                  <CustomDropdownInput
                    label="Pack Group"
                    name="packGroup"
                    type="text"
                    placeholder="Enter Pack Group"
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
                    label="Freezer Thaw?"
                    name="freezerThaw"
                    converter={props}
                  />
                  <CustomYesNoInput
                    label="Count EOD?"
                    name="isEOD"
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
                    placeholder="Name for Bakers"
                  />
                  <CustomIntInput
                    label="Guaranteed Ready (0-24)"
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
                    label="Bake Extra"
                    name="bakeExtra"
                    type="tel"
                    placeholder="Enter Bake Extra"
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

                {(!isEdit && !isCreate) && (
                  <Button
                    label="Edit"
                    className="editButton p-button-raised p-button-rounded p-button-success"
                    style={editButtonStyle}
                    onClick={(e) => handleEdit(e, props)}
                  />
                )}
              </motion.div>
            </Form>
          </React.Fragment>
        )}
      </Formik>
      <div className="bottomSpace"></div>
    </div>
  );
}

export default ProductDetails;
