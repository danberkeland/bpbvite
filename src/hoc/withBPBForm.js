import React, { useEffect } from "react";

import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Formik, Form } from "formik";
import { useSettingsStore } from "../Contexts/SettingsZustand";
import { FlexSpaceBetween } from "../CommonStyles";

export const withBPBForm = (Component) => (props) => {
  const setIsEdit = useSettingsStore((state) => state.setIsEdit);
  const isEdit = useSettingsStore((state) => state.isEdit);
  const isCreate = useSettingsStore((state) => state.isCreate);
  const setIsCreate = useSettingsStore((state) => state.setIsCreate);

  let str = props.name;
  let source = str + "List";
  let path = "/" + str.charAt(0).toUpperCase() + str.slice(1) + "s";

  let fns = props;

  var sourceVar = window[source];

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsEdit(false);
  }, [setIsEdit]);

  const editButtonStyle = {
    width: "100px",
    margin: "20px",
    fontSize: "1.2em",
  };

  const handleEdit = (e, props) => {
    console.log("values", props.values);
    window.scrollTo(0, 0);
    setIsEdit(true);
  };

  const handleDelete = (e, props) => {
    confirmDialog({
      message: `Are you sure you want to delete this ${str}?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        console.log("values", props);
        window.scrollTo(0, 0);
        setIsEdit(false);
        setIsCreate(false);
        fns.delete(props).then(() => {
          window.location = path;
        });
      },
      reject: () => {
        return;
      },
    });
  };

  return (
    <div>
      <ConfirmDialog />
      <Formik
        initialValues={props.initialState}
        validationSchema={props.validationSchema(sourceVar)}
        onSubmit={(props) => {
          console.log("createProps", props);
          window.scrollTo(0, 0);
          setIsEdit(false);
          if (isCreate) {
            console.log('IsCreate')
            fns.create(props)//.then(() => {
             // window.location = path;
            //});
          } else {
            fns.update(props).then(() => {
              window.location = path;
            });
          }
        }}
      >
        {(props) => (
          <React.Fragment>
            <Form>
              {isEdit | isCreate ? (
                <div className="floatButtonsTop">
                  <Button
                    label="Submit"
                    type="submit"
                    className="p-button-raised p-button-rounded p-button-danger"
                    style={editButtonStyle}
                  />
                </div>
              ) : (
                <div></div>
              )}
              <Component {...props} />

              {!isEdit && !isCreate && (
                <Button
                  label="Edit"
                  type="button"
                  className="editButton p-button-raised p-button-rounded p-button-success"
                  style={editButtonStyle}
                  onClick={(e) => handleEdit(e, props)}
                />
              )}
            </Form>
          </React.Fragment>
        )}
      </Formik>
      <Button
        label="Delete"
        type="button"
        className="p-button-raised p-button-rounded p-button-success"
        style={editButtonStyle}
        onClick={(e) => handleDelete(e, props)}
      />
      <div className="bottomSpace"></div>
    </div>
  );
};
