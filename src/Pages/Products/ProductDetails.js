import React, { useState } from "react";

import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { classNames } from 'primereact/utils';

function ProductDetails({ selectedProduct }) {
  const [edit, setEdit] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});

  const buttonStyle = { width: "80px", margin: "20px", fontSize: "1.2em" };

  const formik = useFormik({
    initialValues: {
      wholePrice: selectedProduct.wholePrice,
      packSize: selectedProduct.packSize
    },
    validate: (data) => {
      let errors = {};

      if (!data.wholePrice) {
        errors.wholePrice = "Name is required.";
      }

      return errors;
    },
    onSubmit: (data) => {
      setFormData(data);
      setShowMessage(true);

      formik.resetForm();
    },
  });

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

  const handleEdit = () => {
    setEdit(!edit);
  };

  const handleSubmit = () => {
    setEdit(!edit);
  };

  return (
    <React.Fragment>
      {/*<pre>Selected Product: {JSON.stringify(selectedProduct, null, 4)}</pre>*/}

      {!edit ? (
        <div className="productDetails">
          <h1>{selectedProduct.prodName}</h1>
          <Button
            label="Edit"
            className="p-button-raised p-button-rounded"
            style={buttonStyle}
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
          <Button
            label="Submit"
            className="submitButton p-button-raised p-button-rounded"
            style={buttonStyle}
            onClick={handleSubmit}
          />
          <div className="field">
            <span className="p-float-label">
              <InputText
                id="wholePrice"
                name="wholePrice"
                value={formik.values.wholePrice}
                onChange={formik.handleChange}
                className={classNames({
                  "p-invalid": isFormFieldValid("wholePrice"),
                })}
              />
              <label
                htmlFor="wholePrice"
                className={classNames({
                  "p-error": isFormFieldValid("wholePrice"),
                })}
              >
                WholePrice
              </label>
            </span>
            {getFormErrorMessage("wholePrice")}
          </div>
          <div className="field">
            <span className="p-float-label">
              <InputText
                id="packSize"
                name="packSize"
                value={formik.values.packSize}
                onChange={formik.handleChange}
                className={classNames({
                  "p-invalid": isFormFieldValid("packSize"),
                })}
              />
              <label
                htmlFor="packSize"
                className={classNames({
                  "p-error": isFormFieldValid("packSize"),
                })}
              >
                packSize
              </label>
            </span>
            {getFormErrorMessage("packSize")}
          </div>
          <div className="greyBar"></div>
          <button >+ DELETE PRODUCT</button>
        </form>
      )}

      <div className="bottomSpace"></div>
    </React.Fragment>
  );
}

export default ProductDetails;
