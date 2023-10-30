import { TabView, TabPanel } from "primereact/tabview"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { Badge } from "primereact/badge"
import { ScrollPanel } from "primereact/scrollpanel"

import { 
  FormikText, 
  FormikTextarea,
  FormikNumber,
  FormikBoolean,
  FormikDropdown,
} from "./FormInputs"

import { useFormik } from "formik"
import { validateWithContext } from "./schema"

import { useSettingsStore } from "../../../Contexts/SettingsZustand"
import { useListData } from "../../../data/_listData"
import { checkQBValidation_v2 } from "../../../helpers/QBHelpers"

import axios from "axios"
import { formInputs } from "./FormInputs"

export const ProductForm =({
  initialValues, 
  schema, 
  schemaDescription,
  fieldsByCategory,
  show, setShow, 
  editMode, setEditMode
}) => {
  // const isLoading = useSettingsStore((state) => state.isLoading)
  // const setIsLoading = useSettingsStore((state) => state.setIsLoading)

  const formik = useFormik({
    initialValues,
    validate: values => validateWithContext(schema, values, { editMode }),
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: () => {console.log("Submitting...")}
  })

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

  return (
    <Dialog
      header={editMode === 'create' 
        ? 'Create New Product' 
        : initialValues.prodName
      }
      visible={show}
      onHide={() => {
        setShow(false)
        setEditMode('')
      }}
      // style={{height: "50rem"}}
    >
      <form id="location-form" onSubmit={formik.handleSubmit}>
      <TabView 
        scrollable 
        style={{maxWidth: "31rem"}}
      >
        {Object.keys(fieldsByCategory).map(categoryKey => {
          
          return (
            <TabPanel 
              header={tabHeaderTemplate(categoryKey)}
              key={`form-${categoryKey}-panel`} 
            >
              <ScrollPanel style={{height: "45rem"}}>
              {/* {fieldsByCategory[categoryKey].map(field => {
                return <div key={`form-field-${field}`}>{field}: {initialValues[field]}</div>
              })} */}
              {fieldsByCategory[categoryKey].map(field => {
                const fieldDescription = schemaDescription.fields[field]
                const FormikInput = formInputs[field]                // input made specifically for this field
                  ?? formInputs[fieldDescription.meta?.input?.name]  // for fields that want to use an alternate input, eg textarea instead of text
                  ?? formInputs[fieldDescription.type]               // the "usual" input field based on data type
                  ?? formInputs['default']                           // something wasn't set up correctly; display "Error"

                const disabled = 
                  (fieldDescription.meta?.input?.disableWhen ?? []).includes(editMode)

                return (
                  <FormikInput 
                    field={field} 
                    formik={formik}
                    disabled={disabled}
                    // options={fieldDescription.meta?.input?.props?.options}
                    {...fieldDescription.meta?.input?.props}
                  />
                )
              })}
            </ScrollPanel>
            </TabPanel>
          )
        })}
      </TabView>
      </form>
    </Dialog>
  )
}



