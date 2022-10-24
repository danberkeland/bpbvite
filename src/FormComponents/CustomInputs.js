import React from "react";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Password } from 'primereact/password';

import { withFormComponentWrap } from "../hoc/withFormComponentWrap";

const options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const CustomIDInputBase = ({ label, ...props }) => {
  
  return (
    <InputText
      {...props}
      value={ 
        props.value
          ? props.value
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
        props.value
          ? props.value
          : ""
      }
    />
  );
};

const CustomPasswordInputBase = ({ label, ...props }) => {
  
  return (
    <Password
      {...props}
      type="string"
      toggleMask={true}
  
      value={
        props.value
          ? props.value
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
        isNaN(props.value)
          ? 0
          : Number(props.value)
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
        isNaN(props.value)
          ? 0
          : Number(props.value)
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
        props.value
          ? props.value
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
        props.value
          ? props.value
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
        props.value
          ? props.value
          : null
      }
    />
  );
};

export class CustomInputs {
  constructor() {
    this.CustomTextInput = withFormComponentWrap(CustomTextInputBase);
    this.CustomPasswordInput = withFormComponentWrap(CustomPasswordInputBase);
    this.CustomIDInput = withFormComponentWrap(CustomIDInputBase);
    this.CustomFloatInput = withFormComponentWrap(CustomFloatInputBase);
    this.CustomIntInput = withFormComponentWrap(CustomIntInputBase);
    this.CustomYesNoInput = withFormComponentWrap(CustomYesNoInputBase);
    this.CustomDropdownInput = withFormComponentWrap(CustomDropdownInputBase);
    this.CustomMultiSelectInput = withFormComponentWrap(
      CustomMultiSelectInputBase
    );
  }
}
