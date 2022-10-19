import React, { useState } from "react";
import { CustomInputs } from "../../../FormComponents/CustomInputs";

import { validationSchema } from "./ValidationSchema";

import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { confirmDialog } from "primereact/confirmdialog";

import {
  deleteUser,
  updateUser,
  createUser,
  deleteLocationUser,
} from "../../../restAPIs";
import { withFadeIn } from "../../../hoc/withFadeIn";
import { withBPBForm } from "../../../hoc/withBPBForm";
import { GroupBox, DefLabel, FlexSpaceBetween } from "../../../CommonStyles";
import { compose } from "../../../utils";
import { useCustomerList, useSimpleLocationList } from "../../../swr";

import { AddItem } from "./AddItem";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";
import { Field, FieldArray } from "formik";

const BPB = new CustomInputs();

const authTypes = [
  { label: "Admin", value: 1 },
  { label: "Manager", value: 2 },
  { label: "Read Only", value: 3 },
];

const authClasses = [
  { label: "BPB Admin", value: "bpbfull" },
  { label: "BPB Mgr", value: "bpbmgr" },
  { label: "BPB Crew", value: "bpbcrew" },
  { label: "Customer", value: "customer" },
];

function CustomerDetails({
  initialState,
  selectedCustomer = { initialState },
  activeIndex = 0,
}) {
  const { simpleLocationList } = useSimpleLocationList();
  const isCreate = useSettingsStore((state) => state.isCreate);
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const [visible, setVisible] = useState(false);
  const { customerList } = useCustomerList();

  const handleDeleteCustomer = (e, props) => {
    confirmDialog({
      message: `Are you sure you want to delete this customer?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        console.log("values", props);
        deleteUser({ sub: props.values.sub });
      },
      reject: () => {
        return;
      },
    });
  };

  const handleDeleteLocation = (e, props) => {
    confirmDialog({
      message: `Are you sure you want to delete this location?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        console.log("values", props);
        deleteLocationUser(props); //.then(() => {
        //window.location = "/Settings/ManageCustomers";
        //});
      },
      reject: () => {
        return;
      },
    });
  };

  const handleDeleteCustLoc = (index) => {
    confirmDialog({
      message: `Are you sure you want to delete this location?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setIsLoading(true);

        let props = {
          sub: selectedCustomer.sub,
          locNick: selectedCustomer.locations[index].locNick,
        };

        deleteLocationUser(props)
          .then(() => setIsLoading(false))
          .then(() => {
            window.location = "/Settings/ManageCustomers";
          });
      },
      reject: () => {
        return;
      },
    });
  };

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
              <FlexSpaceBetween>
                <h2>
                  <i className="pi pi-user"></i> Customer Description{" "}
                </h2>
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-help p-button-outlined"
                  aria-label="Trash"
                  type="button"
                  onClick={(e) => {
                    handleDeleteCustomer(e, props);
                  }}
                />
              </FlexSpaceBetween>

              <BPB.CustomTextInput
                label="Customer Name"
                name="custName"
                converter={props}
              />
              <BPB.CustomTextInput
                label="Email"
                name="email"
                dontedit="true"
                converter={props}
              />

              <BPB.CustomDropdownInput
                label="Default Location"
                name="defLoc"
                options={simpleLocationList.data}
                converter={props}
              />

              <BPB.CustomDropdownInput
                label="Class"
                name="authClass"
                options={authClasses}
                converter={props}
              />
              {!isCreate && (
                <BPB.CustomTextInput
                  label="Sub"
                  name="sub"
                  dontedit="true"
                  converter={props}
                />
              )}
              <FieldArray
                name="locations"
                render={(arrayHelpers) => (
                  <div>
                    {selectedCustomer.locations.map((location, index) => (
                      <GroupBox key={index}>
                        <FlexSpaceBetween>
                          <h2>
                            <i className="pi pi-user"></i> Location Info
                          </h2>

                          {selectedCustomer.defLoc !== location.locNick ? (
                            <Button
                              icon="pi pi-trash"
                              className="p-button-rounded p-button-help p-button-outlined"
                              aria-label="trash"
                              type="button"
                              onClick={() => {
                                handleDeleteCustLoc(index);
                              }}
                            />
                          ) : (
                            <DefLabel>* Default</DefLabel>
                          )}
                        </FlexSpaceBetween>

                        <BPB.CustomTextInput
                          label="Location"
                          name={`locations[${index}].locName`}
                          dontedit="true"
                          converter={props}
                        />
                        <BPB.CustomDropdownInput
                          label="Auth Type"
                          name={`locations[${index}].authType`}
                          options={authTypes}
                          converter={props}
                        />
                      </GroupBox>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        arrayHelpers.push({ locName: "", authType: "" })
                      }
                    >
                      +
                    </button>
                  </div>
                )}
              />
            </GroupBox>
          ) : (
            <GroupBox>
              <h2>
                <i className="pi pi-user"></i> Customer Description
              </h2>
              <FieldArray
                name="customers"
                render={(arrayHelpers) => (
                  <div>
                    {selectedCustomer.customers.map((customer, index) => (
                      <GroupBox key={index}>
                        <FlexSpaceBetween>
                          <h2>
                            <i className="pi pi-user"></i> Customer Info
                          </h2>

                          {selectedCustomer.custNick !== customer.custNick ? (
                            <Button
                              icon="pi pi-trash"
                              className="p-button-rounded p-button-help p-button-outlined"
                              aria-label="trash"
                              type="button"
                              onClick={() =>
                                handleDeleteCustLoc(arrayHelpers, index)
                              }
                            />
                          ) : (
                            <DefLabel>* Default</DefLabel>
                          )}
                        </FlexSpaceBetween>

                        <BPB.CustomTextInput
                          label="Customer"
                          name={`customers[${index}].sub`}
                          dontedit="true"
                          converter={props}
                        />
                        <BPB.CustomDropdownInput
                          label="Auth Type"
                          name={`customers[${index}].authType`}
                          options={authTypes}
                          converter={props}
                        />
                      </GroupBox>
                    ))}
                    ;
                    <button
                      type="button"
                      onClick={() =>
                        arrayHelpers.push({ custName: "", authType: "" })
                      }
                    >
                      +
                    </button>
                  </div>
                )}
              />
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
            selectedCustomer={selectedCustomer}
            id={activeIndex === 0 ? "Location" : "Customer"}
            {...props}
          />
        </Sidebar>
        <FlexSpaceBetween>
          <Button
            type="button"
            className="p-button-outlined p-button-primary"
            label={activeIndex === 0 ? "+ ADD LOCATION" : "+ ADD CUSTOMER"}
            onClick={(e) => setVisible(true)}
          />
        </FlexSpaceBetween>
      </React.Fragment>
    );
  });

  return (
    <React.Fragment>
      <BPBUserForm
        name="settings/ManageCustomer"
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
