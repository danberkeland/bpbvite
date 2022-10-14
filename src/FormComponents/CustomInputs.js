
import React from "react";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";

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
      value={props.attr ? props.attr :
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
    this.CustomTextInput = withFormComponentWrap(CustomTextInputBase);
    this.CustomIDInput = withFormComponentWrap(CustomIDInputBase);
    this.CustomFloatInput = withFormComponentWrap(CustomFloatInputBase);
    this.CustomIntInput = withFormComponentWrap(CustomIntInputBase);
    this.CustomYesNoInput = withFormComponentWrap(CustomYesNoInputBase);
    this.CustomDropdownInput = withFormComponentWrap(CustomDropdownInputBase);
    this.CustomMultiSelectInput = withFormComponentWrap(CustomMultiSelectInputBase);
  }
}
