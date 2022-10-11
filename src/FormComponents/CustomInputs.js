/* eslint-disable no-eval */
import { useField } from "formik";
import { InputText } from "primereact/inputtext";

import { useSettingsStore } from "../Contexts/SettingsZustand";


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
          type="string"
          value={
            props.converter.values[props.name]
              ? props.converter.values[props.name]
              : ""
          }
          className={meta.touched && meta.error ? "p-error" : ""}
          disabled={ isEdit ? false : isCreate ? false : true }
        />
      </div>
      {meta.touched && meta.error && <h4 className="p-error">{meta.error}</h4>}
    </div>
  );
};
