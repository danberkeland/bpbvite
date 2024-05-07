import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { ListBox } from "primereact/listbox"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputTextarea } from "primereact/inputtextarea"

import { useSettingsStore } from "../../Contexts/SettingsZustand"
import { useRouteGridData } from "./useRouteGridData"
import { exportRouteGrids } from "./exportRouteGrids"
import { exportInvoices } from "./exportInvoices"

import { useEffect, useRef, useState } from "react"
import { compareBy } from "../../utils/collectionFns"
import { DT } from "../../utils/dateTimeFns"
import { useNotesByType } from "../../data/note/useNotes"
import { OverlayPanel } from "primereact/overlaypanel"

const PageRouteGrid = () => {
  const setIsLoading = useSettingsStore(state => state.setIsLoading)
  const [isEditingNote, setIsEditingNote] = useState(false)

  const [reportDT, setReportDT] = useState(DT.today())
  const handleDateChange = e => {
    setReportDT(DT.fromJs(e.value))
    setIsEditingNote(false)
  }
  const isToday = reportDT.toMillis() === DT.today().toMillis()

  const [routeNick, setRouteNick] = useState('')

  const { data:pivotDataByRouteNick, pradoData, higueraData, products={}, exportHigueraStickers } = 
    useRouteGridData({ reportDT, shouldFetch: true })
  const { data:NTE } = useNotesByType({ shouldFetch: !!routeNick, Type: 'packList' })

  useEffect(() => {
    if (!!pivotDataByRouteNick) {
      setRouteNick('AM Pastry')
      // console.log(pivotDataByRouteNick)
    }
  }, [pivotDataByRouteNick])

  const displayRouteNicks = (pivotDataByRouteNick ?? [])
    .map(grid => grid[0].rowProps.routeNick)

  const displayTableData = !!pivotDataByRouteNick
    ? pivotDataByRouteNick.find(grid => grid[0].rowProps.routeNick === routeNick) ?? []
    : []

  const displayPivotColumnKeys = !!displayTableData && !!displayTableData.length
    ? Object.keys(displayTableData[0].colProps)
        .sort()
        .sort(compareBy(prodNick => products[prodNick]?.doughNick))
        .sort(compareBy(prodNick => products[prodNick]?.packGroup))
    : []

  const handleExport = (data, fileIdString) => {
    exportRouteGrids(data, NTE, reportDT, products, fileIdString)
    exportInvoices(data, reportDT, fileIdString, setIsLoading)
  }
  const exportAll     = () => handleExport(pivotDataByRouteNick, "All_Routes")
  const exportCurrent = () => handleExport(pivotDataByRouteNick?.filter(grid => grid[0].rowProps.routeNick === routeNick), routeNick.replace(/ /g, '_'))
  const exportDriver1 = () => handleExport(pivotDataByRouteNick?.filter(grid => grid[0].rowProps.driver === 'Long Driver'), 'Long_Driver')
  const exportDriver2 = () => handleExport(pivotDataByRouteNick?.filter(grid => grid[0].rowProps.driver === 'AM Pastry'), 'AM_Pastry')
  const exportDriver3 = () => handleExport(pivotDataByRouteNick?.filter(grid => grid[0].rowProps.driver === 'AM South'), 'AM_South')

  const printPrado   = () => exportRouteGrids(pradoData,   NTE, reportDT, products, 'Prado_Pack')
  const printHiguera = () => exportRouteGrids(higueraData, NTE, reportDT, products, 'Higuera_Pack')

  const headerTemplate =
    <div>
      <h1 style={{display: "inline-block", marginBlock: ".5rem"}}>Pack Lists {reportDT.toFormat('MM/dd/yyyy')}</h1>
      <CustomCalendarInput reportDT={reportDT} onChange={handleDateChange} />
    </div>

  const printByDriverButtons =
    <div style={{display: "flex", gap: "1rem", marginBlock: ".5rem"}}>
      <Button onClick={exportDriver1} icon="pi pi-print" label="Driver 1 (Long Driver)" />
      <Button onClick={exportDriver2} icon="pi pi-print" label="Driver 2 (Pastry)" />
      <Button onClick={exportDriver3} icon="pi pi-print" label="Driver 3 (South Driver)" />
    </div>

  return (
    <div style={{padding: "2rem 5rem 5rem 5rem", margin: "auto"}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", columnGap: "2rem", flexWrap: "wrap", marginBlock: "0.5rem"}}>
        {headerTemplate} 
        {printByDriverButtons}
      </div>

      <div style={{display: "grid", gridTemplateColumns: "11rem 1fr", columnGap: "2rem"}}>
        <div>
          <ListBox
            value={routeNick}
            options={displayRouteNicks}
            onChange={e => {
              setRouteNick(e.value)
              setIsEditingNote(false)
            }}
            style={{height: "fit-content"}}
          />
          <Button onClick={exportCurrent} label={<div>Print<br/>Current Route</div>}  style={{width: "100%", marginTop: "1rem"}} />
          <Button onClick={exportAll}     label={<div>Print<br/>All Routes</div>}     style={{width: "100%", marginTop: "1rem"}} />
        
          <Button onClick={printPrado}   label={<div>Prado<br/>Pack Lists</div>}   style={{width: "100%", marginTop: "2rem"}} />
          <Button onClick={printHiguera} label={<div>Higuera<br/>Pack Lists</div>} style={{width: "100%", marginTop: "1rem"}} />
          <Button onClick={exportHigueraStickers} label={<div>Higuera<br/>Stickers</div>} style={{width: "100%", marginTop: "1rem"}} />
        </div>

        <div>
          <DataTable
            value={displayTableData}
            responsiveLayout="scroll"
            size="small"
            showGridlines
            stripedRows
            className={isToday ? '' : 'not-today'}
          >
            <Column header="Location" field="rowProps.locName" />
            {displayPivotColumnKeys.map(prodNick => 
              <Column header={prodNick} field={`colProps.${prodNick}.value`} key={prodNick} style={{minWidth: "3rem"}} />
            )}
          </DataTable>

          <NoteComponent 
            reportDT={reportDT} 
            routeNick={routeNick}
            isEditing={isEditingNote}
            setIsEditing={setIsEditingNote}
          />

        </div>

      </div>
    </div>
  )

}

const CustomCalendarInput = ({ reportDT, onChange }) => {
  const calendarRef = useRef()
  return <div style={{display: "inline-block", marginLeft: "1rem"}}>
    <Button 
      icon="pi pi-calendar"
      className="p-button-rounded" 
      onClick={() => calendarRef.current.show()}
    />
    <Calendar 
      value={reportDT.toJSDate()}
      ref={calendarRef}
      onChange={onChange} 
      inputStyle={{visibility: "hidden", width:"0", height: "0", padding: "0"}}
      panelStyle={{transform: "translate(-.8rem, 0rem)"}}
    />
  </div>
}


const HelpIcon = ({ routeNick }) => {
  const overlayRef = useRef()
  return <>
    <i 
      className="pi pi-question-circle" 
      onClick={e => overlayRef.current.toggle(e)}
      style={{color: "hsl(218, 65%, 50%)", cursor: "pointer", fontSize: "1.25rem", marginLeft: ".5rem"}} 
    />
    <OverlayPanel ref={overlayRef} style={{maxWidth: "18rem", padding: "1rem"}}>
      <p>
        A note entered here will show up below the {routeNick} pack list on the printout.
      </p>
      <p>
        Be careful with large, multi-line notes, or notes that go with large, 
        page-filling tables. Text that goes past the bottom of the page
        will simply be cut off. When in doubt, generate a test printout
        to be sure text fits correctly.
      </p>
    </OverlayPanel>
  </>
}


const NoteComponent = ({ reportDT, routeNick, isEditing, setIsEditing }) => {
  const reportDate = reportDT.toFormat('yyyy-MM-dd')
  const userName = useSettingsStore(state => state.user)

  const NOTE = useNotesByType({ shouldFetch: !!routeNick, Type: 'packList' })
  const dbNote = NOTE?.data?.find(N => N.ref === routeNick && N.when === reportDate)
  const [displayNote, setDisplayNote] = useState('')
  useEffect(() => {
    setDisplayNote(dbNote ? (dbNote.note ?? '') : '')
  }, [NOTE.data, reportDate, routeNick])

  const noteTemplate = ({
    Type: 'packList',
    ref: routeNick,
    when: reportDate,
    note: '',
    forWhom: null,
    byWhom: userName,
    ttl: reportDT.plus({ days: 2 }).toSeconds(),
  })

  const handleSubmit = async () => {
    if(!dbNote) {
      console.log("creating")
      console.log({ ...noteTemplate, note: displayNote })
      NOTE.updateLocalData(await NOTE.submitMutations(
        { createInputs: [{ ...noteTemplate, note: displayNote }] }
      ))

    } else {
      console.log("updating")
      console.log({ id: dbNote.id, note: displayNote })
      NOTE.updateLocalData(await NOTE.submitMutations(
        { updateInputs: [{ 
          id: dbNote.id, 
          note: displayNote,
          byWhom: userName, 
        }] }
      ))
    }
    setIsEditing(false)
  }

  return (
    <div style={{
      padding: "1rem",
      color: "var(--bpb-text-color)",
      background: "var(--bpb-surface-content)",
      border: "solid 1px var(--bpb-surface-content-border)",
      borderRadius: "3px",
      marginTop: "2rem",
      maxWidth: "30rem",
    }}>
      <div style={{display: "flex", justifyContent: "space-between"}} >
        <h2 style={{display: "inline-block", margin: "0"}}>
          Note For {routeNick} Printout <HelpIcon routeNick={routeNick} />
        </h2>
      </div>
      {isEditing && <>
        <InputTextarea 
          value={displayNote}
          onChange={e => setDisplayNote(e.target.value)}
          autoResize
          rows={1}
          readOnly={!isEditing}
          style={{width: "100%", marginBlock: ".5rem" }}
        />
        <div style={{display: "flex", justifyContent: "flex-end", gap: "1rem"}}>
          <Button 
            icon="pi pi-times"
            className="p-button-rounded p-button-outlined"
            onClick={() => setIsEditing(false)}
          />
          <Button 
            icon="pi pi-send"
            className="p-button-rounded"
            onClick={handleSubmit}
            disabled={0
              || (!!dbNote && displayNote === dbNote.note)
              || (!dbNote && !displayNote)
            }
          />
        </div>   
      </>}
      {!isEditing && <>
        <div style={{
          minHeight: "2.5rem",
          marginTop: ".5rem",
          marginBottom: "0.9rem",
          padding: ".5rem",
          border: "solid 1.25px var(--bpb-surface-content-border)",
          whiteSpace: "pre-wrap",
        }}>
          {displayNote}
        </div>
        <div style={{display: "flex", justifyContent: "flex-end", gap: "1rem"}}>
          <Button 
            icon="pi pi-pencil" 
            className="p-button-rounded" 
            onClick={() => setIsEditing(true)} 
          />
        </div>
      </>}        
    </div>
  )

}

export { PageRouteGrid as default }