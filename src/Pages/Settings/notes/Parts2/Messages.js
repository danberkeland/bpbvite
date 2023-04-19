import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from "primereact/confirmdialog";

import { API, graphqlOperation } from "aws-amplify";
import { createNotes, deleteNotes, updateNotes } from "../../../../graphql/mutations";
import { revalidateNotes } from "../../../../data/notesData";

const Messages = ({ notes, delivDate }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedMessageToDelete, setSelectedMessageToDelete] = useState(null);
  const [showAllDates, setShowAllDates] = useState(true);


  const date = new Date(delivDate);
  const dateString = date.toISOString().slice(0, 10);

  console.log('notes', notes)

  const filteredNotes = showAllDates
  ? notes
  : notes.filter((note) => note.when === dateString);


  const options = {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const local = date.toLocaleDateString("en-US", options);

  const handleToggleFilter = () => {
    setShowAllDates(!showAllDates);
  };
  

  const handleEdit = (rowData) => {
    setSelectedMessage(rowData);
    setEditedMessage(rowData.note);
    setEditDialogVisible(true);
  };

  const handleSave = () => {
    if (selectedMessage.id){
      const addDetails = {
        id: selectedMessage.id,
        note: editedMessage,
        when: dateString,
      };
      updateNote(addDetails);
    } else {
      const addDetails = {
        note: editedMessage,
        when: dateString,
      };
      createNote(addDetails);
    }
    
    setEditDialogVisible(false);
  };

  const createNote = async (addDetails) => {
    try {
      await API.graphql(
        graphqlOperation(createNotes, { input: { ...addDetails } })
      );
      revalidateNotes();
    } catch (error) {
      console.log("error on creating Note", error);
    }
  };

  const updateNote = async (addDetails) => {
    try {
      await API.graphql(
        graphqlOperation(updateNotes, { input: { ...addDetails } })
      );
      revalidateNotes();
    } catch (error) {
      console.log("error on updating Note", error);
    }
  };

  const deleteNote = async (addDetails) => {
    try {
      await API.graphql(
        graphqlOperation(deleteNotes, { input: { ...addDetails } })
      );
      revalidateNotes();
    } catch (error) {
      console.log("error on deleting Note", error);
    }
  };

  const handleCancel = () => {
    setEditedMessage(selectedMessage.note);
    setEditDialogVisible(false);
  };

  const handleAdd = () => {
    setEditedMessage("");
    setSelectedMessage("")
    setEditDialogVisible(true);
  };

  const handleDelete = (rowData) => {
    setSelectedMessageToDelete(rowData);
    setConfirmDialogVisible(true);
  };

  const handleDeleteConfirmed = () => {
    const addDetails = {
      id: selectedMessageToDelete.id,
    };
    deleteNote(addDetails);

    setConfirmDialogVisible(false);
  };

  const handleDeleteRejected = () => {
    setConfirmDialogVisible(false);
  };

  const messageTemplate = (rowData) => {
    return (
      <div>
        <div>{rowData.note}</div>
        <div>{rowData.when}</div>
      </div>
    );
  };

  const actionTemplate = (rowData) => {
    return (
      <div>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => handleEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => handleDelete(rowData)}
        />
      </div>
    );
  };

  const header = "Create Note for " + local;

  return (
    <>
      <Button
        label="CREATE A NOTE"
        icon="pi pi-plus"
        className="p-button-rounded p-button-success p-mb-3"
        onClick={handleAdd}
      />
      <Button
  label={showAllDates ? "Filter by date" : "Show all dates"}
  icon="pi pi-filter"
  className="p-button-rounded p-button-secondary p-mr-2"
  onClick={handleToggleFilter}
/>

      <DataTable value={filteredNotes} className="p-datatable-striped">
        <Column header="Message" body={messageTemplate} />
        <Column header="Actions" body={actionTemplate} />
      </DataTable>
      <Dialog
        header={header}
        visible={editDialogVisible}
        style={{ width: "50%" }}
        onHide={() => setEditDialogVisible(false)}
        footer={
          <div>
            <Button label="Save" onClick={handleSave} />
            <Button
              label="Cancel"
              onClick={handleCancel}
              className="p-button-secondary"
            />
          </div>
        }
      >
        <InputText
          style={{ width: "80%" }}
          value={editedMessage}
          onChange={(e) => setEditedMessage(e.target.value)}
        />
      </Dialog>
      <ConfirmDialog
        visible={confirmDialogVisible}
        onHide={handleDeleteRejected}
        message="Are you sure you want to delete this message?"
        header="Confirmation"
        footer={
          <div>
            <Button
              label="Yes"
              icon="pi pi-check"
              onClick={handleDeleteConfirmed}
              className="p-button-danger"
            />
            <Button
              label="No"
              icon="pi pi-times"
              onClick={handleDeleteRejected}
              className="p-button-secondary"
            />
          </div>
        }
      />
    </>
  );
};

export default Messages;
