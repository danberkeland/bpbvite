import React, { useState } from "react";

import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";


function NewList({ lab, formik }) {
  

  const isFormFieldValid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name]}</small>
      )
    );
  };


  return (
    
          <div className="field">
            <label
              htmlFor={lab.name}
              key={lab.name+1}
              className={classNames({
                "p-error": isFormFieldValid(lab.name),
              })}
            >
              {lab.label}
            </label>

            <InputText
              id={lab.name}
              name={lab.name}
              key={lab.name+2}
              autoCorrect="off"
              value={formik.values[lab.name]}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isFormFieldValid(lab.name),
              })}
            />

            {getFormErrorMessage(lab.name)}
          </div>
      
            )}       

export default NewList;
