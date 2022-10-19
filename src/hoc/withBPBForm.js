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
  const isChange = useSettingsStore((state) => state.isChange);

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
            console.log("IsCreate");
            fns.create(props).then(() => {
              window.location = path;
            });
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
              <Component {...props} />

              {!isEdit && !isCreate && (
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
