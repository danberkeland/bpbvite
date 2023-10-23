import { TabView, TabPanel } from "primereact/tabview"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { Badge } from "primereact/badge"

import { 
  FormikText, 
  FormikTextarea,
  FormikNumber,
  FormikBoolean,
  FormikDropdown,
} from "./FormInputs"

import { useFormik } from "formik"
import { cleanLocationValues, defaultLocation, useLocationSchema, validateWithContext } from "./schema"

import { useListData } from "../../../data/_listData"
import { pickBy, sortBy, truncate } from "lodash"
import { checkQBValidation_v2, getQBProdSyncToken } from "../../../helpers/QBHelpers"

const termsOptions = ["0", "15", "30"]
const invoicingOptions = ["daily", "weekly", "no invoice"]
const fulfillmentOptions = (zoneNick) => ["atownpick", "slopick"].includes(zoneNick)
  ? ["atownpick", "slopick"]
  : ["deliv", "atownpick", "slopick"]

const categories = {
  Id: ['locNick', 'locName'],
  Address: ['addr1', 'addr2', 'city', 'zip'],
  Contact: ['firstName', 'lastName', 'phone', 'email'],
  Billing: ['qbID', 'invoicing', 'terms', 'toBeEmailed', 'toBePrinted', 'printDuplicate'],
  Fulfillment: ['zoneNick', 'dfFulfill', 'latestFirstDeliv', 'latestFinalDeliv', 'delivOrder'],
}

export const LocationForm = ({ editMode, rowData, show, setShow }) => {

  const locationCache = useListData({ tableName: "Location", shouldFetch: true })
  const { data:ZNE=[] } = useListData({ tableName: "Zone", shouldFetch: true})
  const zoneOptions = sortBy(ZNE.map(Z => Z.zoneNick))
  const schema = useLocationSchema({ context: { editMode }})

  const formik = useFormik({
    initialValues: editMode === 'update' ? rowData : defaultLocation,
    //validationSchema: schema,
    validate: values => validateWithContext(schema, values, { editMode }),
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: values => {
      if (editMode === 'create') {
        createLocation({ values })
      }
      if (editMode === 'update') {
        updateLocation({ values, initialValues:rowData, schema, locationCache })
      }
      formik.setSubmitting(false)
    }
  })

  const badgeTemplate = (cKey) => {
    return categories[cKey].some(field => !!formik.errors[field] && formik.touched[field]) 
      ? <>
          <span>{cKey}</span>
          <span className="p-overlay-badge">
            <Badge 
              style={{transform: "translate(120%,-50%)"}} 
              className="p-badge-sm" severity="danger" 
            />
          </span>
        </>
      : cKey
  }
  

  const dialogHeader = () => 
    <div 
      onClick={() => {
        console.log('form state:', formik.values)
        console.log('errors:', formik.errors)
      }
    }>
      {editMode === 'update'? rowData.locName : 'Create New Location'}
    </div>
  
  const dialogFooter = () => <div>
    <Button 
      label="Submit" 
      type="submit" 
      form="location-form"
      onClick={formik.handleSubmit}
      disabled={formik.isSubmitting}
    />
  </div>
  
  return (
    <Dialog 
      visible={show} 
      onHide={() => setShow(false)}
      header={dialogHeader}
      footer={dialogFooter}
      style={{height: "50rem"}}
    >
      <form id="location-form" onSubmit={formik.handleSubmit}>
      <TabView>
        <TabPanel header={badgeTemplate("Id")}>
          <FormikText formik={formik} field="locNick" labelText="locNick (Primary Key)" disabled={editMode !== 'create'} />
          <FormikText formik={formik} field="locName" labelText="locName" disabled={editMode !== 'create'} />
        </TabPanel>
        <TabPanel header={badgeTemplate("Address")}>
          <FormikText formik={formik} field="addr1" labelText="Address 1" />
          <FormikText formik={formik} field="addr2" labelText="Address 2" />
          <FormikText formik={formik} field="city"  labelText="City" />
          <FormikText formik={formik} field="zip"   labelText="Zip" />
          <FormikTextarea  formik={formik} field="gMap"  labelText="Google Maps Link" />
        </TabPanel>

        <TabPanel header={badgeTemplate("Contact")}>
          <FormikText formik={formik} field="firstName" labelText="First Name" />
          <FormikText formik={formik} field="lastName"  labelText="Last Name" />
          <FormikText formik={formik} field="phone"     labelText="Phone" />
          <FormikText formik={formik} field="email"     labelText="Email for Invoicing (max 100 chars)" />
        </TabPanel>

        <TabPanel header={badgeTemplate("Billing")}>
          <div style={{marginBlock: "1rem"}}>qbID: {truncate(formik.values.qbID, { length: "20" })}</div>
          <FormikDropdown formik={formik} field="invoicing"   labelText="Invoice Frequency" options={invoicingOptions} />
          <FormikDropdown formik={formik} field="terms"       labelText="Terms" options={termsOptions} />
          <FormikBoolean  formik={formik} field="toBeEmailed" labelText="Send Email Invoice" />
          <FormikBoolean  formik={formik} field="toBePrinted" labelText="Send Print Invoice" 
            onChange={function (e) {
                if (e.value === true) {
                  formik.setFieldValue('toBePrinted', true)
                }
                else {
                  formik.setFieldValue('toBePrinted', false)
                  formik.setFieldValue('printDuplicate', false)
                }
            }}
          />
          <FormikBoolean formik={formik} field="printDuplicate" labelText="Print Duplicate" 
            onChange={function (e) {
              if (e.value === true) {
                formik.setFieldValue('toBePrinted', true)
                formik.setFieldValue('printDuplicate', true)
              }
              else {
                formik.setFieldValue('printDuplicate', false)
              }
            }}
          />
        </TabPanel>

        <TabPanel header={badgeTemplate("Fulfillment")}>
          <FormikDropdown formik={formik} field="zoneNick" labelText="Zone" options={zoneOptions} />
          <FormikDropdown formik={formik} field="dfFulfill" labelText="Preferred Fulfillment Method" options={fulfillmentOptions(formik.values.zoneNick)} />
          <FormikNumber formik={formik} field="latestFirstDeliv" labelText="Earliest Delivery" />
          <FormikNumber formik={formik} field="latestFinalDeliv" labelText="Latest Delivery" />
          <FormikNumber formik={formik} field="delivOrder" labelText="Deliv Order" />
        </TabPanel>

      </TabView>
      </form>
    </Dialog>
  )
}



const qbFields = 
  ['qbId', 'locName', 'email', 'phone', 'addr1', 'addr2', 'city', 'zip']


const createLocation = async ({ values }) => {
  console.log(JSON.stringify(values, null, 2))

}

const updateLocation = async ({ 
  values:rawValues, 
  initialValues, 
  schema, 
  locationCache 
}) => {
  const { submitMutations, updateLocalData } = locationCache
  
  //console.log(JSON.stringify(values, null, 2))

  // cleanup routine will catch 
  const values = cleanLocationValues(rawValues)
    
  console.log("Form Values:", JSON.stringify(values, null, 2))

  const updateValues = pickBy(values, (v, k) => {
    return k ==='locNick' || (
        Object.keys(schema.fields).includes(k) 
        && (values[k] !== initialValues[k])
      )
  })

  const qbUpdateValues = pickBy(values, (v, k) => {
    return k ==='qbID' || (
        qbFields.includes(k) 
        && (values[k] !== initialValues[k])
      )
  })

  console.log(updateValues, qbUpdateValues)

  if (Object.keys(qbUpdateValues).length > 1) {

    const qbIdIsValid = /^[1-9][0-9]*$/.test(values.qbID)

    if (qbIdIsValid) {
      console.log(
        "Submitting to AppSync:", 
        JSON.stringify(qbUpdateValues, null, 2)
      )

      // const accessToken = await checkQBValidation_v2()
      // console.log("accessToken", accessToken)
  
      // const SyncToken = await getQBProdSyncToken(accessToken, values)
      // console.log('SyncToken', SyncToken)
  
      // const qbResp = await createQBLoc(values, SyncToken)
      // console.log("qbResp", qbResp)
    } else {

      console.error("Cannot submit to QB")
      alert(`Warning: invalid qbID.\n\nData will only be submitted to AppSync.`)
    }

  } else {

    console.log("Nothing to submit to QB")
  }

  if (Object.keys(updateValues).length > 1) {

    console.log("Submitting to QB:", JSON.stringify(updateValues, null, 2))
    // updateLocalData( 
    //   await submitMutations({ updateInputs: [updateValues] })
    // )
  } else {
    console.log("Nothing to submit to AppSync")
  }
  
}



const cleanSubmitValues = (values) => {
  
}