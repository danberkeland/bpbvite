import React, { useEffect, useRef } from "react";

import { Button } from "primereact/button";

import { Formik, Form } from "formik";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { FlexSpaceBetween } from "../../CommonStyles";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { deleteLocation, deleteProduct } from "../../data/restAPIs";

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
  const userObject = useSettingsStore((state) => state.userObject);
  const currentLoc = useSettingsStore((state) => state.currentLoc);
  const setCurrentLoc = useSettingsStore((state) => state.setCurrentLoc);

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
    setIsLoading,
    userObject,
    currentLoc,
    setCurrentLoc,
  };

  console.log("Updateprops", props);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const delButton = useRef(null);

  const handleEdit = () => {
    console.log("Doing something?");
    window.scrollTo(0, 0);
    setIsEdit(true);
  };

  const handleDelete = (e, props) => {
    console.log("propsDelete", props.values);
    console.log("eDelete", e);
    
    confirmDialog({
      message: "Are you sure you want to delete this item?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        if (props.values.Type === "Product"){
          deleteProduct(props).then(() => {
            window.location = path;
          });
        }
        if (props.values.Type === "Location"){
          deleteLocation(props).then(() => {
            window.location = path;
          });
        }
        
      },
    });
  };

  return (
    <div>
      <Formik
        initialValues={props.initialState}
        validationSchema={props.validationSchema(sourceVar)}
        onSubmit={(props) => {
          setIsLoading(true);
          console.log("Formprops", props);
          console.log("fns", fns);
          window.scrollTo(0, 0);
          setIsEdit(false);
          if (isCreate) {
            // fns.create(props, fns).then(() => {
            //fns.create(props).then(() => {            // TESTING CHANGE
            fns.create(props, { ...fns }).then(() => {
              window.location = path;
            });
          } else {
            // fns.update({ ...fns, ...props }).then(() => {
            //fns.update(props).then(() => {     // TESTING CHANGE
            fns.update(props, { ...fns }).then(() => {
              console.log("Doing the update");
              console.log("Formprops", props);
              formType === "signedIn" ? (window.location = path) : <div></div>;
            });
          }
        }}
      >
        {(props) => (
          <React.Fragment>
            <ConfirmDialog />
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
                <div></div>
              )}
              {formType !== "signedIn" && (
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
                  <Button
                    ref={delButton}
                    type="button"
                    icon="pi pi-trashcan"
                    className="p-button-outlined p-button-help"
                    label={"Delete "+props.values.Type}
                    onClick={(e) => handleDelete(e, props)}
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
