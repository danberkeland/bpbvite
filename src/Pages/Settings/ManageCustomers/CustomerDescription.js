import React, { useRef, useState } from "react";
import { CustomInputs } from "../../../FormComponents/CustomInputs";

import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { OverlayPanel } from "primereact/overlaypanel";

import {
  deleteUser,
  deleteLocationUser,
  createLocationUser,
} from "../../../restAPIs";
import { GroupBox, DefLabel, FlexSpaceBetween } from "../../../CommonStyles";
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

const handleDeleteCustomer = (e, props) => {
  confirmDialog({
    message: `Are you sure you want to delete this customer?`,
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      console.log("values", props);
      deleteUser({ sub: props.values.sub }).then(() => {
        window.location = "/Settings/ManageCustomers";
      });
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
        id: values.locations[index].id,
      };

      deleteLocationUser(props);
    },
    reject: () => {
      return;
    },
  });
};

function CustomerDescription(props) {
  const { simpleLocationList } = useSimpleLocationList();
  const [chosenLoc, setChosenLoc] = useState();

  const isCreate = useSettingsStore((state) => state.isCreate);
  const op = useRef(null);

  const handleLocChoice = (e, arrayHelpers) => {
    op.current.toggle(e);
    console.log("e",e)
    let ind = simpleLocationList.data.findIndex(
      (simp) => simp.value === e.value
    );
    console.log('ind', ind)
    let name = simpleLocationList.data[ind].label;
    console.log('simpleLocationList.data[ind]', simpleLocationList.data[ind])
    arrayHelpers.push({ locName: name, locNick: e.value, authType: 1 });
    const newLocUser = {
      authType: 1,
      locNick: e.value,
      sub: props.selectedCustomer.sub,
      locName: name,
      Type: "LocationUser",
    };
    console.log("newLocUser",newLocUser)
    createLocationUser(newLocUser);
  };

  let checkList = isCreate
    ? []
    : props.values.locations.map((sel) => sel.locNick);
  let defaultList = isCreate
    ? simpleLocationList.data
    : simpleLocationList.data
    ? simpleLocationList.data.filter((sim) => checkList.includes(sim.value))
    : [];

  let leftOuttList = simpleLocationList.data
    ? simpleLocationList.data.filter((sim) => !checkList.includes(sim.value))
    : [];
  return (
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

                  {props.values.defLoc !== location.locNick ? (
                    <Button
                      icon="pi pi-trash"
                      className="p-button-rounded p-button-help p-button-outlined"
                      aria-label="trash"
                      type="button"
                      visible={false}
                      onClick={() => {
                        handleDeleteCustLoc(props.values, arrayHelpers, index);
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
            {!isCreate && (
              <Button
                type="button"
                className="p-button-outlined p-button-primary"
                label={"+ ADD LOCATION"}
                onClick={(e) => op.current.toggle(e)}
              />
            )}
          </div>
        )}
      />
    </GroupBox>
  );
}

export default CustomerDescription;
