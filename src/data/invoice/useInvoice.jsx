import useSWR from "swr"
import { QB2 } from "../qbApiFunctions"
import { defaultSwrOptions } from "../_constants"

/**
 * @param {Object} input
 * @param {string} input.TxnDate 
 * @param {boolean} [input.shouldFetch=true]
 */
export const useInvoiceSummaryByDate = ({ TxnDate, shouldFetch=true }) => {

  const key = shouldFetch ? ["qb-gateway/invoices/query/by-date", TxnDate] : null
  const fetcher = ([_key, TxnDate]) => QB2.invoice.query.byTxnDate(TxnDate)
  
  const cache = useSWR(
    key, 
    fetcher, 
    { ...defaultSwrOptions, shouldRetryOnError: true }
  )

  const castToQueryItem = resp => {
    // console.log("response:", resp)
    const { 
      Id, 
      DocNumber, 
      SyncToken, 
      EmailStatus, 
      CustomerRef, 
      MetaData 
    } = resp.data.Invoice

    return { 
      Id, 
      DocNumber, 
      SyncToken, 
      EmailStatus, 
      "CustomerRef.value": CustomerRef.value, 
      "MetaData.LastUpdatedTime": MetaData.LastUpdatedTime 
    }

  }

  /**
   * @param {Object} args
   * @param {any | any[]} [args.created] 
   * @param {any | any[]} [args.updated] 
   * @param {any | any[]} [args.deleted]
   * @param {any | any[] | null} [args.errors] 
   * @param {any[] | undefined} [args.currentData] 
   */
  const updateLocalData = ({ created=[], updated=[], deleted=[], errors=null }) => {
    if (!!errors) {
      console.log("response had errors; aborting", errors)
    }

    const newData = { 
      C: [created].flat(), 
      U: [updated].flat(), 
      D: [deleted].flat()
    }

    cache.mutate(
      newData, 
      {
        revalidate: false,
        populateCache: (newData, currentData) => structuredClone(currentData)
          .filter(item => (newData.D.find(d => d.Id === item.Id) === undefined))
          .map(item => (newData.U.find(u => u.Id === item.Id) ?? item))
          .concat(newData.C)
      }
    )

  }

  const updateItem = Invoice => QB2.invoice
    .update(Invoice)
    .then(response => {
      return { updated: castToQueryItem(response), errors: null }
    })
    .catch(e => ({ errors: e }))

  const createItem = Invoice => QB2.invoice
    .create(Invoice)
    .then(response => {
      return { created: castToQueryItem(response), errors: null }
    })
    .catch(e => ({ errors: e }))
    
  const deleteItem = ({ Id, SyncToken }) => QB2.invoice
    .delete({ Id, SyncToken })
    .then(response => {
      return { deleted: { Id: response.data.Invoice.Id }, errors: null }
    })
    .catch(e => ({ errors: e }))

  const sendEmail = ({ Id }) => QB2.invoice
    .sendEmail({ Id })
    .then(response => {
      return { updated: castToQueryItem(response), errors: null }
    })
    .catch(e => ({ errors: e }))

  return { 
    ...cache, 
    createItem, 
    updateItem, 
    deleteItem,
    sendEmail,
    updateLocalData,
  }

}