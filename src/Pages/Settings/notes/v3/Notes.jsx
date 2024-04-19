import React, { useEffect, useMemo, useState } from "react"
import { useListData } from "../../../../data/_listData"
import { DateTime } from "luxon"
import { countBy, keyBy, orderBy, sortBy } from "lodash"

import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { InputTextarea } from "primereact/inputtextarea"
import { useSettingsStore } from "../../../../Contexts/SettingsZustand"
import { DT } from "../../../../utils/dateTimeFns"
const isoToDT = isoDate => DT.fromIso(isoDate)

const jsToFormat = (jsDate, formatToken) => DateTime.fromJSDate(jsDate)
  .setZone('America/Los_Angeles')
  .startOf('day')
  .toFormat(formatToken)

const isoToFormat = (isoDate, formatToken) => DateTime
  .fromFormat(isoDate, 'yyyy-MM-dd', { zone: 'America/Los_Angeles'})
  .startOf('day')
  .toFormat(formatToken)

const jsToIso = jsDate => jsToFormat(jsDate, 'yyyy-MM-dd')

const Notes = () => {
  const user = {
    name: useSettingsStore(state => state.user)
  }
  const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
  const todayISO = todayDT.toFormat('yyyy-MM-dd')

  const [calendarDateJS, setCalendarDateJS] = 
    useState(todayDT.plus({ days: 1 }).toJSDate())
  const calendarDateISO = jsToIso(calendarDateJS)

  const { 
    data:NTE,
    submitMutations,
    updateLocalData,
  } = useListData({ 
    tableName: "Notes", 
    customQuery: "notesByTypeByRef",
    shouldFetch: true,
    variables: { limit: 5000, Type: "logistics", ref: { eq: "longdriver" } }
  })
  const noteCountsByDate = countBy(NTE, 'when')

  const makeNotes = () => {
    if(!NTE) return []
    return orderBy(NTE, 'when', 'desc')
      .concat([{ note: '' }])
      .map((item, idx) => ({ ...item, _idx: idx}))

  }

  const notes = useMemo(makeNotes, [NTE])
  const [noteValues, setNoteValues] = useState([])
  const [editRows, setEditRows] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => {
    if (!!notes) {
      setNoteValues(notes)
      setEditRows(notes.map(N => false))
    }
  }, [notes])

  const tableData = showAll
    ? noteValues.filter(note => !!note.id)
    : noteValues.filter(note => 
        note.when === calendarDateISO || !note.id
      )
  console.log(noteValues)
  
  return(<div style={{maxWidth: "64rem", margin:"auto"}}>
    
    <div style={{marginInline: "4rem", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <h1>Long Driver Notes</h1>
      <div style={{marginBlock: "1rem"}}>
        <Button label="Show All Dates" onClick={() => setShowAll(true)} />
      </div>

    </div>
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      marginInline: "4rem"
    }}>
      <div>
        <Calendar 
          inline
          value={calendarDateJS}
          onChange={e => {
            setCalendarDateJS(e.value)
            setShowAll(false)
          }}
          dateTemplate={date => dateCellTemplate(date, noteCountsByDate)}
          style={{width: "27rem"}}
        />
      </div>

      <div style={{
        boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2), "
          + "0 1px 1px 0 rgba(0, 0, 0, 0.14), "
          + "0 1px 3px 0 rgba(0, 0, 0, 0.12)",
        height: "fit-content",
      }}>
      <DataTable 
        value={tableData}
        responsiveLayout="scroll"
        scrollHeight="50rem"
        rowGroupMode={showAll ? "subheader" : ""}
        groupRowsBy="when"
        rowGroupHeaderTemplate={data => {
          return (
            <div style={{ fontWeight: "bold" }}>
              {isoToFormat(data.when, 'MMM d, yyyy')}
            </div>
          )
        }}
        style={{
          width: "27rem",
        }}
      >
        <Column 
          header={showAll
            ? "Showing all notes"
            : jsToFormat(calendarDateJS, 'EEE, MMM dd')
          }
          body={row => {
            
            const updateNoteValue = newValue => {
              let newValues = structuredClone(noteValues)
              newValues[row._idx].note = newValue
              setNoteValues(newValues)
            }

            const startEdit = () => {
              let newValue = [...editRows]
              newValue[row._idx] = true
              setEditRows(newValue)
            }
            const cancelEdit = () => {
              let newFlags = [...editRows]
              newFlags[row._idx] = false
              setEditRows(newFlags)
              
              let newValues=(structuredClone(noteValues))
              newValues[row._idx].note = notes[row._idx].note
              setNoteValues(newValues) 
            }


            const handleCreate = async () => {
              const { note, Type, ref, forWhom, byWhom } = noteValues[row._idx]
              const createItem = {
                Type: "logistics",
                ref: "longdriver",
                forWhom,
                byWhom: user.name, 
                note: note.trim(),
                when: calendarDateISO,
                ttl: isoToDT(calendarDateISO)
                  .plus({ days: 30 })
                  .toSeconds()
              }
              setIsSubmitting(true)
              updateLocalData(
                await submitMutations({ createInputs: [createItem]})
              )
              setIsSubmitting(false)
            }

            const handleUpdate = async () => {
              const { id, note, forWhom, byWhom, when } = noteValues[row._idx]
              const updateItem = { 
                id, 
                Type: "logistics",
                ref: "longdriver",
                note: note.trim(), 
                forWhom, 
                byWhom: user.name, 
                when,
                ttl: isoToDT(calendarDateISO)
                  .plus({ days: 30 })
                  .toSeconds()
              }
              setIsSubmitting(true)
              updateLocalData(
                await submitMutations({ updateInputs: [updateItem]})
              )
              setIsSubmitting(false)


            }

            const handleDelete = (e, withConfirm=true) => {
              if (withConfirm) confirmPopup({
                target: e.currentTarget,
                message: 'Are you sure?',
                icon: 'pi pi-exclamation-triangle',
                accept: _handleDelete,
              })
              else handleDelete()
            }
            const _handleDelete = async e => {
              const id = noteValues[row._idx].id

              setIsSubmitting(true)
              updateLocalData(
                await submitMutations({ deleteInputs: [{ id }] })
              )
              setIsSubmitting(false)
            }

            return !!row.id
              ? EditCellTemplate({
                initialValue: notes[row._idx].note,
                value: noteValues[row._idx].note,
                isEditing: editRows[row._idx],
                startEdit,
                cancelEdit,
                updateNoteValue,
                handleUpdate,
                handleDelete,
                isSubmitting,
              })
              : CreateCellTemplate({
                  //initialValues: notes,
                  value: noteValues[row._idx].note,
                  updateNoteValue,
                  cancelEdit,
                  handleCreate,
                  isSubmitting,
                })
          }}
        />
      </DataTable>
      </div>
      <ConfirmPopup />
    </div>
  </div>)

}



const dateCellTemplate = (date, nItemsByDate) => {
  const yyyy = date.year
  const MM = ('0' + (date.month + 1)).slice(-2)
  const dd = ('0' + date.day).slice(-2)
  const dateISO = `${yyyy}-${MM}-${dd}`
  const hasItems = nItemsByDate[dateISO] > 0
  const templateStyle = {
    padding: "1rem",
    background: hasItems ? "rgb(160, 160, 160)" : '',
  }

  if (date.today) return date.day
  return ( 
    <div style={templateStyle}>
      {date.day}
    </div>
  )
}

const CreateCellTemplate = ({
  value, updateNoteValue, handleCreate, cancelEdit, isSubmitting
}) => {

  return (
    <div>
      <InputTextarea 
        autoResize
        placeholder={"New note..."}
        value={value}
        onChange={e => updateNoteValue(e.target.value)}
        rows={1}
        style={{width: "100%"}}
        onKeyDown={e => {
          if (e.key === "Escape") cancelEdit()
        }}
        disabled={isSubmitting}
      />
      <div style={{
        display:"flex",
        flexDirection: "row-reverse",
        gap: "1rem",
      }}>
        <Button 
          icon="pi pi-send"
          className="p-button-rounded"
          onClick={handleCreate}
          disabled={isSubmitting || !value?.trim()}
        />
        <Button 
          icon="pi pi-undo" 
          className="p-button-rounded p-button-text"
          onClick={cancelEdit} 
          disabled={isSubmitting || !value?.trim()}
        />
      </div>
    </div>
  )
}

const EditCellTemplate = ({    
  initialValue,     
  value,
  isEditing,
  startEdit,
  cancelEdit,
  updateNoteValue,
  handleUpdate,
  handleDelete, 
  isSubmitting,
}) => {


  return (
    <div>
      <div style={{minHeight: "3rem"}}>
        {isEditing  
          ? <InputTextarea 
              autoResize
              placeholder={"(value required)"}
              value={value}
              onChange={e => updateNoteValue(e.target.value)}
              rows={1}
              style={{width: "100%"}}
              onKeyDown={e => {
                if (e.key === "Escape") cancelEdit()
              }}
              readOnly={!isEditing}
              disabled={isSubmitting}
            />
          : <div style={{
              maxWidth: "25rem",
              padding: ".5rem",
              marginBottom: "5px",
              border: "solid 1px var(--bpb-surface-content)",
              whiteSpace: "pre-wrap",
            }}>
              {value}
            </div>
        }
      </div>

      <div style={{
        display: "flex", 
        flexDirection:"row-reverse", 
        gap: "1rem",
      }}>
        <Button icon={isEditing ? "pi pi-send" : "pi pi-pencil"}
          className="p-button-rounded"
          onClick={isEditing ? handleUpdate : startEdit} 
          disabled={
            isSubmitting 
            || (isEditing && value.trim() === initialValue.trim())
            || !value.trim()
          }
        />
        {isEditing && <Button 
          icon="pi pi-undo" 
          className="p-button-rounded p-button-text"
          onClick={cancelEdit} 
        />}
        {isEditing && <Button 
          icon="pi pi-trash" 
          className="p-button-rounded p-button-text"
          onClick={handleDelete}
        />}
      </div>

    </div>
  )
}

export { Notes as default }