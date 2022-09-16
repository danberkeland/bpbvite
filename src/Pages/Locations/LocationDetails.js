import React, { useState } from "react";

import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { deleteLocation, updateLocation } from "../../restAPIs";
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag

function LocationDetails({ selectedLocation }) {
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
      city: selectedLocation.city,
      email: selectedLocation.email,
    },
    validate: (data) => {
      let errors = {};

      if (!data.city) {
        errors.city = "City is required.";
      }

      return errors;
    },
    onSubmit: async (data) => {
      console.log("data",data)
      data.locNick = selectedLocation.locNick
      data.locName = selectedLocation.locName
      updateLocation(data).then(() => {
        window.location = "/Locations";
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
        `Are you sure you want to delete ` + selectedLocation.locName + "?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        deleteLocation({ locNick: selectedLocation.locNick })
        .then(() => {
          window.location = "/Locations";
        });
      },
    });
  };


  return (
    <React.Fragment>
      {/*<pre>Selected Product: {JSON.stringify(selectedProduct, null, 4)}</pre>*/}

      {!edit ? (
        <div className="productDetails">
          <h1>{selectedLocation.locName}</h1>
          <Button
            label="Edit"
            className="editButton p-button-raised p-button-rounded"
            style={editButtonStyle}
            onClick={handleEdit}
          />
          <h2>ID: {selectedLocation.locNick}</h2>
          <h3>City: {selectedLocation.city}</h3>
          <h3>Email: {selectedLocation.email}</h3>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <h1>{selectedLocation.locName}</h1>
          <h2>ID: {selectedLocation.locNick}</h2>
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
              onChange={(values) => {
               
                formik.setFieldValue('city', values.value);
            }}
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
              onChange={(values) => {
               
                formik.setFieldValue('email', values.value);
            }}
              
              className={classNames({
                "p-invalid": isFormFieldValid("email"),
              })}
            />

            {getFormErrorMessage("email")}
          </div>
          <div className="greyBar"></div>
          <button type="button" onClick={confirmDelete}>
            + DELETE LOCATION
          </button>
          <ConfirmDialog />
        </form>
      )}

      <div className="bottomSpace"></div>
    </React.Fragment>
  );
}

export default LocationDetails;
