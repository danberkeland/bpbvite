import React, { useState } from "react";

import { Button } from "primereact/button";
import { Form, Formik, useFormik } from "formik";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { createProduct } from "../../restAPIs";
import { motion } from "framer-motion";
import ProductDetails from "./ProductDetails";
import CustomTextInput from "./CustomTextInput";
import { validationSchema } from "./ValidationSchema";

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

  const handleChange = (e) => {
    if (e.target.value === "gggg") {
      console.log("gggg");
    }
    formik.handleChange(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Formik
        initialValues={{
          prodNick: "",
          prodName: "",
          wholePrice: 0,
          packSize: 0,
        }}
        validationSchema={validationSchema}
      >
        {(props) => (
          <Form>
            <CustomTextInput
              label="Product ID"
              name="prodNick"
              type="text"
              placeholder="Enter product ID"
            />
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}

export default CreateProduct;
