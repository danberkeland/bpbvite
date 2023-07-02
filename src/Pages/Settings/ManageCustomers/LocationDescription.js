import React, { useRef, useState } from "react";
import { CustomInputs } from "../../../FormComponents/CustomInputs";

import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { OverlayPanel } from "primereact/overlaypanel";

import { createLocationUser, deleteLocationUser } from "../../../restAPIs";
import { GroupBox, FlexSpaceBetween } from "../../../CommonStyles";

import { useSettingsStore } from "../../../Contexts/SettingsZustand";
import { FieldArray } from "formik";
import { Dropdown } from "primereact/dropdown";
import { useSimpleCustomerList } from "../../../swr";

const BPB = new CustomInputs();

const authTypes = [
  { label: "Admin", value: 1 },
  { label: "Manager", value: 2 },
  { label: "Read Only", value: 3 },
];

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

function LocationDescription(props) {
  const { simpleCustomerList } = useSimpleCustomerList();
  const [chosenLoc, setChosenLoc] = useState();

  const isCreate = useSettingsStore((state) => state.isCreate);
  const op = useRef(null);

  const handleCustChoice = (e, arrayHelpers) => {
    op.current.toggle(e);
    let ind = simpleCustomerList.data.findIndex(
      (simp) => simp.value === e.value
    );
    let name = simpleCustomerList.data[ind].label;
    let sub = simpleCustomerList.data[ind].id;

    arrayHelpers.push({ custName: name, sub: e.value, authType: 1 });
    const newLocUser = {
      authType: 1,
      locNick: props.values.locNick,
      sub: sub,
      locName: props.values.locName,
      Type: "LocationUser",
    };

    createLocationUser(newLocUser);
  };

  let checkList = isCreate
    ? []
    : props.values.customers.map((sel) => sel.custName);

  let leftOuttList = simpleCustomerList.data
    ? simpleCustomerList.data.filter((sim) => !checkList.includes(sim.value))
    : [];
  return (
    <GroupBox>
      <h2>
        <i className="pi pi-user"></i> Customer Description
      </h2>
      <BPB.CustomTextInput
        label="Location Name"
        name="locName"
        dontedit="true"
        converter={props}
      />
      <BPB.CustomTextInput
        label="Location Nick Name"
        name="locNick"
        dontedit="true"
        converter={props}
      />

      <FieldArray
        name="customers"
        render={(arrayHelpers) => (
          <div>
            <OverlayPanel ref={op}>
              <Dropdown
                optionLabel="label"
                value={chosenLoc}
                options={leftOuttList}
                onChange={(e) => {
                  handleCustChoice(e, arrayHelpers);
                }}
                placeholder="Select a Location"
              />
            </OverlayPanel>
            {props.values.customers.map((customer, index) => (
              <GroupBox key={index}>
                <FlexSpaceBetween>
                  <h2>
                    <i className="pi pi-user"></i> Customer Info
                  </h2>

                  <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-help p-button-outlined"
                    aria-label="trash"
                    type="button"
                    onClick={() => {
                      handleDeleteCustLoc(props.values, arrayHelpers, index);
                    }}
                  />
                </FlexSpaceBetween>

                <BPB.CustomTextInput
                  label="Customer"
                  name={`customers[${index}].custName`}
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
            {!isCreate && (
              <Button
                type="button"
                className="p-button-outlined p-button-primary"
                label={"+ ADD CUSTOMER"}
                onClick={(e) => op.current.toggle(e)}
              />
            )}
          </div>
        )}
      />
    </GroupBox>
  );
}

export default LocationDescription;
