import React, { useEffect } from "react";

import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Formik, Form } from "formik";
import { useSettingsStore } from "../Contexts/SettingsZustand";
import { FlexSpaceBetween } from "../CommonStyles";

export const withBPBForm = (Component) => (props) => {
  const isEdit = useSettingsStore((state) => state.isEdit);
  const setIsEdit = useSettingsStore((state) => state.setIsEdit);
  const isCreate = useSettingsStore((state) => state.isCreate);
  const setIsCreate = useSettingsStore((state) => state.setIsCreate);
  const isChange = useSettingsStore((state) => state.isChange);
  const setFormType = useSettingsStore((state) => state.setFormType);
  const setAuthClass = useSettingsStore((state) => state.setAuthClass);
  const setAccess = useSettingsStore((state) => state.setAccess);
  const setUser = useSettingsStore((state) => state.setUser);
  const setUserObject = useSettingsStore((state) => state.setUserObject);
  const formType = useSettingsStore((state) => state.formType);
  const isLoading = useSettingsStore((state) => state.isLoading);
  const user = useSettingsStore((state) => state.user);
  const authClass = useSettingsStore((state) => state.authClass);
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  props = {
    ...props,
    isEdit,
    formType,
    isCreate,
    isChange,
    setIsEdit,
    setIsCreate,
    setFormType,
    setAuthClass,
    setAccess,
    setUserObject,
    setUser,
    isLoading,
    user,
    authClass,
    setIsLoading

  };
  console.log("Formprops", props);

  let str = props.name;
  let source = str + "List";
  let path = "/" + str.charAt(0).toUpperCase() + str.slice(1) + "s";

  let fns = props;

  var sourceVar = window[source];

  const editButtonStyle = {
    width: "100px",
    margin: "20px",
    fontSize: "1.2em",
  };

  const handleEdit = (e, props) => {
    window.scrollTo(0, 0);
    setIsEdit(true);
  };

  return (
    <div>
      <ConfirmDialog />
      <Formik
        initialValues={props.initialState}
        validationSchema={props.validationSchema(sourceVar)}
        onSubmit={(props) => {
          window.scrollTo(0, 0);
          setIsEdit(false);
          if (isCreate) {
            fns.create(props).then(() => {
              window.location = path;
            });
          } else {
            fns.update({ ...props, ...fns }).then(() => {
              formType === "signedIn" ? (window.location = path) : <div></div>;
            });
          }
        }}
      >
        {(props) => (
          <React.Fragment>
            <Form>
              <Component {...props} />
              {isEdit | isCreate && formType === "signedIn" ? (
                <div className="floatButtonsTop">
                  {isChange && (
                    <Button
                      label="Submit"
                      type="submit"
                      className="p-button-raised p-button-rounded p-button-danger"
                      style={editButtonStyle}
                    />
                  )}
                </div>
              ) : (
                <Button label="Submit" type="submit" style={editButtonStyle} />
              )}

              {!isEdit && !isCreate && formType === "signedIn" && (
                <FlexSpaceBetween>
                  <Button
                    type="button"
                    icon="pi pi-pencil"
                    className="p-button-outlined p-button-help"
                    label="Edit"
                    onClick={(e) => handleEdit(e, props)}
                  />
                </FlexSpaceBetween>
              )}
            </Form>
          </React.Fragment>
        )}
      </Formik>

      <div className="bottomSpace"></div>
    </div>
  );
};
