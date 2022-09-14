import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";


import "./Splash.css";

import { CenteredContainer, Title } from "../CommonStyles";
import { useSettingsStore } from "../Contexts/SettingsZustand";

export const UserApplyForm = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});

  const setFormType = useSettingsStore((state) => state.setFormType)

  const validate = (data) => {
    let errors = {};

    if (!data.name) {
      errors.name = "Name is required.";
    }
    if (!data.location) {
      errors.location = "Name is required.";
    }
    if (!data.email) {
      errors.email = "Email is required.";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
      errors.email = "Invalid email address. E.g. example@email.com";
    }
    if (!data.accept) {
      errors.accept = "You need to agree to the terms and conditions.";
    }

    return errors;
  };

  const onSubmit = (data, form) => {
    setFormType("Thankyou")
    // Add info to DynamoDB (name, email, location)
    // Show message for submittal
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );

  const backToSignIn = () => {
    setFormType("onNoUser")
  }
  

  return (
    <CenteredContainer>
      <div className="form-demo">
        <Dialog
          visible={showMessage}
          onHide={() => setShowMessage(false)}
          position="top"
          footer={dialogFooter}
          showHeader={false}
          breakpoints={{ "960px": "80vw" }}
          style={{ width: "30vw" }}
        >
          <div className="flex align-items-center flex-column pt-6 px-3">
            <i
              className="pi pi-check-circle"
              style={{ fontSize: "5rem", color: "var(--green-500)" }}
            ></i>
            <h5>Registration Successful!</h5>
            <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
             Thankyou for applying.  We will review your application and contact you by email within the next few days with instructions on how to proceed.
            </p>
          </div>
        </Dialog>

        <div className="flex justify-content-center">
          <div className="card">
            <Title>Apply for Wholesale Account</Title>
            <Button
                className="p-button-text"
                onClick={backToSignIn}
              >
                GO BACK TO SIGN IN
              </Button>
            <Form
              onSubmit={onSubmit}
              initialValues={{
                name: "",
                email: "",
                location: "",
                accept: false,
              }}
              validate={validate}
              render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit} className="p-fluid">
                  <Field
                    name="name"
                    render={({ input, meta }) => (
                      <div className="field">
                        <span className="p-float-label">
                          <InputText
                            id="name"
                            {...input}
                            autoFocus
                            className={classNames({
                              "p-invalid": isFormFieldValid(meta),
                            })}
                          />
                          <label
                            htmlFor="name"
                            className={classNames({
                              "p-error": isFormFieldValid(meta),
                            })}
                          >
                            Name*
                          </label>
                        </span>
                        {getFormErrorMessage(meta)}
                      </div>
                    )}
                  />
                  <Field
                    name="email"
                    render={({ input, meta }) => (
                      <div className="field">
                        <span className="p-float-label p-input-icon-right">
                          <i className="pi pi-envelope" />
                          <InputText
                            id="email"
                            {...input}
                            className={classNames({
                              "p-invalid": isFormFieldValid(meta),
                            })}
                          />
                          <label
                            htmlFor="email"
                            className={classNames({
                              "p-error": isFormFieldValid(meta),
                            })}
                          >
                            Email*
                          </label>
                        </span>
                        {getFormErrorMessage(meta)}
                      </div>
                    )}
                  />
                  <Field
                    name="location"
                    render={({ input, meta }) => (
                      <div className="location">
                        <span className="p-float-label">
                          <InputText
                            id="location"
                            {...input}
                            autoFocus
                            className={classNames({
                              "p-invalid": isFormFieldValid(meta),
                            })}
                          />
                          <label
                            htmlFor="location"
                            className={classNames({
                              "p-error": isFormFieldValid(meta),
                            })}
                          >
                            Name of Location*
                          </label>
                        </span>
                        {getFormErrorMessage(meta)}
                      </div>
                    )}
                  />
                  
                  <Field
                    name="accept"
                    type="checkbox"
                    render={({ input, meta }) => (
                      <div className="field-checkbox">
                        <Checkbox
                          inputId="accept"
                          {...input}
                          className={classNames({
                            "p-invalid": isFormFieldValid(meta),
                          })}
                        />
                        <label
                          htmlFor="accept"
                          className={classNames({
                            "p-error": isFormFieldValid(meta),
                          })}
                        >
                          I agree to the terms and conditions*
                        </label>
                      </div>
                    )}
                  />

                  <Button type="submit" label="Submit" className="mt-2" />
                </form>
              )}
            />
          </div>
        </div>
      </div>
    </CenteredContainer>
  );
};
