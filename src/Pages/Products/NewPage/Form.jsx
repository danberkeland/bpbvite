import { TabView, TabPanel } from "primereact/tabview"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { Badge } from "primereact/badge"

// import { 
//   FormikText, 
//   FormikTextarea,
//   FormikNumber,
//   FormikBoolean,
//   FormikDropdown,
// } from "./FormInputs"

// import { useFormik } from "formik"
// import { cleanLocationValues, defaultLocation, useLocationSchema, validateWithContext } from "./schema"

// import { useListData } from "../../../data/_listData"
// import { isEqual, pickBy, sortBy, truncate } from "lodash"
// import { checkQBValidation_v2 } from "../../../helpers/QBHelpers"

// import axios from "axios"
// import { useSettingsStore } from "../../../Contexts/SettingsZustand"

export const ProductForm =({initialValues, schema, show, setShow, setEditMode}) => {



  return (
    <Dialog
      visible={show}
      onHide={() => {
        setShow(false)
        setEditMode('')
      }}
    >
      <pre>{JSON.stringify(initialValues, null, 2)}</pre>
    </Dialog>
  )
}