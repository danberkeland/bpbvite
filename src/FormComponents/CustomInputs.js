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
            disabled={isEdit ? props.dontEdit : isCreate ? false : true}
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

export const CustomIDInputBase = ({ label, ...props }) => {
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

export const CustomTextInputBase = ({ label, ...props }) => {
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

export const CustomFloatInputBase = ({ label, ...props }) => {
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

export const CustomIntInputBase = ({ label, ...props }) => {
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

export const CustomYesNoInputBase = ({ label, ...props }) => {
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

export const CustomDropdownInputBase = ({ label, ...props }) => {
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

export const CustomMultiSelectInputBase = ({ label, ...props }) => {
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

export const CustomTextInput = withCustomWrap(CustomTextInputBase);
export const CustomIDInput = withCustomWrap(CustomIDInputBase);
export const CustomFloatInput = withCustomWrap(CustomFloatInputBase);
export const CustomIntInput = withCustomWrap(CustomIntInputBase);
export const CustomYesNoInput = withCustomWrap(CustomYesNoInputBase);
export const CustomDropdownInput = withCustomWrap(CustomDropdownInputBase);
export const CustomMultiSelectInput = withCustomWrap(CustomMultiSelectInputBase);