/* eslint-disable no-eval */
import { useField } from "formik";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import React from "react";

import { useSettingsStore } from "../Contexts/SettingsZustand";

const options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const withCustomWrap = (Component) => (props) => {
  const isEdit = useSettingsStore((state) => state.isEdit);
  const isCreate = useSettingsStore((state) => state.isCreate);
  const [field, meta] = useField(props);

  return (
    <React.Fragment>
      <div>
        <div className="field">
          <label>{props.label}</label>
          <Component
            {...props}
            {...field}
            disabled={isEdit ? props.dontedit==="true" ? true : false : isCreate ? false : true}
            className={meta.touched && meta.error ? "p-error" : ""}
          />
        </div>
        {((meta.touched && meta.error) ||
          meta.error === "must contain only lowercase letters") && (
          <h4 className="p-error">{meta.error}</h4>
        )}
      </div>
    </React.Fragment>
  );
};

const CustomIDInputBase = ({ label, ...props }) => {
  return (
    <InputText
      {...props}
      value={
        props.converter.values[props.name]
          ? props.converter.values[props.name]
          : ""
      }
      type="string"
      autoCapitalize="none"
      securetextentry="true"
      keyboardtype="visible-password"
    />
  );
};

const CustomTextInputBase = ({ label, ...props }) => {
  return (
    <InputText
      {...props}
      type="string"
      value={
        props.converter.values[props.name]
          ? props.converter.values[props.name]
          : ""
      }
    />
  );
};

const CustomFloatInputBase = ({ label, ...props }) => {
  return (
    <InputNumber
      {...props}
      type="tel"
      value={
        isNaN(props.converter.values[props.name])
          ? 0
          : Number(props.converter.values[props.name])
      }
      onChange={(values) => {
        props.converter.setFieldValue(props.name, Number(values.value));
      }}
      mode="decimal"
      minFractionDigits={2}
      maxFractionDigits={2}
    />
  );
};

const CustomIntInputBase = ({ label, ...props }) => {
  return (
    <InputNumber
      {...props}
      type="tel"
      value={
        isNaN(props.converter.values[props.name])
          ? 0
          : Number(props.converter.values[props.name])
      }
      onChange={(values) => {
        props.converter.setFieldValue(props.name, Number(values.value));
      }}
    />
  );
};

const CustomYesNoInputBase = ({ label, ...props }) => {
  return (
    <SelectButton
      {...props}
      value={
        props.converter.values[props.name]
          ? props.converter.values[props.name]
          : false
      }
      onChange={() => {
        props.converter.setFieldValue(
          props.name,
          !props.converter.values[props.name]
        );
      }}
      options={options}
    />
  );
};

const CustomDropdownInputBase = ({ label, ...props }) => {
  return (
    <Dropdown
      {...props}
      type="string"
      value={
        props.converter.values[props.name]
          ? props.converter.values[props.name]
          : null
      }
    />
  );
};

const CustomMultiSelectInputBase = ({ label, ...props }) => {
  return (
    <MultiSelect
      {...props}
      value={
        props.converter.values[props.name]
          ? props.converter.values[props.name]
          : null
      }
    />
  );
};

export class CustomInputs {
  constructor(){
    this.CustomTextInput = withCustomWrap(CustomTextInputBase);
    this.CustomIDInput = withCustomWrap(CustomIDInputBase);
    this.CustomFloatInput = withCustomWrap(CustomFloatInputBase);
    this.CustomIntInput = withCustomWrap(CustomIntInputBase);
    this.CustomYesNoInput = withCustomWrap(CustomYesNoInputBase);
    this.CustomDropdownInput = withCustomWrap(CustomDropdownInputBase);
    this.CustomMultiSelectInput = withCustomWrap(CustomMultiSelectInputBase);
  }
}
