
import React, { useState, useEffect } from "react"
import { useOrderNotesByCustomer } from "../../data/noteHooks"
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "primereact/button"

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


const OrderNotes = ({ locNick, user }) => {

  const {
    data:notes,
    submitMutations,
    updateLocalData,
  } = useOrderNotesByCustomer({
    locNick,
    shouldFetch: user.authClass === "bpbfull"
  })


  const [noteValues, setNoteValues] = useState([])
  const [editRows, setEditRows] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!!notes) {
      setNoteValues(notes)
      setEditRows(notes.map(N => false))
    }
  }, [notes])
  
  return(<>
    <DataTable 
      value={notes}
      responsiveLayout="scroll"
      scrollHeight="50rem"
      style={{
        width: "27rem",
      }}
    >
      <Column 
        headerStyle={{ display: 'none '}}
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
              Type: "ordering",
              ref: locNick,
              forWhom,
              byWhom: user.name, 
              note: note.trim(),
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
              Type: "ordering",
              ref: "locNick",
              note: note.trim(), 
              forWhom, 
              byWhom: user.name, 
              when
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
              initialValue: notes[row._idx]?.note ?? '',
              value: noteValues[row._idx]?.note ?? '',
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
                value: noteValues[row._idx]?.note ?? '',
                updateNoteValue,
                cancelEdit,
                handleCreate,
                isSubmitting,
              })
          }}
      />
    </DataTable>
    <ConfirmPopup />
  </>
  )
}

export { OrderNotes }