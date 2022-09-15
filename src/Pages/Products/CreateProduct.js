import React, { useState } from "react";

import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { createProduct } from "../../restAPIs";

function CreateProduct({ edit, setEdit }) {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});

  const submitButtonStyle = {
    width: "100px",
    margin: "20px",
    fontSize: "1.2em",
    backgroundColor: "red",
  };

  const formik = useFormik({
    initialValues: {
      prodNick: "",
      prodName: "",
      wholePrice: 0,
      packSize: 0,
    },
    validate: (data) => {
      let errors = {};

      if (!data.prodNick) {
        errors.wholePrice = "ID is required.";
      }

      if (!data.prodName) {
        errors.wholePrice = "Product Name is required.";
      }

      return errors;
    },
    onSubmit: (data) => {
      console.log("data", data);
      createProduct(data).then(() => {
        window.location = "/Products";
      });

      setFormData(data);
      setShowMessage(true);

      formik.resetForm();
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

  return (
    <form onSubmit={formik.handleSubmit} className="p-fluid">
      <div className="submitButton">
        <Button
          label="Submit"
          className="p-button-raised p-button-rounded"
          style={submitButtonStyle}
        />
      </div>
      <div className="field">
        <label
          htmlFor="prodNick"
          className={classNames({
            "p-error": isFormFieldValid("prodNick"),
          })}
        >
          Product ID
        </label>
        <InputText
          id="prodNick"
          name="prodNick"
          value={formik.values.prodNick}
          onChange={formik.handleChange}
          className={classNames({
            "p-invalid": isFormFieldValid("prodNick"),
          })}
        />

        {getFormErrorMessage("prodNick")}
      </div>
      <div className="field">
        <label
          htmlFor="proddName"
          className={classNames({
            "p-error": isFormFieldValid("prodName"),
          })}
        >
          Product Name
        </label>
        <InputText
          id="prodName"
          name="prodName"
          value={formik.values.prodName}
          onChange={formik.handleChange}
          className={classNames({
            "p-invalid": isFormFieldValid("prodName"),
          })}
        />

        {getFormErrorMessage("prodName")}
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
    </form>
  );
}

export default CreateProduct;
