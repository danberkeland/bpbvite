/* eslint-disable no-eval */
import { useField } from "formik";
import React, { useEffect } from "react";

import { useSettingsStore } from "../Contexts/SettingsZustand";



export const withFormComponentWrap = (Component) => (props) => {
    const isEdit = useSettingsStore((state) => state.isEdit);
    const isCreate = useSettingsStore((state) => state.isCreate);
    
    const setIsChange = useSettingsStore((state) => state.setIsChange);

    const [field, meta] = useField(props);
   
    meta.initialValue !== meta.value && setIsChange(true)
  
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