import React, { useState } from "react";
import { Auth } from "aws-amplify";

import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { CenteredContainer, Title } from "../../CommonStyles";
import "./Splash.css";

import { useSettingsStore } from "../../Contexts/SettingsZustand";

const validate = (data) => {
  let errors = {};

  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
    errors.email = "Invalid email address. E.g. example@email.com";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  }

  return errors;
};

const isFormFieldValid = (meta) => !!(meta.touched && meta.error);

const getFormErrorMessage = (meta) => {
  return (
    isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
  );
};

export const Splash = () => {
  const [showMessage, setShowMessage] = useState(false);

  const formData = useSettingsStore((state) => state.formData);
  const setFormType = useSettingsStore((state) => state.setFormType);
  const setUser = useSettingsStore((state) => state.setUser);
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

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

  const passwordHeader = <h6>Pick a password</h6>;

  const passwordFooter = (
    <React.Fragment>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </React.Fragment>
  );

  const onSubmit = async (data, form) => {
    console.log("data", data);
    setIsLoading(true);
    await Auth.signIn(data.email, data.password)
      .then((use) => {
        console.log("user", use);
        console.log('use.challengeName', use.challengeName)
        if (use.challengeName === "NEW_PASSWORD_REQUIRED") {
          setIsLoading(false)
          setFormType("resetPassword");
          return
        }
        else if (use.attributes.email_verified === false) {
          console.log("Yes it is!")
          setIsLoading(false)
          setFormType("verifyEmail");
          return
        } else {
          setFormType("signedIn")
        }
        
      })
      .catch((error) => {
        if (error) {
          setShowMessage(true);
          setIsLoading(false);
        }
      });
  };

  const handleApply = () => {
    setFormType("Apply");
  };

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
              className="pi pi-exclamation-circle"
              style={{ fontSize: "5rem", color: "var(--red-500)" }}
            ></i>
            <h5>Invalid Email or Password</h5>
            <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
              Please check email and password to make sure they are correct.
            </p>
          </div>
        </Dialog>

        <div className="flex justify-content-center">
          <div className="card">
            <Title>Sign In</Title>
            <div>
              Don't have an account?{" "}
              <Button className="p-button-text" onClick={handleApply} type="button">
                APPLY NOW
              </Button>
            </div>
            <Form
              onSubmit={onSubmit}
              initialValues={formData}
              validate={validate}
              render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit} className="p-fluid">
                  <Field
                    name="email"
                    render={({ input, meta }) => (
                      <div className="field">
                        
                          <label
                            htmlFor="email"
                            className={classNames({
                              "p-error": isFormFieldValid(meta),
                            })}
                          >
                            Email*
                          </label>
                         
                          <InputText
                            id="email"
                            {...input}
                            className={classNames({
                              "p-invalid": isFormFieldValid(meta),
                            })}
                          />
                       
                        {getFormErrorMessage(meta)}
                      </div>
                    )}
                  />
                  <Field
                    name="password"
                    render={({ input, meta }) => (
                      <div className="field">
                        <label
                          htmlFor="password"
                          className={classNames({
                            "p-error": isFormFieldValid(meta),
                          })}
                        >
                          Password*
                        </label>
                        <Password
                          id="password"
                          {...input}
                          toggleMask
                          className={classNames({
                            "p-invalid": isFormFieldValid(meta),
                          })}
                          header={passwordHeader}
                          footer={passwordFooter}
                        />

                        {getFormErrorMessage(meta)}
                      </div>
                    )}
                  />
                  <Button className="p-button-text" type="button">
                    Forgot your password?
                  </Button>
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
