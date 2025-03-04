import { useMemo } from "react"
import { DT } from "../../utils/dateTimeFns"
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { DateTime } from "luxon"
import { useInvoiceSummaryByDate } from "../../data/invoice/useInvoice"
import { useLocations } from "../../data/location/useLocations"
import { compareBy, countBy, groupByArray, groupByArrayN, groupByArrayRdc, groupByObject, keyBy, uniqByRdc } from "../../utils/collectionFns"
import { maxBy, truncate } from "lodash"
import { useProducts } from "../../data/product/useProducts"
import { useLocationProductOverrides } from "../../data/locationProductOverride/useLocationProductOverrides"
import { useZones } from "../../data/zone/useZones"
import { toQBInvoiceDeliveryLineItem, toQBInvoiceHeader, toQBInvoiceLineItem } from "../../core/billing/makeInvoice2"
import { makeQbInvoice } from "../../core/billing/makeInvoice"
import { QB2 } from "../../data/qbApiFunctions"
import { downloadPDF } from "../../utils/pdf/downloadPDF"
import { useNotesByType } from "../../data/note/useNotes"
import { mapValues } from "../../utils/objectFns"
import { printGridPages } from "../../core/printing/routeGridPdfs"

export const useInvoicing2Data = ({ reportDT, isToday, isTomorrow, shouldFetch }) => {

  const { data: INV } = useInvoiceSummaryByDate({ TxnDate: reportDT.toFormat("yyyy-MM-dd"), shouldFetch })
  const { data: LOC } = useLocations({ shouldFetch: true })
  const { data: ORD } = useCombinedRoutedOrdersByDate({ 
    delivDT: reportDT, 
    showCustom: false,
    showRetailBrn: false,
    useHolding: false,
    shouldFetch,
  })
  const { data: PRD } = useProducts({ shouldFetch })
  const { data: OVR } = useLocationProductOverrides({ shouldFetch })
  const { data: ZNE } = useZones({ shouldFetch })
  const { data:NTE } = useNotesByType({ shouldFetch: isTomorrow, Type: 'packList' })

  const { 
    rows, 
    invoicesForReview, 
    toQBInvoice, 
    loadedMakeQbInvoice,
    getPdfRequestItems,
    batchGetPdfs,
    batchPrintPdfGrids,
  } = useMemo(() => {
    if (!LOC || !ORD || !INV || !PRD || !OVR || !ZNE || (isTomorrow && !NTE)) {
      return { 
        rows: [], 
        orphanedInvoices: [], 
        toQBInvoice: undefined, 
        loadedMakeQbInvoice: undefined,
        getPdfRequestItems: undefined,
        batchGetPdfs: undefined,
        batchPrintPdfGrids: undefined,
      }
    }
  
    const locations = keyBy(LOC, L => L.locNick)
    const products = keyBy(PRD, P => P.prodNick)
    const zones = keyBy(ZNE, Z => Z.zoneNick)
    const overrides = keyBy(OVR, O => `${O.locNick}#${O.prodNick}`)
    
    const ORD_wholesale = ORD.filter(O => O.isWhole)
    const invoicesById = groupByObject(INV, I => I["CustomerRef.value"])
  
    const allRows = groupByArray(ORD_wholesale, O => O.locNick)
      .flatMap(orderItemGroup => {
        const { locNick } = orderItemGroup[0]
        const location = locations[locNick]
        const zone = zones[location.zoneNick]
        const locNameDisplay = /^the /.test(location.locName.toLowerCase())
          ? location.locName.slice(4) + ", " + location.locName.slice(0, 3)
          : location.locName
        const qbID = /^\d+$/.test(location?.qbID ?? "") ? location?.qbID : "n/a"
        const nOrderItems = orderItemGroup.filter(item => item.qty !== 0).length
        const isOrderDeleted = nOrderItems === 0

        const orderLastEdited = DT.fromIsoTs(maxBy(orderItemGroup, item => item.updatedOn).updatedOn)
        const expectedDocNumber = reportDT.toFormat('MMddyyyy') + locNick.slice(0,13)
  
        const invoicingStrategy = location.invoicing === "no invoice" ? "no invoice"
          : location.toBeEmailed ? "email"
          : location.toBePrinted ? "print only"
          : "no invoice"
        
        const order = orderItemGroup.map(item => {
          const override = overrides[`${item.locNick}#${item.prodNick}`]
          const product = products[item.prodNick]
          const locationDefaultRate = override?.wholePrice ?? product.wholePrice
           
          return {
            ...item,
            qtyShort: item.qtyShort ?? 0,
            rate: item.rate ?? locationDefaultRate,

            // extraneous attributes: strip these if calling a create/update
            // mutation on order items
            rateDefault: locationDefaultRate,
            product,
          }
        }).sort(compareBy(item => item.product.prodName))
        
        const invoices = invoicesById[qbID] ?? [{ 
          "CustomerRef.value": "",
          DocNumber: "",
          EmailStatus: "",
          Id: "",
          "MetaData.LastUpdatedTime": "",
          SyncToken: "",
        }]
  
  
        return invoices.map(invoice => {
        
          let f = {} //flags
          f.option_syncData  = location.invoicing !== "no invoice" && (!!location.toBeEmailed || !!location.toBePrinted)
          f.option_sendEmail = location.invoicing !== "no invoice" && (!!location.toBeEmailed)

          f.exists = !!invoice.Id
          f.emailSent = f.exists && invoice.EmailStatus === "EmailSent"

          f.dataExpected = f.option_syncData && !isOrderDeleted
          f.emailExpected = f.option_sendEmail && !isOrderDeleted

          const invoiceLastEditedTS = f.exists 
            ? DT.fromIsoTs(invoice["MetaData.LastUpdatedTime"]).toMillis()
            : 0
          f.stale = f.exists && (invoiceLastEditedTS < orderLastEdited.toMillis())

          f.outOfSync = 0
            || (f.option_syncData && f.exists && (invoiceLastEditedTS < orderLastEdited.toMillis())) // invoice data is stale
            || (f.option_syncData && !f.exists && !isOrderDeleted) // invoice data needs to be created

          f.readyToCreate = f.option_syncData && !f.emailSent && !isOrderDeleted && !f.exists 
          f.readyToUpdate = f.option_syncData && !f.emailSent && !isOrderDeleted && f.exists && f.stale
          f.readyToDelete = f.option_syncData && !f.emailSent && isOrderDeleted  && f.exists && f.stale
          f.readyToSyncData = f.readyToCreate || f.readyToUpdate || f.readyToDelete
          f.readyToSyncDataStrict = f.readyToSyncData && (isToday || isTomorrow)

          
          f.readyToSendEmail = f.option_sendEmail && !isOrderDeleted && !f.emailSent && !f.readyToSyncData
          f.readyToSendEmailStrict = f.readyToSendEmail && (isToday)
          
          const issues = [
            { key: 0, name: "sent & out of sync", hasIssue: f.stale && f.emailSent },
            { key: 1, name: "invalid DocNumber", hasIssue: f.exists && invoice.DocNumber !== expectedDocNumber }
          ]
      

          return {
            // row/order fields
            location,
            zone,
            locNick,
            locNameDisplay,
            qbID,
            order,
            invoicingStrategy,
            nOrderItems,
            isOrderDeleted,
            // invoice fields
            invoice,
            invoiceFlags: f,
            issues,
          }
        })
      })
      .sort(compareBy(row => row.locNick))
      .sort(compareBy(row => rankInvStrat(row.invoicingStrategy)))
  
    function rankInvStrat(strategy) {
      switch (strategy[0]) {
        case 'n': return 0
        case 'p': return 1
        default:  return 2
      }
    }
  
    const rows = allRows.filter(row => !row.issues[1].hasIssue)

    // Orphaned invoices could arise from a special order & are not necessarily
    // a validation error. We may want to simply display them on the side
    const orphanedInvoices = INV.filter(I => 
      Object.keys(invoicesById).every(qbID => qbID !== I["CustomerRef.value"])
    )
  
    const badDocNumberInvoices = allRows
      .filter(row => row.issues[1].hasIssue)

    const invoicesForReview = orphanedInvoices.concat(badDocNumberInvoices)
  

    /** @param {CombinedRoutedOrder[]} orderItems */
    const toQBInvoice = (orderItems) => {
      const orderHeader = orderItems[0]
      const location = locations[orderHeader.locNick]
      const zone = zones[location.zoneNick]
  
      const qbInvoiceHeader = toQBInvoiceHeader({ location, orderHeader })

      const qbLineItems = orderItems
        .filter(item => item.qty !== 0)
        .sort(compareBy(item => products[item.prodNick].prodName))
        .map((orderItem) => {
          const product = products[orderItem.prodNick]
          const override = overrides[`${orderItem.locNick}#${orderItem.prodNick}`]
          const finalRate = orderItem.rate ?? override?.wholePrice ?? product.wholePrice
          return { 
            orderItem: { ...orderItem, rate: finalRate },
            product,
          }
        })
        .map(toQBInvoiceLineItem)

      const qbLineItemCorrections = orderItems
        .filter(item => item.qty !== 0 && !!item.qtyShort)
        .sort(compareBy(item => products[item.prodNick].prodName))
        .map((orderItem) => {
          const product = products[orderItem.prodNick]
          const override = overrides[`${orderItem.locNick}#${orderItem.prodNick}`]
          const finalRate = orderItem.rate ?? override?.wholePrice ?? product.wholePrice
          return { 
            orderItem: { ...orderItem, rate: finalRate },
            product,
          }
        })
        .map(toQBInvoiceLineItem)
  
      const shouldChargeDelivery = 1
        && orderHeader.route === 'deliv'
        && orderItems.some(item => item.qty > (item.qtyShort ?? 0))
      const delivFee = orderHeader.delivFee ?? zone.zoneFee
      const qbDeliveryLineItem = shouldChargeDelivery
        ? [toQBInvoiceDeliveryLineItem({ delivFee, delivDate: orderHeader.delivDate })]
        : []
  
      return {
        ...qbInvoiceHeader,
        Line: qbLineItems.concat(qbLineItemCorrections).concat(qbDeliveryLineItem)
      }
    }
  
    const loadedMakeQbInvoice = (row) => {
      const zoneFee = row.order[0].delivFee || zones[row.location.zoneNick].zoneFee
      return makeQbInvoice(row.order, row.location, products, zoneFee)
    }

    /**
     * Returns a list of locations matched with invoice ID's. Id may be undefined; handle accordingly.
     * WARNING: DOES NOT CHECK IF INVOICE DATA IS STALE.
     */
    const getPdfRequestItems = () => ORD
      .filter(ord => locations[ord.locNick].toBePrinted)
      .sort(compareBy(ord => locations[ord.locNick].locName))
      .sort(compareBy(ord => locations[ord.locNick]?.delivOrder ?? 999))
      .sort(compareBy(ord => ord.meta.route?.printOrder ?? 0))
      .reduce(uniqByRdc(ord => ord.locNick), []) // a location may show up on 2 routes (e.g. lincoln)
      .map(ord => {
        const locNick = ord.locNick
        const qbID = locations[locNick].qbID
        const expectedDocNumber = reportDT.toFormat('MMddyyyy') + locNick.slice(0,13) 
        const Id = INV.find(i => i["CustomerRef.value"] === qbID && i.DocNumber === expectedDocNumber)

        return { locNick, Id }
      })

    /** Has no logic for handling orders with stale or missing invoice data; validate first before executing. */
    const batchGetPdfs = async (setPdfFetchCount) => {
      let requestItems = ORD_wholesale
        .filter(ord => locations[ord.locNick].toBePrinted)
        .sort(compareBy(ord => locations[ord.locNick]?.delivOrder ?? 999))
        .sort(compareBy(ord => ord.meta.route?.printOrder ?? 0))
        .reduce(uniqByRdc(ord => ord.locNick), []) // a location may show up on 2 routes (e.g. lincoln)
        .map(ord => {
          const locNick = ord.locNick
          const { qbID, printDuplicate } = locations[locNick]
          const expectedDocNumber = reportDT.toFormat('MMddyyyy') + locNick.slice(0,13) 
          const Id = INV.find(i => i["CustomerRef.value"] === qbID && i.DocNumber === expectedDocNumber)?.Id

          return { locNick, Id, printDuplicate, result: { data: null, errors: null } }
        })
        .filter(item => !!item.Id)

      let errorItems = []
      for (let i = 1; i <= 3; i++) {
        if (i > 1) { console.log(`retrying: attempt ${i} of 3...`) }
        for (let j = 0; j < requestItems.length; j++) {
          setPdfFetchCount(`Got ${countBy(requestItems, item => !!item.result.data)}/${requestItems.length}`)
          if (requestItems[j].result.data === null) {
            requestItems[j].result = await QB2.invoice
              .getPdf({ Id: requestItems[j].Id })
              .then(data => ({ data, errors: null }))
              .catch(errors => ({ data: null, errors }))
          }
        }

        errorItems = [...requestItems].filter(item => !!item.result.errors)
        if (errorItems.length) { console.log("errors found:", errorItems) } 
        else { 
          console.log("Got all items")
          break 
        }
      } 

      const pdfs = requestItems
        .filter(item => !!item.result.data)
        .flatMap(item => item.printDuplicate 
          ? [item.result.data, item.result.data] 
          : item.result.data
        )
  
      downloadPDF(pdfs, `All_Routes_Invoices_${reportDT.toFormat('yyyy-MM-dd')}`)

      if (errorItems.length) {
        alert(
          `Failed to get ${errorItems.length} invoice${errorItems.length !== 1 ? "s" : ""}:\n`
          + errorItems.map(item => `- ${item.locNick}\n`)
        )
      }
    }

    const isBpbLocation = (item) => ['backporch', 'bpbkit', 'bpbextras'].includes(item.locNick)

    /** @param {CombinedRoutedOrder[]} tableItems */
    const toGridTable = (tableItems) => {
      const pivotKeys = tableItems
        .reduce(uniqByRdc(i => i.prodNick), [])
        .map(i => i.prodNick)
        .sort(compareBy(pn => pn))
        .sort(compareBy(pn => products[pn]?.doughNick))
        .sort(compareBy(pn => products[pn]?.packGroup))

      const columns = [{ header: "Location", dataKey: "displayName" }]
        .concat(pivotKeys.map(prodNick => ({ header: prodNick, dataKey: prodNick })))

      const body = tableItems
        .reduce(groupByArrayRdc(item => item.locNick), [])
        .map(row => {
          const locName = row[0].meta.location.locName
          const displayName = truncate(locName, { length: 16 })
            
          return Object.assign(
            { displayName }, 
            ...pivotKeys.map(prodNick =>
              ({ [prodNick]: row.find(item => item.prodNick === prodNick)?.qty ?? ""})
            )
          )
        })

      return { body, columns }
      
    }

    const batchPrintPdfGrids = !NTE ? undefined : () => {

      const notesDataByRouteNick = mapValues(
        groupByObject(
          NTE.filter(N => 1
            && !!N.note 
            && N.Type === 'packList' 
            && N.when === reportDT.toFormat('yyyy-MM-dd')
          ), 
          N => N.ref
        ),
        groupArray => groupArray[0]
      )

      const preppedItems = ORD_wholesale
        .filter(ord => ord.qty !==0)
        .sort(compareBy(orderItem => locations[orderItem.locNick]?.delivOrder ?? 999))
        .sort(compareBy(orderItem => orderItem.meta.route?.printOrder ?? 0))

      const pages = preppedItems
        .reduce(groupByArrayRdc(item => item.meta.routeNick), [])
        .map(routeGroupItems => {
          const routeNick = routeGroupItems[0].meta.routeNick
          const bpbItems = routeGroupItems.filter(item => isBpbLocation(item))
          const regItems = routeGroupItems.filter(item => !isBpbLocation(item))
          const tables = [bpbItems, regItems]
            .filter(t => t.length > 0)
            .map(tableItems => toGridTable(tableItems))

          const header = `${routeNick} ${reportDT.toFormat('MM/dd/yyyy')}`

          const notes = notesDataByRouteNick[routeNick]?.note

          const noteLines = !!notes 
            ? ["Notes:", ""].concat(notes.split('\n'))
            : null

          return {
            header,
            tables,
            noteLines,
          }
        })

      const fileName = `All_Routes_Grids_${reportDT.toFormat('yyyy-MM-dd')}`

      printGridPages(pages, fileName)

    }
  
    return { 
      rows, 
      invoicesForReview, 
      toQBInvoice, 
      loadedMakeQbInvoice, 
      getPdfRequestItems, 
      batchGetPdfs ,
      batchPrintPdfGrids,
    }
  
  }, [LOC, ORD, INV, PRD, OVR, ZNE, NTE, isToday, isTomorrow])


  return { 
    rows, 
    invoicesForReview, 
    toQBInvoice, 
    loadedMakeQbInvoice,
    // getPdfRequestItems,
    batchGetPdfs,
    batchPrintPdfGrids,
  }
}
