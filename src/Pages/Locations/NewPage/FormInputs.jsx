import { ToggleButton } from "primereact/togglebutton"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { InputNumber } from "primereact/inputnumber"
import { flatten } from "lodash"

export const FormikText = ({ 
  labelText, 
  field, 
  formik,
  disabled,
}) => {
  const errors = formik.errors[field] ? flatten([formik.errors[field]]) : []
  const touched = formik.touched[field]

  return (<div style={{minHeight: "6rem"}}>
    <label style={{display:"block", }}>
      {labelText}
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
        sty
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

export const FormikTextarea = ({ 
  labelText, 
  field, 
  formik
}) => {
  const errors = formik.errors[field]
  const touched = formik.touched[field]

  return (<div style={{minHeight: "6rem"}}>
    <label style={{display:"block", }}>
      {labelText}
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
      />
    </label>
      {(touched && errors) && <small>{errors}</small>}
    </div>
  )
}

export const FormikNumber = ({ 
  labelText, 
  field, 
  formik
}) => {
  const errors = formik.errors[field]
  const touched = formik.touched[field]

  return (<div style={{minHeight: "6rem"}}>
    <label style={{display:"block", }}>
      {labelText}
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
      />
    </label>
    {(touched && errors) && <small>{errors}</small>}
    </div>
  )
}

/**Can override onChange with custom function*/
export const FormikBoolean = ({ 
  labelText, 
  field, 
  formik,
  onChange,
}) => {
  const errors = formik.errors[field]
  const touched = formik.touched[field]

  return (<div style={{height: "4rem"}}>
    <label style={{
      display:"flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      maxWidth: "15rem"
    }}>
      {labelText}
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
      />
    </label>
    {(touched && errors) && <small>{errors}</small>}
    </div>
  )
}

export const FormikDropdown = ({ 
  labelText, 
  field, 
  formik,
  options,
}) => {
  const errors = formik.errors[field]
  const touched = formik.touched[field]

  return (
    <div style={{minHeight: "6rem"}}>
      <label style={{display:"block", }}>
        {labelText}
        <div>
          <Dropdown 
            inputId={field}
            name={field}
            value={formik.values[field]} 
            options={options}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              backgroundColor: "var(--bpb-orange-vibrant-020)",
              width: "15rem", 
              marginTop: ".25rem"
            }} 
            className={errors && touched ? "p-invalid" : ''}
          />
        </div>
      </label>
      {(touched && errors) && <small>{errors}</small>}
    </div>
  )
}
