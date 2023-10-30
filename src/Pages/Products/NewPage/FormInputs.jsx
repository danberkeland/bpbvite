// Current solution for coding form inputs dynamically, while still allowing for
// customization when needed.  This puts yet more emphasis on the yup schema
// as the central configuration space for the form.

// We will cook up some default form inputs based on the data type, but we also 
// want a way to call up custom inputs with custom behaviors when needed. This
// mirrors our process for customizing table templates, but in here we cannot
// produce a singular, catch-all input component.

// We try to standardize the arguments for each input component to simplify
// mapping fields to inputs.


import { ToggleButton } from "primereact/togglebutton"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { InputNumber } from "primereact/inputnumber"
import { flatten } from "lodash"
import { MultiSelect } from "primereact/multiselect"
import { Checkbox } from "primereact/checkbox"

const FormikText = ({ 
  labelText, 
  field, 
  formik,
  disabled=false,
}) => {
  const errors = formik.errors[field] ? flatten([formik.errors[field]]) : []
  const touched = formik.touched[field]

  return (<div key={`form-${field}-input`} style={{minHeight: "6rem"}}>
    <label style={{display:"block", }}>
      {labelText ?? field}
      <InputText 
        id={field}
        name={field}
        value={formik.values[field]} 
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        style={{
          display: "block",
          width: "15rem", 
          marginTop: ".25rem",
          backgroundColor: "var(--bpb-orange-vibrant-020)",
        }}
        className={errors.length && touched ? "p-invalid" : ''}
        disabled={disabled}
      />
    </label>
    {(touched && errors.length) 
      ? <div>{errors.map((error, idx) => 
          <small key={`${field}-err-${idx}`} style={{display: "block"}}>{error}</small>
        )}</div>
      : null 
    }
    </div>
  )
}

const FormikTextarea = ({ 
  labelText, 
  field, 
  formik,
  disabled=false,
}) => {
  const errors = formik.errors[field]
  const touched = formik.touched[field]

  return (<div key={`form-${field}-input`} style={{minHeight: "6rem"}}>
    <label style={{display:"block", }}>
      {labelText ?? field}
      <InputTextarea 
        id={field}
        name={field}
        value={formik.values[field]} 
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        style={{
          display: "block",
          width: "15rem", 
          marginTop: ".25rem",
          backgroundColor: "var(--bpb-orange-vibrant-020)"
        }} 
        className={errors && touched ? "p-invalid" : ''}
        autoResize={true}
        disabled={disabled}
      />
    </label>
      {(touched && errors) && <small>{errors}</small>}
    </div>
  )
}

const FormikNumber = ({ 
  labelText, 
  field, 
  formik,
  disabled=false,
}) => {
  const errors = formik.errors[field]
  const touched = formik.touched[field]

  return (<div key={`form-${field}-input`} style={{minHeight: "6rem"}}>
    <label style={{display:"block", }}>
      {labelText ?? field}
      <InputNumber 
        inputId={field}
        name={field}
        value={formik.values[field]} 
        maxFractionDigits={2}
        onChange={e => formik.setFieldValue(field, e.value)}
        onBlur={formik.handleBlur}
        style={{
          display: "block",
          width: "15rem", 
          marginTop: ".25rem",
        }} 
        inputStyle={{backgroundColor: "var(--bpb-orange-vibrant-020)"}}
        className={errors && touched ? "p-invalid" : ''}
        disabled={disabled}
      />
    </label>
    {(touched && errors) && <small>{errors}</small>}
    </div>
  )
}

const FormikBoolean = ({ 
  labelText, 
  field, 
  formik,
  onChange,
  disabled=false,
}) => {
  const errors = formik.errors[field]
  const touched = formik.touched[field]

  return (<div key={`form-${field}-input`} style={{height: "4rem"}}>
    <label style={{
      display:"flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      maxWidth: "15rem"
    }}>
      {labelText ?? field}
      <ToggleButton 
        id={field}
        name={field}
        checked={formik.values[field]} 
        onChange={e => (typeof onChange === 'function')
          ? onChange(e)
          : formik.setFieldValue(field, e.value)
        }
        //onBlur={formik.handleBlur}
        style={{
          display: "block",
          width: "5rem", 
          marginTop: ".25rem"
        }} 
        className={errors && touched ? "p-invalid" : ''}
        autoResize
        disabled={disabled}
      />
    </label>
    {(touched && errors) && <small>{errors}</small>}
    </div>
  )
}

const FormikSingleOption = ({ 
  labelText, 
  field, 
  formik,
  onChange,
  options,
  disabled=false,
}) => {
  const errors = formik.errors[field]
  const touched = formik.touched[field]

  return (
    <div key={`form-${field}-input`} style={{minHeight: "6rem"}}>
      <label style={{display:"block", }}>
        {labelText ?? field}
        <div>
          <Dropdown 
            inputId={field}
            name={field}
            value={formik.values[field]} 
            options={options}
            onChange={e => (typeof onChange === 'function')
              ? onChange(e)
              : formik.setFieldValue(field, e.value)
            }
            onBlur={formik.handleBlur}
            style={{
              backgroundColor: "var(--bpb-orange-vibrant-020)",
              width: "15rem", 
              marginTop: ".25rem"
            }} 
            className={errors && touched ? "p-invalid" : ''}
            disabled={disabled}
          />
        </div>
      </label>
      {(touched && errors) && <small>{errors}</small>}
    </div>
  )
}

const FormikMultiOption = ({
  labelText, 
  field, 
  formik,
  onChange,
  options,
  disabled=false,
}) => {
  const errors = formik.errors[field]
  const touched = formik.touched[field]

  return (
    <div key={`form-${field}-input`} style={{minHeight: "6rem"}}>
      <label style={{display:"block", }}>
        {labelText ?? field}
        <div>
          <MultiSelect 
            inputId={field}
            name={field}
            value={formik.values[field]} 
            options={options}
            onChange={e => (typeof onChange === 'function')
              ? onChange(e)
              : formik.setFieldValue(field, e.value)
            }
            onBlur={formik.handleBlur}
            style={{
              backgroundColor: "var(--bpb-orange-vibrant-020)",
              width: "16rem", 
              marginTop: ".25rem"
            }} 
            className={errors && touched ? "p-invalid" : ''}
            display="chip"
            disabled={disabled}
          />
        </div>
      </label>
      {(touched && errors) && <small>{errors}</small>}
    </div>
  )
}

const FormikDaysAvailable = ({
  labelText, 
  field, 
  formik,
  // onChange,
  disabled=false,
}) => {
  const errors = formik.errors[field]
  const touched = formik.touched[field]
  
  const value = formik.values[field] ?? [1,1,1,1,1,1,1]

  return (
    <div key={`form-${field}-input`} style={{minHeight: "6rem"}}>
      <div style={{display:"block"}}>
        {labelText ?? field}
        <div style={{
          width: "15rem", 
          display: "flex", 
          justifyContent: "space-between",
          backgroundColor: "var(--bpb-orange-vibrant-020)",
          marginTop: ".25rem",
          padding: ".2rem .5rem",
          border: "solid 1px var(--bpb-surface-content-border)",
          borderRadius: "4px",
        }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((W, idx) => {

            return (
              <div>
                <label
                  htmlFor={`${field}-${idx}`} 
                  style={{
                    display: "block",
                    textAlign: "center",
                    opacity: !!value[idx] ? '' : ".375"
                  }}
                >
                  {W}
                </label>
                <Checkbox 
                  inputId={`${field}-${idx}`}
                  name={field}
                  checked={!!value[idx]}
                  onChange={e => {
                    formik.setFieldValue(
                      field, 
                      Object.assign([...value], { [idx]: e.checked })
                    )
                  }}
                  disabled={disabled}
                />
              </div>
            )
          })}
        </div>
      </div>
      {(touched && errors) && <small>{errors}</small>}
    </div>
  )
}

export const formInputs = {
  'default': () => <span>Error</span>,
  'string': FormikText,
  'longString': FormikTextarea,
  'number': FormikNumber,
  'boolean': FormikBoolean,
  'singleSelect': FormikSingleOption,
  'multiSelect': FormikMultiOption,
  'daysAvailable': FormikDaysAvailable,
}