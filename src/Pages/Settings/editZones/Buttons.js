import React, { useState, useRef } from "react";

import styled from "styled-components";
// import swal from "@sweetalert/with-react";
//import "primereact/resources/themes/saga-blue/theme.css";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";

import { useListData } from "../../../data/_listData";

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: space-between;
  width: 80%;
  margin: 1rem 2rem;
`;

const Buttons = ({ selectedZone, setSelectedZone }) => {
  const [zoneNickInput, setZoneNickInput] = useState();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  console.log(selectedZone)
  console.log(zoneNickInput)
  const { createItem, updateItem, deleteItem, mutateLocal } = useListData({ 
    tableName: "Zone", 
    shouldFetch: true 
  })

  const toast = useRef(null);
  const showUpdateSuccess = (zoneName) => {
    toast.current.show({
      severity: "success",
      summary: "Zone Updated",
      detail: `${zoneName} has been updated.`,
      life: 3000,
    });
  };

  const createZone = async () => {
    const addDetails = {
      zoneNick: zoneNickInput,
      zoneName: zoneNickInput,
      zoneFee: 0,
    };
    const { data } = await createItem(addDetails)
    if (data) mutateLocal({ createdItems: [data] })
    setZoneNickInput()
    setShowCreateDialog(false)
  };

  const updateZone = async () => {
    const updateDetails = {
      zoneNick: selectedZone.zoneNick,
      zoneFee: selectedZone.zoneFee,
      // zoneName: selectedZone["zoneName"], << not editable, must be same as zoneNick
      //zoneNumber: ??? << attribute does not exist in appsync schema
    }
    const { data } = await updateItem(updateDetails)
    if (data) {
      mutateLocal({ updatedItems: [data] })
      showUpdateSuccess(data.zoneName)
    }
  }

  const deleteZoneDialog = () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteZone(),
    })
  }
  const deleteZone = async () => {
    const deleteDetails = {
      zoneNick: selectedZone.zoneNick,
    }
    const { data } = await deleteItem(deleteDetails)
    if (data) mutateLocal({ deletedItems: [data] })
    setSelectedZone()
  }

  return (
    // Apparently styled-components does not support flex gap...
    <ButtonBox style={{gap: "1rem"}}>
      <Button
        label="Add a Zone"
        icon="pi pi-plus"
        //onClick={() => setShowCreateDialog(true)}
        onClick={() => setShowCreateDialog(true)}
        className={"p-button-raised p-button-rounded"}
      />

      {selectedZone && <>
        <Button
          label="Update Zone"
          icon="pi pi-map"
          onClick={updateZone}
          className={"p-button-raised p-button-rounded p-button-success"}
        />
        <Button
          label="Delete Zone"
          icon="pi pi-minus"
          onClick={deleteZoneDialog}
          className={"p-button-raised p-button-rounded p-button-warning"}
        />
        <pre>{JSON.stringify(zoneNickInput)}</pre>
      </>}

      <Dialog
        visible={showCreateDialog}
        onHide={() => setShowCreateDialog(false)}
        header="Enter Zone Name"
        footer={<>
          <Button label="Cancel" onClick={() => setShowCreateDialog(false)} />
          <Button label="Add" onClick={createZone} />
        </>}
      >
        <InputText 
          value={zoneNickInput} 
          onChange={(e) => setZoneNickInput(e.target.value)} 
        />
      </Dialog>
      <Toast ref={toast} />
      <ConfirmDialog />

    </ButtonBox>
  );
};

export default Buttons;
