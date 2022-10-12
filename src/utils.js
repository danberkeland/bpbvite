import React, { useEffect } from "react";

import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { useSettingsStore } from "./Contexts/SettingsZustand";
import styled from "styled-components";



export const sortAtoZDataByIndex = (data, index) => {
  try {
    data.sort(function (a, b) {
      return a[index] > b[index] ? 1 : -1;
    });

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const sortZtoADataByIndex = (data, index) => {
  data.sort(function (a, b) {
    return a[index] < b[index] ? 1 : -1;
  });
  return data;
};



export const withFadeIn = (Component) => (props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: "0", y: "0" }}
      animate={{ opacity: 1, x: "0" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      exit={{ opacity: 0, x: "0" }}
    >
      <Component {...props} />
    </motion.div>
  );
};

export const withBPBForm = (Component) => (props) => {
  const setIsEdit = useSettingsStore((state) => state.setIsEdit);
  const isEdit = useSettingsStore((state) => state.isEdit);
  const isCreate = useSettingsStore((state) => state.isCreate);
  const setIsCreate = useSettingsStore((state) => state.setIsCreate);

  let str = props.name
  let source = str+"List"
  let path = "/"+ str.charAt(0).toUpperCase()+str.slice(1)+"s"
  let create = "create"+str.charAt(0).toUpperCase()+str.slice(1)
  console.log("create", create)
  let fns = props

  var sourceVar = window[source]
  let createFunc = window[create]
  console.log("type",typeof createFunc)
  

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
        fns.deleteProduct(props).then(() => {
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
          console.log("values", props);
          window.scrollTo(0, 0);
          setIsEdit(false);
          setIsCreate(false);
          if (isCreate) {
            fns.createProduct(props).then(() => {
              window.location = path;
            });
          } else {
            fns.updateProduct(props).then(() => {
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
                  className="editButton p-button-raised p-button-rounded p-button-success"
                  style={editButtonStyle}
                  onClick={(e) => handleEdit(e, props)}
                />
              )}
            </Form>
            <Button
              label="Delete"
              type="delete"
              className="editButton p-button-raised p-button-rounded p-button-success"
              style={editButtonStyle}
              onClick={(e) => handleDelete(e, props)}
            />
          </React.Fragment>
        )}
      </Formik>
      <div className="bottomSpace"></div>
    </div>
  );
};


export const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  border: 1px solid lightgrey;
  width: 95%;
  margin: 5px 10px 20px 10px;
  padding: 5px 5px 10px 5px;
`;


export const compose = (...fns) =>
  fns.reduceRight(
    (prevFn, nextFn) =>
      (...args) =>
        nextFn(prevFn(...args)),
    (value) => value
  );
