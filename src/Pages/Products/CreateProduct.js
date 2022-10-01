import React, { useState } from "react";

import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { createProduct } from "../../restAPIs";
import { motion } from "framer-motion";
import ProductDetails from "./ProductDetails";
import NewList from "./NewList";
import { isTargetNameAssociation } from "@aws-amplify/datastore";


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
        errors.prodNick = "ID is required.";
      }

      if (!data.prodName) {
        errors.prodName = "Product Name is required.";
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

  const labels = [
    {
      name: "product",
      label: "Product",
    },
    {
      name: "location",
      label: "Location",
    },
    {
      name: "customer",
      label: "Customer",
    },
  ];

  const handleChange = (e) => {
    if (e.target.value==="gggg"){
      console.log('gggg')
    }
    formik.handleChange(e)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <form onSubmit={formik.handleSubmit} className="p-fluid">
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
            autoCorrect="off"
            value={formik.values.prodNick}
            onChange={e =>handleChange(e)}
            className={classNames({
              "p-invalid": isFormFieldValid("prodNick"),
            })}
          />

          {getFormErrorMessage("prodNick")}
        </div>
        <div className="field">
          <label
            htmlFor="prodName"
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
    </motion.div>
  );
}

export default CreateProduct;
