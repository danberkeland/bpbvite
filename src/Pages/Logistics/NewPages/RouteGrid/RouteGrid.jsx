import React, { useEffect, useMemo, useRef } from "react"

import { useRouteGrid } from "./data"
import { useListData } from "../../../../data/_listData"

import { ListBox } from "primereact/listbox"
import { Calendar } from "primereact/calendar"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"
import { Dialog } from "primereact/dialog"

import { useState } from "react"
import { DateTime } from "luxon"
import { get, isEqual, keyBy, pickBy, set, sortBy } from "lodash"
import { 
  exportRouteGridPdf, 
  exportInvoicePdf, 
  // exportSingleInvoice
} from "./exportPdf"

import "./routeGrid.css"
import { useSettingsStore } from "../../../../Contexts/SettingsZustand"
import { useBillingDataByDate } from "../../../Billing/v2/data"
import { InputNumber } from "primereact/inputnumber"
import { submitAndPrintInvoice, submitOrder } from "../../../Billing/v2/submitFunctions"
import { OverlayPanel } from "primereact/overlaypanel"
import { useNotesByType } from "../../../../data/note/useNotes"
import { InputTextarea } from "primereact/inputtextarea"

const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')

const RouteGrid = () => {
  const user = {
    name: useSettingsStore(state => state.user)
  }
  
  const [routeNick, setRouteNick] = useState('AM Pastry')

  const [reportDateJS, setReportDateJS] = useState(new Date())
  const reportDateDT = DateTime.fromJSDate(reportDateJS)
    .setZone('America/Los_Angeles')
    .startOf('day')
  const reportDateISO = reportDateDT.toFormat('yyyy-MM-dd')
  // const reportWeekdayNum = (reportDateDT.toFormat('E') % 7) + 1 // in our wacky format Sun = 1, Sat = 7
  const reportDateIsToday = reportDateISO === todayDT.toFormat('yyyy-MM-dd')

  // fortunately these both use the same order hook, so fetching is not
  // duplicated, and mutations to the order cache will update both
  const { data:gridData, pradoPackData, higueraPackData } = useRouteGrid({ 
    reportDate: reportDateDT.toFormat('yyyy-MM-dd'), shouldFetch: true
  })
  const { 
    data:billingDataByLocNick,
    convertOrderToInvoice
  } = useBillingDataByDate({
    reportDate: reportDateDT.toFormat('yyyy-MM-dd'), shouldFetch:true 
  })
  const { data:RTE } = useListData({ tableName: "Route", shouldFetch: true })
  const { data:LOC } = useListData({ tableName: "Location", shouldFetch: true })

  const noteHelpRef = useRef()
  const [isEditingNote, setIsEditingNote] = useState(false)

  const [displayNote, setDisplayNote] = useState('')
  const NOTE = useNotesByType({ shouldFetch:true, Type: 'packList' })
  const noteData = (NOTE?.data ?? []).filter(N => N.when === reportDateISO)

  // filter should return max 1 note; we're just reusing the list query,
  // so an array is returned


  // Single note only; supplemental note attributes must adhere to this format.
  const noteTemplate = ({
    Type: 'packList',
    ref: routeNick,
    when: reportDateISO,
    note: '',
    forWhom: null,
    byWhom: user.name,
    ttl: reportDateDT.plus({ days: 2 }).toSeconds(),
  })

  const dbNote = useMemo(() => {
    return (NOTE?.data ?? []).filter(note =>
      note.ref === routeNick && note.when === reportDateISO  
    )[0]
  }, [NOTE.data, routeNick, reportDateISO]) 
  useEffect(() => {
    setDisplayNote(!!dbNote ? (dbNote.note ?? '') : '')
  }, [dbNote])

  const setIsLoading = useSettingsStore((state) => state.setIsLoading)

  if ( !gridData || !RTE || !LOC ) return <div>Loading...</div>

  const { tableData, pdfGrids } = gridData 
  const routes = keyBy(RTE, "routeNick")
  const locations = keyBy(LOC, "locNick")

  // console.log("pdfGrids", pdfGrids)
  // console.log(RTE)
  // console.log("LOC:", LOC)

  const routeOptions = sortBy(
    Object.keys(gridData.tableData), 
    routeNick => routes[routeNick]?.printOrder ?? 0 
  )

  // 'partial application' allows us to call the function while
  // specifying only the inputs that change from one call to the next.
  const exportInvoices = ({ gridData, fileName }) => exportInvoicePdf({
    gridData, fileName, routes, locations, reportDateDT, setIsLoading
  })
  const exportGrids = ({ gridData, fileName, noteData }) => exportRouteGridPdf({ 
    gridData, fileName, reportDateDT, noteData
  })

  return (<>
    <div style={{
      marginBottom: "10rem",
      display: "grid",
      gridTemplateColumns: "10rem 1fr",
      gap: "0 2rem",
      margin: "6rem"
    }}>
      <div>
        <ConfirmPopup />
        {/* <h2>Routes:</h2> */}
        <Calendar 
          value={reportDateJS}
          onChange={e => {
            setRouteNick('AM Pastry')
            setReportDateJS(e.value)}
          }
          inputStyle={{width: "8rem", height: "2.5rem"}}
          showIcon iconPos="left" icon="pi pi-fw pi-calendar"
        />

        <ListBox 
          value={routeNick}
          options={routeOptions}
          onChange={e => {
            if (e.value) {
              setRouteNick(e.value)
              setIsEditingNote(false)
            }
          }}
          style={{width:"10rem", marginTop: "1rem"}}
        />

        <Button label={<span>Print <br/>Current Route</span>}
          onClick={() => {
            const gridData = pickBy(
              pdfGrids, 
              (value, key) => key === routeNick
            )
            const fStr = `${reportDateISO}_${routeNick.replace(" ", "_")}`
            exportGrids({ 
              gridData, 
              fileName: fStr + '_Route_Grid.pdf',
              noteData,
            })
            exportInvoices({ gridData, fileName: fStr + '_Invoices.pdf' })
          }}      
          style={{width: "100%", marginTop: "1rem"}}
          disabled={routeNick === 'NOT ASSIGNED'}
        />

        <Button label={<span>Print <br/>All Routes</span>}
          onClick={() => {
            const gridData = pdfGrids
            const fStr = `${reportDateISO}_All`
            exportGrids({ 
              gridData, 
              fileName: fStr + '_Route_Grids.pdf',
              noteData,
            })
            exportInvoices({ gridData, fileName: fStr + '_Invoices.pdf' })
          }} 
          style={{width: "100%", marginTop: "1rem"}}
          disabled={routeOptions.includes('NOT ASSIGNED')}
        />

        <Button label={<span>Prado<br/>Pack Lists</span>}
          onClick={() => {
            const gridData = pradoPackData?.pdfGrids
            const fStr = `${reportDateISO}_Prado_Pack_All`
            exportGrids({ 
              gridData, 
              fileName: fStr + '_Route_Grids.pdf',
              noteData,
            })
          }} 
          style={{width: "100%", marginTop: "3rem"}}
          disabled={routeOptions.includes('NOT ASSIGNED') || !pradoPackData}
        />

        <Button label={<span>Higuera<br/>Pack Lists</span>}
          onClick={() => {
            const gridData = higueraPackData?.pdfGrids
            const fStr = `${reportDateISO}_Higuera_Pack_All`
            exportGrids({ 
              gridData, 
              fileName: fStr + '_Route_Grids.pdf',
              noteData,
            })
          }} 
          style={{width: "100%", marginTop: "1rem"}}
          disabled={routeOptions.includes('NOT ASSIGNED') || !pradoPackData}
        />

      </div>

      <div>
        <div style={{height: "3.5rem", display: "flex", alignItems: "flex-Start", gap: "1rem"}}>
          <Button label="Driver 1 (Long Driver)"
            onClick={() => {
              const gridData = pickBy(
                pdfGrids, 
                routeGridObj => routeGridObj.driver === "Long Driver"
              )
              const fStr = `${reportDateISO}_Long_Driver`
              exportGrids({ 
                gridData, 
                fileName: fStr + '_Route_Grids.pdf',
                noteData,
              })
              exportInvoices({ gridData, fileName: fStr + '_Invoices.pdf' })
            }}
            icon="pi pi-fw pi-print"
          />

          <Button label="Driver 2 (Pastry)"
            onClick={() => {
              const gridData = pickBy(
                pdfGrids, 
                routeGridObj => routeGridObj.driver === "AM Pastry"
              )
              const fStr = `${reportDateISO}_AM_Pastry`
              exportGrids({ 
                gridData, 
                fileName: fStr + '_Route_Grids.pdf',
                noteData,
              })
              exportInvoices({ gridData, fileName: fStr + '_Invoices.pdf' })
            }}
            icon="pi pi-fw pi-print"
          />

          <Button label="Driver 3 (South Driver)"
            onClick={() => {
              const gridData = pickBy(
                pdfGrids, 
                routeGridObj => routeGridObj.driver === "AM South"
              )
              const fStr = `${reportDateISO}_AM_South`
              exportGrids({ 
                gridData, 
                fileName: fStr + '_Route_Grids.pdf',
                noteData,
              })
              exportInvoices({ gridData, fileName: fStr + '_Invoices.pdf' })
            }}
            icon="pi pi-fw pi-print"
          />
        </div>

        <DataTable
          value={tableData?.[routeNick]?.rows ?? []}
          showGridlines stripedRows size="small"
          className={reportDateIsToday ? 'today-table' : 'not-today-table'}

        >
          {reportDateIsToday && 
            <Column 
              body={row => {
                const { locNick } = row
                const cartOrder = billingDataByLocNick?.[locNick]
                
                return FixInvoiceTemplate({ 
                  row,
                  cartOrder, 
                  location: locations[locNick],
                  reportDate: reportDateISO,
                  convertOrderToInvoice,
                }) 
              }}
              style={{width: "2rem"}} frozen 
            />
          }
          <Column 
            header={
              <div onClick={() => console.log("tableData:", tableData)}>
                Location
              </div>
            } 
            field="locNameShort" 
            frozen 
          />
          {(tableData?.[routeNick]?.prodNickList ?? []).map(prodNick => {
            return (
              <Column 
                key={`${prodNick}-col`} 
                header={prodNick} 
                field={`${prodNick}.qty`}
                body={row => {
                  return (
                    <div onClick={() => console.log(row[prodNick])}>
                      {row[prodNick]?.qty}
                    </div>
                )}}
              />
            )
          })}
        </DataTable>
        
        <div style={{
          marginBlock: "1rem",
          background: "var(--bpb-surface-content)",
          borderRadius: "3px",
          width: "20rem",
          padding: "1rem",
        }}>

          <div style={{color: "var(--bpb-text-color)", fontSize: "1.1rem"}}>
            Note for {routeNick} <i className="pi pi-question-circle" style={{color: "hsl(218, 65%, 50%)"}} onClick={e => noteHelpRef.current.toggle(e)} />
          </div>
          <OverlayPanel ref={noteHelpRef} style={{maxWidth: "18rem", padding: "1rem"}}>
            <p>
              A note entered here will show up below the {routeNick} grid on the printout.
            </p>
            <p>
              Be careful with large, multi-line notes, or notes for large, 
              page-filling tables. Text that goes passes the bottom of the page
              will simply be cut off.
            </p>
          </OverlayPanel>

          {!isEditingNote &&  
            <div style={{maxWidth: "18rem", display:"flex", flexDirection:"column", alignItems: "flex-end"}}>
              <div style={{
                width: "100%",
                padding: ".5rem",
                marginBottom: "1rem",
                color: "var(--bpb-text-color)",
                background: "var(--bpb-surface-content)",
                borderRadius: "3px",
                whiteSpace: "pre-wrap",
              }}>
                {displayNote}
              </div>
              <Button 
                //label="Edit Note"
                className="p-button-rounded"
                icon={!!displayNote ? "pi pi-pencil" : "pi pi-plus"}
                onClick={() => setIsEditingNote(!isEditingNote)}
              />
            </div>
          }

          {isEditingNote && 
            <div style={{maxWidth: "18rem", display:"flex", flexDirection:"column", alignItems: "flex-end"}}>
              <InputTextarea 
                value={displayNote}
                onChange={e => setDisplayNote(e.target.value)}
                rows={1}
                autoResize
                style={{width: "100%", display: "block", marginBottom:"1rem"}}
                readOnly={!isEditingNote}
                // disabled={isSubmitting}
              />

              <div>
                <Button 
                  icon="pi pi-times" 
                  className="p-button-rounded p-button-outlined" 
                  style={{marginRight: ".5rem"}} 
                  onClick={() => setIsEditingNote(false)}
                />
                <Button 
                  className="p-button-rounded"
                  icon={!!dbNote?.note && !displayNote ? "pi pi-trash" : "pi pi-send"}
                  onClick={async () => {
                    if(!dbNote) {
                      console.log("creating")
                      console.log({ ...noteTemplate, note: displayNote })
                      NOTE.updateLocalData(await NOTE.submitMutations(
                        { createInputs: [{ ...noteTemplate, note: displayNote }] }
                      ))

                    } else {
                      console.log("updating")
                      console.log({ 
                        id: dbNote.id, 
                        note: displayNote 
                      })
                      NOTE.updateLocalData(await NOTE.submitMutations(
                        { updateInputs: [{ 
                          id: dbNote.id, 
                          note: displayNote,
                          byWhom: user.name, 
                        }] }
                      ))
                    }
                    setIsEditingNote(false)
                  }}
                  disabled={0
                    || (!!dbNote && displayNote === dbNote.note)
                    || (!dbNote && !displayNote)
                  }
                />
              </div>
            </div>
          }
        </div>



      </div>
    </div>
  </>)
}




const FixInvoiceTemplate = ({ 
  row,
  cartOrder, 
  location,
  reportDate,
  convertOrderToInvoice,
}) => {
  const { routeNick } = row
  const { locName, toBePrinted, invoicing } = location ?? {}
  const isLoading = useSettingsStore((state) => state.isLoading)
  const setIsLoading = useSettingsStore((state) => state.setIsLoading)
  const opRef = useRef()
  const [show, setShow] = useState(false)
  const [values, setValues] = useState()
  const hasChanges = !!values && !isEqual(values, cartOrder)

  const orderCache = useListData({ 
    tableName: "Order", 
    customQuery: "orderByDelivDate",
    variables: { delivDate: reportDate, limit: 5000 },
    shouldFetch: true
  })

  useEffect(() => {
    if (!!show) setValues(structuredClone(cartOrder))
  }, [show, cartOrder])

  const iconButton = (routeNick === 'NOT ASSIGNED'|| invoicing === 'no invoice')
    ? <i className="pi pi-fw pi-pencil" 
        onClick={e =>  {
          if (invoicing === 'no invoice') {
            opRef.current.toggle(e)
          }
        }}
        style={{opacity: ".6"}}
      />
    : <i className="pi pi-fw pi-pencil" 
        onClick={() => setShow(true)}
        style={{ cursor: "pointer" }}
      />

  return (
    <div>
      {iconButton}
      <OverlayPanel ref={opRef} style={{padding: "1rem"}}>
        <i className="pi pi-fw pi-info-circle" />
        This customer does not get invoices.
      </OverlayPanel>
      <Dialog
        header={<span>Adjust Order & Invoice:<br/>{locName}</span>}
        visible={show}
        onHide={() => setShow(false)}
        footer={
          <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
            {!!isLoading && <div style={{marginRight: "1rem"}}>Processing...</div>}
            {/* <Button label="Save" 
              onClick={async () => {
                setIsLoading(true)
                await submitOrder({ values, initial: cartOrder, orderCache })
                setIsLoading(false)
              }}
              disabled={isLoading}
            />  */}
            <Button label="Save & get PDF" 
              onClick={async e => {
                if (toBePrinted) {
                  setIsLoading(true)
                  await submitAndPrintInvoice({
                    values,
                    initial: cartOrder,
                    orderCache,
                    invoice: convertOrderToInvoice({ cartOrder: values })
                  })
                  setIsLoading(false)
                } else {
                  confirmPopup({
                    target: e.currentTarget,
                    message: <span>
                      This customer doesn't get a printed invoice.<br />
                      Save changes to order only?
                    </span>,
                    icon: 'pi pi-exclamation-triangle',
                    accept: async () => {
                      setIsLoading(true)
                      await submitOrder({ values, initial: cartOrder, orderCache })
                      setIsLoading(false)
                    },
                  })
                }
              }}
              disabled={isLoading || invoicing === 'no invoice'}
            />
          </div>
        }
      >
        <DataTable
          value={values?.items ?? []}
          size="small"
          style={{
            border: "solid 1px var(--bpb-surface-content-border)",
            borderBottomStyle: "none"
          }}
        >
          <Column header="Product" field="prodNick" />
          <Column header="Qty" field="qty" />
          <Column header="qty Short"
            body={(row, options) => QtyShortInput({
              values,
              setValues,
              fieldPath: `items[${options.rowIndex}].qtyShort`,
              row, 
              disabled: isLoading
            })}
          
          />
          <Column header="total delivered" body={row => row.qty - row.qtyShort} />
        </DataTable>
      </Dialog>
    </div>
  )
}

const QtyShortInput = ({ 
  values,
  setValues, 
  fieldPath, 
  row, 
  disabled 
}) => <InputNumber
  value={get(values, fieldPath)}
  inputStyle={{width: "4rem"}}
  max={row.qty}
  disabled={disabled}
  onChange={e => {
    const newValue = e.value === null ? null : Math.min(e.value, row.qty)
    let newValues = structuredClone(values)
    set(newValues, fieldPath, newValue)
    setValues(newValues)
  }}
  onKeyDown={e => {
    if (e.key === "Escape") {
      const newValue = get(values, fieldPath)
      let newValues = structuredClone(values)
      set(newValues, fieldPath, newValue)
      setValues(newValues)
      e.target.blur()
    }
  }}
  onBlur={e => {
    if (e.target.value === "0") {
      let newValues = structuredClone(values)
      set(newValues, fieldPath, null)
      setValues(newValues)
    }
  }}
/>


export { RouteGrid as default }