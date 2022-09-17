import React from "react";

import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { deleteProduct, updateProduct } from "../../restAPIs";
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { motion } from "framer-motion";

function UpdateProductForm({ selectedProduct }) {
 

  const submitButtonStyle = {
    width: "100px",
    margin: "20px",
    fontSize: "1.2em",
    backgroundColor: "red",
  };

  const formik = useFormik({
    initialValues: {
      wholePrice: selectedProduct.wholePrice,
      packSize: selectedProduct.packSize,
    },
    validate: (data) => {
      let errors = {};

      if (!data.wholePrice) {
        errors.wholePrice = "Name is required.";
      }

      return errors;
    },
    onSubmit: async (data) => {
      console.log("data", data);
      data.prodNick = selectedProduct.prodNick;
      data.prodName = selectedProduct.prodName;
      updateProduct(data).then(() => {
        window.location = "/Products";
      });
    },
  });

  const isFormFieldValid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name]}</small>
      )
    );
  };


  const confirmDelete = async () => {
    confirmDialog({
      message:
        `Are you sure you want to delete ` + selectedProduct.prodName + "?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        deleteProduct({ prodNick: selectedProduct.prodNick }).then(() => {
          window.location = "/Products";
        });
      },
    });
  };

  return (
    
    
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <form onSubmit={formik.handleSubmit} className="p-fluid">
            <h1>{selectedProduct.prodName}</h1>
            <h2>ID: {selectedProduct.prodNick}</h2>
            <div className="submitButton">
              <Button
                label="Submit"
                type="submit"
                className="p-button-raised p-button-rounded"
                style={submitButtonStyle}
              />
            </div>

            <div className="field">
              <label
                htmlFor="wholePrice"
                className={classNames({
                  "p-error": isFormFieldValid("wholePrice"),
                })}
              >
                WholePrice
              </label>
              <InputNumber
                id="wholePrice"
                name="wholePrice"
                mode="decimal"
                minFractionDigits={2}
                maxFractionDigits={2}
                value={Number(formik.values.wholePrice)}
                onChange={(values) => {
                  formik.setFieldValue("wholePrice", values.value);
                }}
                className={classNames({
                  "p-invalid": isFormFieldValid("wholePrice"),
                })}
              />

              {getFormErrorMessage("wholePrice")}
            </div>
            <div className="field">
              <label
                htmlFor="packSize"
                className={classNames({
                  "p-error": isFormFieldValid("packSize"),
                })}
              >
                packSize
              </label>
              <InputNumber
                id="packSize"
                name="packSize"
                value={Number(formik.values.packSize)}
                onChange={(values) => {
                  formik.setFieldValue("packSize", values.value);
                }}
                className={classNames({
                  "p-invalid": isFormFieldValid("packSize"),
                })}
              />

              {getFormErrorMessage("packSize")}
            </div>
            <div className="greyBar"></div>
            <button type="button" onClick={confirmDelete}>
              + DELETE PRODUCT
            </button>
            <ConfirmDialog />
          </form>
        </motion.div>
      
  );
}

export default UpdateProductForm;
