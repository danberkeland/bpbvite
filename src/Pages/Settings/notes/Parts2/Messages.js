import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from "primereact/confirmdialog";
import { getWorkingDateTime } from "../../../../functions/dateAndTime";
import { DummyMessages } from "./DummyMessages";

const Messages = () => {
  const [messages, setMessages] = useState(DummyMessages);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedMessageToDelete, setSelectedMessageToDelete] = useState(null);

  const handleEdit = (rowData) => {
    setSelectedMessage(rowData);
    setEditedMessage(rowData.message);
    setEditDialogVisible(true);
  };

  const handleSave = () => {
    const updatedMessages = messages.map((message) => {
      if (message === selectedMessage) {
        return { ...message, message: editedMessage };
      } else {
        return message;
      }
    });

    setMessages(updatedMessages);
    setEditDialogVisible(false);
  };

  const handleCancel = () => {
    setEditedMessage(selectedMessage.message);
    setEditDialogVisible(false);
  };

  const handleAdd = () => {
    setEditedMessage("");
    setEditDialogVisible(true);
  };

  const handleDelete = (rowData) => {
    setSelectedMessageToDelete(rowData);
    setConfirmDialogVisible(true);
  };

  const handleDeleteConfirmed = () => {
    const updatedMessages = messages.filter(
      (message) => message !== selectedMessageToDelete
    );
    setMessages(updatedMessages);
    setConfirmDialogVisible(false);
  };

  const handleDeleteRejected = () => {
    setConfirmDialogVisible(false);
  };

  const messageTemplate = (rowData) => {
    return (
      <div>
        <div>{rowData.message}</div>
        <div>{rowData.date.toLocaleDateString()}</div>
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

  return (
    <>
      <Button
        label="Add Message"
        icon="pi pi-plus"
        className="p-button-rounded p-button-success p-mb-3"
        onClick={handleAdd}
      />
      <DataTable value={messages} className="p-datatable-striped">
        <Column header="Message" body={messageTemplate} />
        <Column header="Actions" body={actionTemplate} />
      </DataTable>
      <Dialog
        header="Edit Message"
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
