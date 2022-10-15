import React, { useState } from "react";
import { CustomInputs } from "../../../FormComponents/CustomInputs";
import { Formik, Field, Form, useField } from "formik";
import { validationSchema } from "./ValidationSchema";

import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Dropdown } from "primereact/dropdown";

import { deleteUser, updateUser, createUser } from "../../../restAPIs";
import { withFadeIn } from "../../../hoc/withFadeIn";
import { withBPBForm } from "../../../hoc/withBPBForm";
import { GroupBox } from "../../../CommonStyles";
import { compose } from "../../../utils";
import { useCustomerList, useSimpleLocationList } from "../../../swr";
import { InputText } from "primereact/inputtext";

const BPB = new CustomInputs();

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

function CustomerDetails({
  initialState,
  selectedCustomer = { initialState },
  activeIndex = 0,
}) {
  const [visible, setVisible] = useState(false);
  const { customerList } = useCustomerList();

  const BPBUserForm = compose(
    withBPBForm,
    withFadeIn
  )((props) => {
    return (
      <React.Fragment>
        <div className="productDetails">
          <h1>
            {activeIndex === 0
              ? selectedCustomer.custName
              : selectedCustomer.locNick}
          </h1>
          {activeIndex === 0 ? (
            <GroupBox>
              <h2>
                <i className="pi pi-user"></i> Customer Description{" "}
              </h2>

              <BPB.CustomTextInput
                label="Customer Name"
                name="custName"
                dontedit="true"
                converter={props}
              />
              <BPB.CustomTextInput
                label="Class"
                name="authClass"
                converter={props}
              />

              {customerList.data
                .filter((cust) => cust.custName === selectedCustomer.custName)
                .map((item, ind) => (
                  <GroupBox key={"group" + ind}>
                    <h2>
                      <i className="pi pi-user"></i> Location Info{" "}
                    </h2>
                    <Button type="button" label="delete" />

                    <BPB.CustomTextInput
                      key={"location" + ind}
                      name={`location[${ind}]`}
                      label="Location"
                      dontedit="true"
                      converter={{ ...props }}
                    />
                    <BPB.CustomTextInput
                      key={"auth" + ind}
                      name={`auth[${ind}]`}
                      label="Auth Type"
                      converter={props}
                    />
                  </GroupBox>
                ))}
            </GroupBox>
          ) : (
            <GroupBox>
              <h2>
                <i className="pi pi-user"></i> Location Description
              </h2>

              {customerList.data
                .filter((cust) => cust.locNick === selectedCustomer.locNick)
                .map((item, ind) => (
                  <GroupBox key={"group" + ind}>
                    <h2>
                      <i className="pi pi-user"></i> Customer Info
                    </h2>
                    <Button type="button" label="delete" />
                    <BPB.CustomTextInput
                      key={"customer" + ind}
                      name={`customer[${ind}]`}
                      label="Customer"
                      dontedit="true"
                      converter={props}
                    />
                    <BPB.CustomTextInput
                      key={"auth" + ind}
                      name={`auth[${ind}]`}
                      label="Auth Type"
                      converter={props}
                    />
                  </GroupBox>
                ))}
            </GroupBox>
          )}
        </div>
        <Sidebar
          visible={visible}
          position="right"
          className="p-sidebar-lg"
          onHide={() => setVisible(false)}
        >
          <AddItem
            initialState={{ locNick: "", authType: "" }}
            id={activeIndex === 0 ? "Location" : "Customer"}
          />
        </Sidebar>
        <Button
          type="button"
          label={activeIndex === 0 ? "ADD LOCATION" : "ADD CUSTOMER"}
          onClick={(e) => setVisible(true)}
        />
      </React.Fragment>
    );
  });

  return (
    <React.Fragment>
      <BPBUserForm
        name="user"
        validationSchema={validationSchema}
        initialState={initialState}
        create={createUser}
        delete={deleteUser}
        update={updateUser}
      />
    </React.Fragment>
  );
}

export default CustomerDetails;
