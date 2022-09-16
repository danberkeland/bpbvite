import React, { useState } from "react";

import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { createLocation } from "../../restAPIs";

function CreateLocation({ edit, setEdit }) {
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
      locNick: "",
      locName: "",
      city: "",
      email: "",
    },
    validate: (data) => {
      let errors = {};

      if (!data.locNick) {
        errors.locNick = "ID is required.";
      }

      if (!data.locName) {
        errors.locName = "Location Name is required.";
      }

      return errors;
    },
    onSubmit: (data) => {
      console.log("data", data);
      createLocation(data)
      .then(() => {
      window.location = "/Locations";})
    

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
          type="submit"
          className="p-button-raised p-button-rounded"
          style={submitButtonStyle}
        />
      </div>
      <div className="field">
        <label
          htmlFor="locNick"
          className={classNames({
            "p-error": isFormFieldValid("locNick"),
          })}
        >
          Location ID
        </label>
        <InputText
          id="locNick"
          name="locNick"
          autoCorrect="off"
          value={formik.values.locNick}
          onChange={formik.handleChange}
          className={classNames({
            "p-invalid": isFormFieldValid("locNick"),
          })}
        />

        {getFormErrorMessage("locNick")}
      </div>
      <div className="field">
        <label
          htmlFor="locName"
          className={classNames({
            "p-error": isFormFieldValid("locName"),
          })}
        >
          Location Name
        </label>
        <InputText
          id="locName"
          name="locName"
          value={formik.values.locName}
          onChange={formik.handleChange}
          className={classNames({
            "p-invalid": isFormFieldValid("locName"),
          })}
        />

        {getFormErrorMessage("locName")}
      </div>

      <div className="field">
        <label
          htmlFor="city"
          className={classNames({
            "p-error": isFormFieldValid("city"),
          })}
        >
          City
        </label>
        <InputText
          id="city"
          name="city"
          
          value={formik.values.city}
          onChange={formik.handleChange}
          className={classNames({
            "p-invalid": isFormFieldValid("city"),
          })}
        />

        {getFormErrorMessage("city")}
      </div>
      <div className="field">
        <label
          htmlFor="email"
          className={classNames({
            "p-error": isFormFieldValid("email"),
          })}
        >
          Email
        </label>
        <InputText
          id="email"
          name="email"
      
          value={formik.values.email}
          onChange={formik.handleChange}
          className={classNames({
            "p-invalid": isFormFieldValid("email"),
          })}
        />

        {getFormErrorMessage("email")}
      </div>
      <div className="greyBar"></div>
    </form>
  );
}

export default CreateLocation;
