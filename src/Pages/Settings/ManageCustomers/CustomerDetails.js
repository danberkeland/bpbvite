import React, { useState } from "react";
import { CustomInputs } from "../../../FormComponents/CustomInputs";

import { validationSchema } from "./ValidationSchema";

import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { confirmDialog } from "primereact/confirmdialog";
import { ConfirmDialog } from "primereact/confirmdialog";

import { deleteUser, updateUser, createUser, deleteLocationUser } from "../../../restAPIs";
import { withFadeIn } from "../../../hoc/withFadeIn";
import { withBPBForm } from "../../../hoc/withBPBForm";
import { GroupBox, DefLabel, FlexSpaceBetween } from "../../../CommonStyles";
import { compose } from "../../../utils";
import { useCustomerList, useSimpleLocationList } from "../../../swr";

import { AddItem2 } from "./AddItem2";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";

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
  const [visible, setVisible] = useState(false);
  const { customerList } = useCustomerList();

  const handleDeleteCustomer = (e, props) => {
    confirmDialog({
      message: `Are you sure you want to delete this customer?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        console.log("values", props);
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
        deleteLocationUser(props).then(() => {
          window.location = "/Settings/ManageCustomers";
        });
      },
      reject: () => {
        return;
      },
    });
  };

  const handleDeleteCustLoc = (e, props) => {
    confirmDialog({
      message: `Are you sure you want to delete this location?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        console.log("values", props);
        
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
                  onClick={(e) => handleDeleteCustomer(e, props)}
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

              {customerList.data
                .filter((cust) => cust.custName === selectedCustomer.custName)
                .map((item, ind) => (
                  <GroupBox key={"group" + ind}>
                    <FlexSpaceBetween>
                      <h2>
                        <i className="pi pi-user"></i> Location Info{" "}
                      </h2>
                      {selectedCustomer.defLoc !== item.locNick ? (
                        <Button
                          icon="pi pi-trash"
                          className="p-button-rounded p-button-help p-button-outlined"
                          aria-label="Trash"
                          type="button"
                          onClick={(e) => handleDeleteLocation(e, item)}
                        />
                      ) : (
                        <DefLabel>* Default</DefLabel>
                      )}
                    </FlexSpaceBetween>

                    <BPB.CustomTextInput
                      key={"location" + ind}
                      name={`location[${ind}]`}
                      label="Location"
                      dontedit="true"
                      converter={{ ...props }}
                    />

                    <BPB.CustomDropdownInput
                      label="Auth Type"
                      key={"auth" + ind}
                      name={`auth[${ind}]`}
                      options={authTypes}
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
                    <Button
                      type="button"
                      label="delete"
                      onClick={(e) => handleDeleteCustLoc(e, item)}
                    />
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
          <AddItem2
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
