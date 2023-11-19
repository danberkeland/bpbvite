import { TabView, TabPanel } from "primereact/tabview"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { Badge } from "primereact/badge"
import { ScrollPanel } from "primereact/scrollpanel"
import { Toast } from "primereact/toast"

import { useFormik } from "formik"
import { validateWithContext } from "./schema"

import { createProduct, updateProduct } from "./formSubmit"

import { useSettingsStore } from "../../../Contexts/SettingsZustand"

import { formInputs } from "./FormInputs"
import { isEqual } from "lodash/fp"
import { useRef } from "react"

export const ProductForm =({
  initialValues, 
  schema, 
  schemaDescription,
  fieldsByCategory,
  listDataCache,
  show, setShow, 
  editMode, setEditMode
}) => {
  const isLoading = useSettingsStore((state) => state.isLoading)
  const setIsLoading = useSettingsStore((state) => state.setIsLoading)

  const toastRef = useRef()

  const formik = useFormik({
    initialValues,
    validate: values => validateWithContext(schema, values, { editMode }),
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: values => {
      if (editMode === 'create') { 
        setIsLoading(true)
        createProduct({
          values,
          // initialValues,
          listDataCache,
          toastRef,
        })

      }
      else {
        setIsLoading(true)
        updateProduct({
          values,
          initialValues,
          listDataCache,
          toastRef,
        })

      }
      formik.setSubmitting(false)
      setIsLoading(false)
    }
  })

  const formHeaderTemplate = () => {
    const formHasError = Object.keys(schemaDescription.fields).some(field =>
      !!formik.errors[field] && formik.touched[field]
    )
    const headerText = editMode === 'create' 
      ? 'Create New Product'
      : initialValues.prodName
    return (<>
      <span>{headerText}</span>
      {formHasError &&
        <span className="p-overlay-badge">
          <Badge 
            className="p-badge-sm" 
            severity="danger" 
            style={{transform: "translate(120%,-50%)"}} 
          />
        </span>
      }
    </>)

  }
  const tabHeaderTemplate = (cKey) => {
    const categoryHasError = fieldsByCategory[cKey].some(
      field => !!formik.errors[field] && formik.touched[field]
    ) 

    return (<>
      <span>{cKey}</span>
      {categoryHasError &&
        <span className="p-overlay-badge">
          <Badge 
            className="p-badge-sm" 
            severity="danger" 
            style={{transform: "translate(120%,-50%)"}} 
          />
        </span>
      }
    </>)
  }

  const dialogFooter = () => <div>
    <Button 
      label={(formik.isSubmitting || isLoading) ? "Submitting..." : "Submit"}
      type="submit" 
      form="product-form"
      onClick={formik.handleSubmit}
      disabled={isEqual(initialValues, formik.values) || isLoading}
    />
  </div>

  return (
    <Dialog
      header={formHeaderTemplate}
      footer={dialogFooter}
      visible={show}
      onHide={() => {
        setShow(false)
        setEditMode('')
      }}
      style={{height: "50rem"}}
    >
      <form id="product-form" onSubmit={formik.handleSubmit}>
      <TabView 
        scrollable 
        style={{maxWidth: "40rem"}}
      >
        {Object.keys(fieldsByCategory).map(categoryKey => {
          
          return (
            <TabPanel 
              header={tabHeaderTemplate(categoryKey)}
              key={`form-${categoryKey}-panel`} 
            >
              <ScrollPanel style={{height: "45rem"}}>
              <div style={{marginLeft: ".25rem", width: "16rem"}}>
                {fieldsByCategory[categoryKey].map(field => {
                  const fieldDescription = schemaDescription.fields[field]
                  const { type, meta } = fieldDescription
                  const FormikInput = formInputs[field]     // input made specifically for this field
                    ?? formInputs[meta?.input?.name]        // for fields that want to use an alternate input, eg textarea instead of text
                    ?? formInputs[type]                     // the "usual" input field based on data type
                    ?? formInputs['default']                // something wasn't set up correctly; display "Error"
                  const disabled = 
                    (meta?.input?.disableWhen ?? []).includes(editMode)

                  return (
                    <FormikInput 
                      key={`fmk-input-${field}`}
                      field={field} 
                      formik={formik}
                      disabled={disabled}
                      {...fieldDescription.meta?.input?.props}
                    />
                  )
                })}
              </div>
              </ScrollPanel>
            </TabPanel>
          )
        })}
      </TabView>
      </form>
      <Toast ref={toastRef} />
    </Dialog>
  )
}