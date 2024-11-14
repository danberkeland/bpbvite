import axios from "axios"
// import { API, graphqlOperation } from "aws-amplify"
// import { getInfoQBAuth } from "../graphql/queries"

const qbEndpoints = {
  getAccessToken: "https://28ue1wrzng.execute-api.us-east-2.amazonaws.com/done",
  get:            "https://unfaeakk8g.execute-api.us-east-2.amazonaws.com/done",
  create:         "https://9u7sp5khrc.execute-api.us-east-2.amazonaws.com/done",
  delete:         "https://63m47lgp1b.execute-api.us-east-2.amazonaws.com/done",
  getPdf:         "https://47i7i665dd.execute-api.us-east-2.amazonaws.com/done",
  sendEmail:      "https://uhjpmnpz12.execute-api.us-east-2.amazonaws.com/emailQBInvoice",
  qbGateway:      "https://hh4pyky7ph.execute-api.us-east-2.amazonaws.com",
}

const alertMsg =
`App needs to sign into QuickBooks again to fetch invoice data.
Requires a QuickBooks admin (Dan) to log in. 
You will be directed to the login page now.`
/**
 * @returns {Promise<string|undefined>}
 */
const getAccessToken = () => axios.get(qbEndpoints.getAccessToken)
  .then(response => {
    if (!response) throw new Error("QB Auth not valid")
    // console.log("API GATEWAY RESPONSE:", response)

    const authUri = response?.data?.body?.authUri
    if (!!authUri && response?.data?.statusCode === 301) {
      console.warn("NEED LOGIN")
      console.log(authUri)
      alert(alertMsg)
      window.location.href = authUri
    }

    return response.data.body.accessToken
    // return API.graphql(graphqlOperation(getInfoQBAuth, { id: "accessToken" }))

  })
  .catch(err => {
    console.error(err)
    return undefined
  })
  // .then(gqlResponse => gqlResponse.data.getInfoQBAuth.infoContent)

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


/**
 * @param {Object} input
 * @param {string} input.authUri - This uri is generated by the redirect after logging in with QB.
 * @returns 
 */
const completeAuthFlow = ({ authUri }) => axios.post(
  qbEndpoints.qbGateway + "/complete-auth-flow",
  { authUri }
)

// functions to reduce code in batch routines, but also to standardize inputs.
export const QB = {
  getAccessToken,
  completeAuthFlow,
  invoice: {
    get: getInvoice,
    create: createInvoice,
    delete: deleteInvoice,
    getPdf: getPdf,
    getPdfByDocNumber: getPdfByDocNumber,
    sendEmail: sendEmail,
  }
}

//  v2
// ****

const getToken = () => axios
  .post(qbEndpoints.qbGateway + "/token")
  .then(r => r.data)

const getPdf2 = ({ Id }) => axios
  .post(qbEndpoints.qbGateway + "/invoices/get-pdf", { Id })
  .then(r => r.data)

const queryByDocNumber = DocNumber => axios
  .post(qbEndpoints.qbGateway + "/invoices/query/by-doc-number", { DocNumber })
  .then(r => r.data)


// /**
//  * @typedef {Object} InvoiceQueryItem
//  * @property {string} [Id]
//  * @property {string} [DocNumber]
//  * @property {string} [SyncToken]
//  * @property {string} [EmailStatus]
//  * @property {string} [CustomerRef.value]
//  * @property {string} [Metadata.LastUpdatedTime]
//  * 
//  */

/**
 * @typedef {{
 *  ['Id']:string, 
 *  ['DocNumber']:string,
 *  ['SyncToken']:string,
 *  ['EmailStatus']:string,
 *  ['CustomerRef.value']:string,
 *  ['Metadata.LastUpdatedTime']:string,
 * }} InvoiceQueryItem
 */

/** 
 * Lambda returns data in a lightly compressed format, suitable for "flat" objects. 
 * 
 * Instead of an array of objects, e.g. [{ k1: a1, k2: a2 }, { k1: b1, k2: b2 }, ...]
 * 
 * we return [[k1, k2], [a1, a2], [b1, b2], ...], where object keys are defined in the first array,
 * and values for each item are placed at the corresponding index in the following arrays. For long
 * lists with verbose keys, this saves many redundant bytes of text.
 * 
 * @param {string} TxnDate
*/
const queryByTxnDate = TxnDate => axios
  .post(qbEndpoints.qbGateway + "/invoices/query/by-date", { TxnDate })
  .then(resp => {
    const [keys, ...items] = resp.data

    /** @type {InvoiceQueryItem[]} */
    const data = items.map(item => Object.assign({}, ...keys.map((_, idx) => ({ [keys[idx]]: item[idx] }))))
    return data
    // return items.length
    //   ? items.map(item => Object.assign({}, ...keys.map((_, idx) => ({ [keys[idx]]: item[idx] }))))
    //   : []
  })

const createInvoice2 = Invoice => {
  if (Invoice.Id || Invoice.SyncToken) {
    throw new Error("Invoice should not include Id or SyncToken")
  }
  return axios.post(qbEndpoints.qbGateway + "/invoices/create", { Invoice })
}

const updateInvoice2 = Invoice => {
  if (!Invoice.Id || !Invoice.SyncToken) {
    throw new Error("Expected Id and SyncToken")
  }
  return axios.post(qbEndpoints.qbGateway + "/invoices/create", { Invoice })
}

const deleteInvoice2 = ({ Id, SyncToken }) => axios
  .post(qbEndpoints.qbGateway + "/invoices/delete", { Id, SyncToken })

const sendEmail2 = ({ Id }) => axios
  .post(qbEndpoints.qbGateway + "/invoices/send-email", { Id })

export const QB2 = {
  getToken,
  invoice: {
    query: {
      byDocNumber: queryByDocNumber,
      byTxnDate: queryByTxnDate,
    },
    getPdf: getPdf2,
    create: createInvoice2,
    update: updateInvoice2,
    delete: deleteInvoice2,
    sendEmail: sendEmail2,
  }
}