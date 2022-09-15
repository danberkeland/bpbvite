import React, { useState } from "react";

import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { deleteProduct, updateProduct } from "../../restAPIs";
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag

function ProductDetails({ selectedProduct }) {
  const [edit, setEdit] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});

  const editButtonStyle = {
    width: "100px",
    margin: "20px",
    fontSize: "1.2em",
    backgroundColor: "#006aff",
  };
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
      console.log("data",data)
      data.prodNick = selectedProduct.prodNick
      data.prodName = selectedProduct.prodName
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

  const handleEdit = () => {
    setEdit(!edit);
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
    <React.Fragment>
      {/*<pre>Selected Product: {JSON.stringify(selectedProduct, null, 4)}</pre>*/}

      {!edit ? (
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
      ) : (
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
              type={"number"}
              minFractionDigits={2}
              maxFractionDigits={2}
              value={formik.values.wholePrice}
              onClick={(values) => {
                console.log("values",values.target.value)
                formik.setFieldValue('wholePrice', values.target.value);
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
              type="number"
              value={formik.values.packSize}
              onClick={(values) => {
                console.log("values",values.target.value)
                formik.setFieldValue('packSize', values.target.value);
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
      )}

      <div className="bottomSpace"></div>
    </React.Fragment>
  );
}

export default ProductDetails;
