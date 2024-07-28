import axios from "axios"
import { API, graphqlOperation } from "aws-amplify"
import { getInfoQBAuth } from "../graphql/queries"

const qbEndpoints = {
  getAccessToken: "https://28ue1wrzng.execute-api.us-east-2.amazonaws.com/done",
  get:            "https://unfaeakk8g.execute-api.us-east-2.amazonaws.com/done",
  create:         "https://9u7sp5khrc.execute-api.us-east-2.amazonaws.com/done",
  delete:         "https://63m47lgp1b.execute-api.us-east-2.amazonaws.com/done",
  getPdf:         "https://47i7i665dd.execute-api.us-east-2.amazonaws.com/done",
  sendEmail:      "https://uhjpmnpz12.execute-api.us-east-2.amazonaws.com/emailQBInvoice"
}

/**
 * @returns {Promise<string|undefined>}
 */
const getAccessToken = () => axios.get(qbEndpoints.getAccessToken)
  .then(response => {
    if (!response) throw new Error("QB Auth not valid")
  
    return API.graphql(graphqlOperation(getInfoQBAuth, { id: "accessToken" }))
  })
  .then(gqlResponse => gqlResponse.data.getInfoQBAuth.infoContent)
  .catch(err => {
    console.error(err)
    return undefined
  })

/**
 * @param {Object} input
 * @param {string} input.DocNumber - ex: '08152023high'
 * @param {string} input.accessToken 
 * @returns 
 */
const getInvoice = ({ DocNumber, accessToken }) => axios.post(       
    qbEndpoints.get, 
    { doc: DocNumber, accessCode: "Bearer " + accessToken }
  )

/**
 * @param {Object} input
 * @param {Object} input.invoice
 * @param {string} input.accessToken  
 * @returns 
 */
const createInvoice = ({ invoice, accessToken }) => axios.post(
    qbEndpoints.create, 
    { invInfo: invoice, accessCode: "Bearer " + accessToken }
  )

/**
 * @param {Object} input
 * @param {string} input.Id - InvoiceId
 * @param {string} input.SyncToken
 * @param {string} input.accessToken  
 * @returns 
 */
const deleteInvoice = ({ Id, SyncToken, accessToken }) => axios.post(
  qbEndpoints.delete, 
  { invInfo: { Id, SyncToken }, accessCode: "Bearer " + accessToken }
)

/**
 * @param {Object} input
 * @param {string} input.CustomerId - in our system, a locations qbID value
 * @param {string} input.delivDate - 'yyyy-MM-dd' formatted date string
 * @param {string} input.accessToken
 * @returns 
 */
const getPdf = ({ CustomerId, delivDate, accessToken }) => axios.post(
  qbEndpoints.getPdf, 
  { 
    accessCode: "Bearer " + accessToken, 
    delivDate, 
    custID: CustomerId 
  }
)

const getPdfByDocNumber = ({ CustomerRef, DocNumber, accessToken }) => axios.post(
  qbEndpoints.getPdf,
  {
    accessToken: "Bearer " + accessToken,
    CustomerRef,
    DocNumber,
  }
)


/**
 * @param {Object} input
 * @param {string} input.InvoiceId - found in a retrieved invoices .Id value
 * @param {string} input.accessToken  
 * @returns 
 */
const sendEmail = ({ InvoiceId, accessToken }) => axios.post(
  qbEndpoints.sendEmail, 
  { accessCode: "Bearer " + accessToken, docNum: InvoiceId } // "docNum" is misleading; it's actually the invoice's id.
)

// functions to reduce code in batch routines, but also to standardize inputs.
export const QB = {
  getAccessToken,
  invoice: {
    get: getInvoice,
    create: createInvoice,
    delete: deleteInvoice,
    getPdf: getPdf,
    getPdfByDocNumber: getPdfByDocNumber,
    sendEmail: sendEmail,
  }
}