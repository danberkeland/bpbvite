import { TabView, TabPanel } from "primereact/tabview"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { Badge } from "primereact/badge"
import { Toast } from "primereact/toast"

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
import { isEqual, pickBy, sortBy, truncate } from "lodash"
import { checkQBValidation_v2 } from "../../../data/QBHelpers"

import axios from "axios"
import { useSettingsStore } from "../../../Contexts/SettingsZustand"
import { useRef } from "react"

const termsOptions = ["0", "15", "30"]
const invoicingOptions = [
  "daily", 
  // "weekly", not supported at the moment 
  "no invoice"
]
const fulfillmentOptions = (zoneNick) => ["atownpick", "slopick"].includes(zoneNick)
  ? [
    { label: "(auto)", value: "" },
    { label: "atownpick", value: "atownpick" },
    { label: "slopick", value: "slopick" },
  ]
  : [
    { label: "(auto)", value: "" },
    { label: "deliv", value: "deliv" },
    { label: "atownpick", value: "atownpick" },
    { label: "slopick", value: "slopick" },
  ]

const categories = {
  Id: ['locNick', 'locName'],
  Address: ['addr1', 'addr2', 'city', 'zip'],
  Contact: ['firstName', 'lastName', 'phone', 'email'],
  Billing: ['qbID', 'invoicing', 'terms', 'toBeEmailed', 'toBePrinted', 'printDuplicate'],
  Fulfillment: ['zoneNick', 'dfFulfill', 'latestFirstDeliv', 'latestFinalDeliv', 'delivOrder'],
}



export const LocationForm = ({ editMode, rowData, show, setShow }) => {

  const isLoading = useSettingsStore((state) => state.isLoading)
  const setIsLoading = useSettingsStore((state) => state.setIsLoading)
  const toastRef = useRef()

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
        createLocation({ 
          values, 
          locationCache,
          setIsLoading,
          toastRef,
        })
      }
      if (editMode === 'update') {
        updateLocation({ 
          values, 
          initialValues:rowData, 
          schema, 
          locationCache,
          setIsLoading,
          toastRef,
        })
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
        console.log(schema.describe())
      }
    }>
      {editMode === 'update'? rowData.locName : 'Create New Location'}
    </div>
  
  const dialogFooter = () => <div>
    <Button 
      label={(formik.isSubmitting || isLoading) ? "Submitting..." : "Submit"}
      type="submit" 
      form="location-form"
      onClick={formik.handleSubmit}
      disabled={
        isLoading
        || Object.keys(schema.describe().fields)
            .every(field => isEqual(rowData[field], formik.values[field]))
      }
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
      <Toast ref={toastRef} />
    </Dialog>
  )
}



const qbFields = 
  ['qbId', 'locName', 'email', 'phone', 'addr1', 'addr2', 'city', 'zip']


const createLocation = async ({ 
  values:rawValues, 
  locationCache, 
  setIsLoading,
  toastRef,
}) => {
  const { submitMutations, updateLocalData } = locationCache
  setIsLoading(true)
  const values = cleanLocationValues(rawValues)
  console.log("Form Values:", JSON.stringify(values, null, 2))

  // submit to QB
  const accessToken = await checkQBValidation_v2()
  console.log("accessToken:", truncate(accessToken, { length: 15 }))

  const qbResp = await createQBLocation({ values, accessToken })
  console.log("qbResp:", qbResp)

  if (!qbResp?.data) {
    console.warn("Item not created in QB successfully.")
    toastRef.current.show({
      severity: 'warn',
      summary: "QB Error",
      details: "Item not created successfully"
    })
  } else {
    toastRef.current.show({
      severity: 'success',
      summary: "Created QB Item",
    })
  }

  // submit to AppSync
  const gqlResp = await submitMutations({ 
    createInputs: [{ ...values, qbID: qbResp.data }] }
  )
  updateLocalData(gqlResp)

  if (gqlResp.errors.length) {
    toastRef.current.show({
      severity: 'warn',
      summary: "GraphQL Error",
      details: "Item not created successfully"
    })
  } else {
    toastRef.current.show({
      severity: 'success',
      summary: "Created AppSync Item",
    })
  }

  setIsLoading(false)
}

const updateLocation = async ({ 
  values:rawValues, 
  initialValues, 
  schema, 
  locationCache,
  setIsLoading,
  toastRef
}) => {
  const { submitMutations, updateLocalData } = locationCache
  setIsLoading(true)
  const values = cleanLocationValues(rawValues)
  console.log("Form Values:", JSON.stringify(values, null, 2))

  const updateValues = pickBy(values, (v, k) => {

    return k === 'locNick' || (
        Object.keys(schema.fields).includes(k) 
        && (values[k] !== initialValues[k])
      )
  })

  const qbUpdateValues = pickBy(values, (v, k) => {

    return k === 'qbID' || (
        qbFields.includes(k) 
        && (values[k] !== initialValues[k])
      )
  })

  if (Object.keys(qbUpdateValues).length > 1) {

    const qbIdIsValid = /^[1-9][0-9]*$/.test(values.qbID)

    if (qbIdIsValid) {
      console.log(
        "Changes to submit to QB:", 
        JSON.stringify(qbUpdateValues, null, 2)
      )

      const accessToken = await checkQBValidation_v2()
      console.log("accessToken:", truncate(accessToken, { length: 15 }))
  
      const SyncToken = await getSyncToken({ qbID: values.qbID, accessToken })
      console.log('SyncToken:', SyncToken)
  
      const qbResp = await updateQBLocation({ values, SyncToken, accessToken })
      console.log("qbResp:", qbResp)

      if (!qbResp?.data) {
        console.warn("Item not created in QB successfully.")
        toastRef.current.show({
          severity: 'warn',
          summary: "QB Error",
          details: "Item not updated successfully"
        })
      } else {
        toastRef.current.show({
          severity: 'success',
          summary: "Updated QB Item",
        })
      }
  
    } else {
      console.error("Cannot submit to QB")
      alert(`Warning: malformed qbID.\n\nData will only be submitted to AppSync.`)

    }

  } else {
    console.log("Nothing to submit to QB")

  }

  if (Object.keys(updateValues).length > 1) {
    console.log(
      "Changes to submit to AppSync:", 
      JSON.stringify(updateValues, null, 2)
    )
    const gqlResp = await submitMutations({ 
      updateInputs: [updateValues] 
    })
    updateLocalData(gqlResp)

    if (gqlResp.errors.length) {
      toastRef.current.show({
        severity: 'warn',
        summary: "GraphQL Error",
        details: "Item not updated successfully"
      })
    } else {
      toastRef.current.show({
        severity: 'success',
        summary: "Updated AppSync Item",
      })
    }

  } else {
    console.log("Nothing to submit to AppSync")

  }

  setIsLoading(false)  
}


const buildQBLocationItem = ({ locationValues:L, SyncToken="0" }) => {
  let itemInfo =  {
    FullyQualifiedName: L.locName,
    PrimaryEmailAddr: {
      Address: L.email,
    },
    DisplayName: L.locName,
    PrimaryPhone: {
      FreeFormNumber: L.phone,
    },
    CompanyName: L.locName,
    BillAddr: {
      CountrySubDivisionCode: "CA",
      City: L.city,
      PostalCode: L.zip,
      Line1: L.addr1,
      Line2: L.addr2,

      Country: "USA",
    },
    sparse: false,
    SyncToken,
  }

  if (!!L.qbID) {
    itemInfo.Id = L.qbID
  }

  return itemInfo
}

/**
 * Full item update as opposed to sparse update. 
 * 
 * Returned response object contains qbID in response.data
 * Should return undefined if the fetch encounters an error
 */
const submitFullToQB = async ({ itemType, itemInfo, accessCode }) => {
  const url = "https://brzqs4z7y3.execute-api.us-east-2.amazonaws.com/done"
  const requestData = { itemType, itemInfo, accessCode }

  const qbResponse = axios.post(url, requestData)
    .catch(err => {
      console.error("Error creating Location")
      console.log(err)
      return undefined
    })
  
  return qbResponse
}


const updateQBLocation = async ({ values, SyncToken, accessToken }) => {

  const itemInfo = buildQBLocationItem({ locationValues: values, SyncToken })
  const accessCode = "Bearer " + accessToken
  return submitFullToQB({ itemType: "Customer", itemInfo, accessCode })
}


/**values.qbID should be falsy ("", null, undefined, ...) */
const createQBLocation = async ({ values, accessToken }) => {
  if (!!values.qbID) {
    console.warn("values.qbID should be falsy")
  } 

  const itemInfo = buildQBLocationItem({ 
    locationValues: values, 
    SyncToken: "0" // ensures existing records cannot be overwritten
  })
  const accessCode = "Bearer " + accessToken
  return submitFullToQB({ itemType: "Customer", itemInfo, accessCode })
}


const getSyncToken = async ({ qbID, accessToken }) => {
  const url = "https://sntijvwmv6.execute-api.us-east-2.amazonaws.com/done"

  const requestData = { 
    itemType: "Customer", 
    itemInfo: qbID, 
    accessCode: "Bearer " + accessToken,
  }

  const SyncToken = axios.post(url, requestData)
    .then((response) => {
      return response.data
    })
    .catch(err => {
      console.error("Error creating Item ")
      console.log(err)
    })

  return SyncToken
}