import React, { useEffect } from "react";

import { Form, Formik } from "formik";

import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method // To use confirmDialog method

import { motion } from "framer-motion";
import { CustomIDInput, CustomTextInput } from "../../FormComponents/CustomInputs";
import { validationSchema } from "./ValidationSchema";

import styled from "styled-components";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { deleteProduct, updateProduct } from "../../restAPIs";
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

  const handleDelete = (e, props) => {
    confirmDialog({
      message: "Are you sure you want to delete this product?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        console.log("values", props);
        window.scrollTo(0, 0);
        setIsEdit(false);
        setIsCreate(false);
        deleteProduct(props).then(() => {
          window.location = "/Products";
        });
      },
      reject: () => {
        return;
      },
    });
  };

  return (
    <div>
      <ConfirmDialog />
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
              {isEdit | isCreate ? (
                <div className="floatButtonsTop">
                  <Button
                    label="Submit"
                    type="submit"
                    className="p-button-raised p-button-rounded p-button-danger"
                    style={editButtonStyle}
                  />
                </div>
              ) : (
                <div></div>
              )}
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
                    dontEdit={true}
                    converter={props}
                   
                  />
                  <CustomTextInput
                    label="Product Name"
                    name="prodName"
                    converter={props}
                  
                  />
                </GroupBox>

                {!isEdit && !isCreate && (
                  <Button
                    label="Edit"
                    className="editButton p-button-raised p-button-rounded p-button-success"
                    style={editButtonStyle}
                    onClick={(e) => handleEdit(e, props)}
                  />
                )}
              </motion.div>
            </Form>
            <Button
              label="Delete"
              type="delete"
              className="editButton p-button-raised p-button-rounded p-button-success"
              style={editButtonStyle}
              onClick={(e) => handleDelete(e, props)}
            />
          </React.Fragment>
        )}
      </Formik>
      <div className="bottomSpace"></div>
    </div>
  );
}

export default ProductDetails;
