import React, { useRef, useState } from "react";
import { CustomInputs } from "../../../FormComponents/CustomInputs";

import { validationSchema } from "./ValidationSchema";

import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { OverlayPanel } from "primereact/overlaypanel";

import {
  deleteUser,
  updateUser,
  createUser,
  deleteLocationUser,
  createLocationUser,
} from "../../../restAPIs";
import { withFadeIn } from "../../../hoc/withFadeIn";
import { withBPBForm } from "../../../hoc/withBPBForm";
import { GroupBox, DefLabel, FlexSpaceBetween } from "../../../CommonStyles";
import { compose } from "../../../utils";
import { useSimpleLocationList } from "../../../swr";

import { useSettingsStore } from "../../../Contexts/SettingsZustand";
import { FieldArray } from "formik";
import { Dropdown } from "primereact/dropdown";

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
  const [chosenLoc, setChosenLoc] = useState();

  const isCreate = useSettingsStore((state) => state.isCreate);
  const op = useRef(null);

  let checkList = selectedCustomer.locations.map((sel) => sel.locNick);

  let defaultList = simpleLocationList.data
    ? simpleLocationList.data.filter((sim) => checkList.includes(sim.value))
    : [];

  let leftOuttList = simpleLocationList.data
    ? simpleLocationList.data.filter((sim) => !checkList.includes(sim.value))
    : [];

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

  const handleDeleteCustLoc = (values, arrayHelpers, index) => {
    confirmDialog({
      message: `Are you sure you want to delete this location?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        arrayHelpers.remove(index);
        let props = {
          sub: values.sub,
          locNick: values.locations[index].locNick,
        };

        deleteLocationUser(props);
      },
      reject: () => {
        return;
      },
    });
  };

  const handleLocChoice = (e, arrayHelpers) => {
    op.current.toggle(e);
    let ind = simpleLocationList.data.findIndex(
      (simp) => simp.value === e.value
    );
    let name = simpleLocationList.data[ind].label;
    arrayHelpers.push({ locName: name, locNick: e.value, authType: 1 });
    const newLocUser = {
      authType: 1,
      locNick: e.value,
      sub: selectedCustomer.sub,
      locName: name,
      Type: "LocationUser",
    };
    createLocationUser(newLocUser);
  };

  const handleDefaultLocs = (values) => {
    return simpleLocationList.data;
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
                options={defaultList}
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
                    <OverlayPanel ref={op}>
                      <Dropdown
                        optionLabel="label"
                        value={chosenLoc}
                        options={leftOuttList}
                        onChange={(e) => {
                          handleLocChoice(e, arrayHelpers);
                        }}
                        placeholder="Select a Location"
                      />
                    </OverlayPanel>
                    {props.values.locations.map((location, index) => (
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
                                handleDeleteCustLoc(
                                  props.values,
                                  arrayHelpers,
                                  index
                                );
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
                    <Button
                      type="button"
                      className="p-button-outlined p-button-primary"
                      label={
                        activeIndex === 0 ? "+ ADD LOCATION" : "+ ADD CUSTOMER"
                      }
                      onClick={(e) => op.current.toggle(e)}
                    />
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
                              onClick={(e) => op.current.toggle(e)}
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
                  </div>
                )}
              />
            </GroupBox>
          )}
        </div>
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
