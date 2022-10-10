/* eslint-disable no-eval */
import { useField } from "formik";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';

import { useSettingsStore } from "../Contexts/SettingsZustand";
import { useEffect, useState } from "react";

const options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];


export const CustomIDInput = ({ label, ...props }) => {
  const isEdit = useSettingsStore((state) => state.isEdit);
  const isCreate = useSettingsStore((state) => state.isCreate);
  
  

  const [field, meta] = useField(props);
 
  return (
    <div>
      <div className="field">
        
          <label>{label}</label>
       
        <InputText
          {...field}
          {...props}
          autoCapitalize="none"
          securetextentry="true"
          keyboardtype="visible-password"
          className={meta.touched && meta.error ? "p-error" : ""}
          disabled={ isEdit ? true : isCreate ? false : true }
        />
      </div>
      {((meta.touched && meta.error) ||
        meta.error === "must contain only lowercase letters") && (
        <h4 className="p-error">{meta.error}</h4>
      )}
    </div>
  );
};

export const CustomInput = ({ label, ...props }) => {
  const isEdit = useSettingsStore((state) => state.isEdit);
  const isCreate = useSettingsStore((state) => state.isCreate);
  const [field, meta] = useField(props);
 
  return (
    <div>
      <div className="field">
       
          <label>{label}</label>
       
        <InputText
          {...field}
          {...props}
          className={meta.touched && meta.error ? "p-error" : ""}
          disabled={ isEdit ? false : isCreate ? false : true }
        />
      </div>
      {meta.touched && meta.error && <h4 className="p-error">{meta.error}</h4>}
    </div>
  );
};

export const CustomFloatInput = ({ label, ...props }) => {
  const isEdit = useSettingsStore((state) => state.isEdit);
  const isCreate = useSettingsStore((state) => state.isCreate);
  const [field, meta] = useField(props);
 
  return (
    <div>
      <div className="field">
       
          <label>{label}</label>
       
        <InputNumber
          
          {...field}
          {...props}
          disabled={ isEdit ? false : isCreate ? false : true }
          value={isNaN(props.converter.values[props.name]) ? 0 :
            Number(props.converter.values[props.name])
          }
          onChange={(values) => {
          
            props.converter.setFieldValue(props.name, Number(values.value));
          }}
          mode="decimal"
          minFractionDigits={2}
          maxFractionDigits={2}
          className={meta.touched && meta.error ? "p-error" : ""}
          
        />
      </div>
      {meta.touched && meta.error && <h4 className="p-error">{meta.error}</h4>}
    </div>
  );
};

export const CustomIntInput = ({ label, ...props }) => {
  const isEdit = useSettingsStore((state) => state.isEdit);
  const isCreate = useSettingsStore((state) => state.isCreate);
  const [field, meta] = useField(props);
  
  return (
    <div>
      <div className="field">
       
          <label>{label}</label>
       
        <InputNumber
          
          {...field}
          {...props}
          disabled={ isEdit ? false : isCreate ? false : true }
          value={isNaN(props.converter.values[props.name]) ? 0 :
            Number(props.converter.values[props.name])
          }
          onChange={(values) => {
          
            props.converter.setFieldValue(props.name, Number(values.value));
          }}
          className={meta.touched && meta.error ? "p-error" : ""}
          
        />
      </div>
      {meta.touched && meta.error && <h4 className="p-error">{meta.error}</h4>}
    </div>
  );
};

export const CustomYesNoInput = ({ label, ...props }) => {
  const isEdit = useSettingsStore((state) => state.isEdit);
  const isCreate = useSettingsStore((state) => state.isCreate);
  const [field, meta] = useField(props);
 
  return (
    <div>
      <div className="field">
       
          <label>{label}</label>
        
        <SelectButton
          {...field}
          {...props}
          disabled={ isEdit ? false : isCreate ? false : true }
          value={
            props.converter.values[props.name]
              ? props.converter.values[props.name]
              : false
          }
          onChange={(values) => {
           
            props.converter.setFieldValue(
              props.name,
              !props.converter.values[props.name]
            );
          }}
          options={options}
          className={meta.touched && meta.error ? "p-error" : ""}
          
        />
      </div>
      {meta.touched && meta.error && <h4 className="p-error">{meta.error}</h4>}
    </div>
  );
};


export const CustomDropdownInput = ({ label, ...props }) => {
  const isEdit = useSettingsStore((state) => state.isEdit);
  const isCreate = useSettingsStore((state) => state.isCreate);
  const [field, meta] = useField(props);

 
  return (
    <div>
      <div className="field">
       
          <label>{label}</label>
        
        <Dropdown
          {...field}
          {...props}
          disabled={ isEdit ? false : isCreate ? false : true }
          value={
            props.converter.values[props.name]
              ? props.converter.values[props.name]
              : null
          }
          className={meta.touched && meta.error ? "p-error" : ""}
          
        />
      </div>
      {meta.touched && meta.error && <h4 className="p-error">{meta.error}</h4>}
    </div>
  );
};

export const CustomMultiSelectInput = ({ label, ...props }) => {
  const isEdit = useSettingsStore((state) => state.isEdit);
  const isCreate = useSettingsStore((state) => state.isCreate);
  const [field, meta] = useField(props);

 
  return (
    <div>
      <div className="field">
       
          <label>{label}</label>
        
        <MultiSelect
          {...field}
          {...props}
          disabled={ isEdit ? false : isCreate ? false : true }
          value={
            props.converter.values[props.name]
              ? props.converter.values[props.name]
              : null
          }
          className={meta.touched && meta.error ? "p-error" : ""}
          
        />
      </div>
      {meta.touched && meta.error && <h4 className="p-error">{meta.error}</h4>}
    </div>
  );
};

