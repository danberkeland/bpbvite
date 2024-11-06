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

  const mergeResponseData = resp => {
    console.log("response:", resp)
    const { 
      Id, 
      DocNumber, 
      SyncToken, 
      EmailStatus, 
      CustomerRef, 
      MetaData 
    } = resp.data.Invoice

    const newItem = { 
      Id, 
      DocNumber, 
      SyncToken, 
      EmailStatus, 
      "CustomerRef.value": CustomerRef.value, 
      "MetaData.LastUpdatedTime": MetaData.LastUpdatedTime 
    }

    let newData = [...cache.data]
    const prevItemIdx = cache?.data?.findIndex(item => item.DocNumber === newItem.DocNumber)
    if (prevItemIdx >= 0) {
      console.log("match found at idx " + prevItemIdx)
      newData[prevItemIdx] = newItem
    } else {
      console.log("appending new data")
      newData = newData.concat([newItem])
    }

    cache.mutate(newData, { revalidate: false })
    return {
      data: newItem,
      errors: null,
    }
  }

  const updateItem = Invoice => QB2.invoice
    .update(Invoice)
    .then(mergeResponseData)
    .catch(e => ({ data: null, errors: e }))

  const createItem = Invoice => QB2.invoice
    .create(Invoice)
    .then(mergeResponseData)
    .catch(e => ({ data: null, errors: e }))
    
  const deleteItem = ({ Id, SyncToken }) => QB2.invoice
    .delete({ Id, SyncToken })
    .then(resp => {
      console.log("response:", resp)
     
      cache.mutate(
        cache.data.filter(item => item.Id != resp.data.Invoice.Id), 
        { revalidate: false }
      )
      return {
        data: { Id },
        errors: null
      }
    })
    .catch(e => ({ data: null, errors: e }))

  return { ...cache, createItem, updateItem, deleteItem }

}