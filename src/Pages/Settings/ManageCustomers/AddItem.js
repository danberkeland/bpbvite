import React from "react";
import { Formik, Form, useField } from "formik";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import { GroupBox } from "../../../CommonStyles";

import { useCustomerList, useSimpleLocationList } from "../../../swr";

function AddItem({ initialState, id }) {
  const { simpleLocationList } = useSimpleLocationList();
  console.log("simpleLocationList", simpleLocationList);

  const MyLocationDropDown = ({ label, ...props }) => {
    const [field, meta, helpers] = useField(props);

    console.log("dropDownProps", props);
    console.log("fields", field);
    return (
      <>
        <label>{id}</label>
        <Dropdown
          {...field}
          {...props}
          type="string"
          options={simpleLocationList.data}
          label="Location Name"
          name="locNick"
        />
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </>
    );
  };

  const MyCustomerDropDown = ({ label, ...props }) => {
    const [field, meta, helpers] = useField(props);

    console.log("dropDownProps", props);
    console.log("fields", field);
    console.log("meta", meta);

    return (
      <React.Fragment>
        <label>{id}</label>
        <Dropdown
          {...field}
          {...props}
          type="string"
          options={simpleLocationList.data}
          label="Location Name"
          name="locNick"
        />
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </React.Fragment>
    );
  };

  return (
    <div>
      <h1>Add an Item</h1>
      <Formik
        initialValues={{
          locNick: "",
          authType: "",
        }}
        onSubmit={(values) => {
          console.log("values", values);
        }}
      >
        <Form>
          <GroupBox>
            <h2>
              <i className="pi pi-user"></i> Add {id}
            </h2>

            {id === "Location" ? (
              <div className="field">
                <MyLocationDropDown
                  name="location"
                  type="text"
                  label="Location"
                />
              </div>
            ) : (
              <div className="field">
                <MyCustomerDropDown
                  name="customer"
                  type="text"
                  label="Customer"
                />
              </div>
            )}
            <div className="field">
              <MyCustomerDropDown
                name="customer"
                type="text"
                label="Customer"
              />
            </div>
          </GroupBox>
          <Button type="submit" label="Submit" />
        </Form>
      </Formik>
    </div>
  );
}

export default AddItem;
