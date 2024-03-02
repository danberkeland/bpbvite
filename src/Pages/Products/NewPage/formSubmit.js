import { checkQBValidation_v2 } from "../../../data/QBHelpers"

import axios from "axios"
import { truncate, isEqual, pickBy } from "lodash/fp"

const pickByWithKey = pickBy.convert({ 'cap': false })



export const createProduct = async ({
  values,
  // initialValues,
  listDataCache,
  toastRef,
}) => {
  // console.log(values)

  // submit to QB
  const accessToken = await checkQBValidation_v2()
  console.log("accessToken:", truncate(accessToken, { length: 15 }))

  const itemType = 'Item'
  const itemInfo = {
    // Id: "", No id submitted on create
    Name: values.prodName,
    Active: true,
    FullyQualifiedName: values.prodName,
    Taxable: false,
    UnitPrice: values.wholePrice,
    Type: "Service",
    IncomeAccountRef: {
      value: "56",
      name: "Uncategorized Income",
    },
    PurchaseCost: 0,
    ExpenseAccountRef: {
      value: "57",
      name: "Outside Expense",
    },
    TrackQtyOnHand: false,
    domain: "QBO",
    sparse: false,
    SyncToken: "0",
  }

  const qbResp = await submitFullToQB({ accessToken, itemType, itemInfo })
  console.log("QB Response:", qbResp)

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

  const { createdAt, updatedAt, ...createAttributes } = values

  const createInputs = [{ ...createAttributes, qbID: qbResp?.data ?? "error" }]
  
  const gqlResp = await listDataCache.submitMutations({ createInputs })
  listDataCache.updateLocalData(gqlResp)
 
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

}




export const updateProduct = async ({
  values,
  initialValues,
  listDataCache,
  toastRef
}) => {

  const fieldHasChanged = (field) => 
    !isEqual(initialValues[field])(values[field])

  const changedValues = pickByWithKey((_, fieldKey) => 
    fieldHasChanged(fieldKey)
  )(values)
  
  const qbUpdateFields = ['prodName', 'wholePrice']
  const qbFieldHasChanges = Object.keys(changedValues).some(field => 
    qbUpdateFields.includes(field)
  )

  if (qbFieldHasChanges) {
    // submit to QB
    const itemType = 'Item'

    const accessToken = await checkQBValidation_v2()
    console.log("accessToken:", truncate({ length: 16 })(accessToken))

    const SyncToken = await getSyncToken({ 
      itemType,
      qbID: values.qbID, 
      accessToken 
    })
    console.log('SyncToken:', SyncToken)

    if (!!SyncToken && Number(values.qbID) > 0) {
      const itemInfo = {
        Id: values.qbID,
        Name: values.prodName,
        Active: true,
        FullyQualifiedName: values.prodName,
        Taxable: false,
        UnitPrice: values.wholePrice,
        Type: "Service",
        IncomeAccountRef: {
          value: "56",
          name: "Uncategorized Income",
        },
        PurchaseCost: 0,
        ExpenseAccountRef: {
          value: "57",
          name: "Outside Expense",
        },
        TrackQtyOnHand: false,
        domain: "QBO",
        sparse: false,
        SyncToken: SyncToken
      }

      const qbResp = await submitFullToQB({ 
        itemType, 
        itemInfo, 
        accessToken 
      })

      console.log("QB Response:", qbResp)

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
      if (!SyncToken) {
        console.warn("Could not fetch sync token; submit to QB cancelled")
      } 
      if (!(Number(values.qbID) > 0)) {
        console.warn("Malformed qbID; submit to QB cancelled", values.qbID)
      }
    }
  } else {
    console.log("Nothing to submit to QB")
  }

  const { createdAt, updatedAt, ...gqlSubmitValues } = changedValues

  if (Object.keys(gqlSubmitValues).length) {
    const { prodNick } = initialValues
    const updateInputs = [{ prodNick, ...gqlSubmitValues }]
    console.log("Submitting to AppSync:", updateInputs)

    const gqlResp = await listDataCache.submitMutations({ updateInputs })
    listDataCache.updateLocalData(gqlResp)

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

  
}



/**Valid itemTypes are 'Item' for products, 'Customer' for locations */
const getSyncToken = async ({ 
  itemType,
  qbID, 
  accessToken 
}) => {
  const url = "https://sntijvwmv6.execute-api.us-east-2.amazonaws.com/done"
  const requestData = { 
    itemType: itemType, 
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
      return undefined
    })

  return SyncToken
}



/**
 * "Full" item update as opposed to sparse update. 
 * 
 * Returned response object contains qbID in response.data
 * Should return undefined if the fetch encounters an error
 * 
 * Valid itemTypes are 'Item' for products, 'Customer' for locations
 */
const submitFullToQB = async ({ itemType, itemInfo, accessToken }) => {
  const url = "https://brzqs4z7y3.execute-api.us-east-2.amazonaws.com/done"
  const requestData = { 
    itemType, 
    itemInfo, 
    accessCode: 'Bearer ' + accessToken 
  }

  const qbResponse = axios.post(url, requestData)
    .catch(err => {
      console.error(`Error creating ${itemType}`)
      console.log(err)
      return undefined
    })
  
  return qbResponse
}