import React, { useState } from "react";

import styled from "styled-components";
// import swal from "@sweetalert/with-react";
import "primereact/resources/themes/saga-blue/theme.css";

import { updateZone, deleteZone, createZone } from "../../../graphql/mutations";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";

import { API, graphqlOperation } from "aws-amplify";
import { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { useListData } from "../../../data/_listData";

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  width: 80%;
  margin: 5px 10px;
  padding: 5px 20px;
`;

const Buttons = ({ selectedZone, setSelectedZone }) => {
  const [value, setValue] = useState();
  const toast = useRef(null);

  const [visible, setVisible] = useState(false);

  const { createItem, updateItem, deleteItem } = useListData({ tableName: "Zone", shouldFetch: true })

  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const handleAddZone = async () => {
    const zoneName = value;
    const addDetails = {
      zoneNick: zoneName,
      zoneName: zoneName,
      zoneFee: 0,
    };
    await createItem(addDetails)
    hideDialog();
  };


  const updateZne = async () => {
    const updateDetails = {
      zoneName: selectedZone["zoneName"],
      zoneNick: selectedZone["zoneName"],
      zoneFee: selectedZone["zoneFee"],
    };

    try {
      const responseItem = await updateItem(updateDetails)
      const showSuccess = () => {
        toast.current.show({
          severity: "success",
          summary: "Zone Updated",
          detail: `${responseItem.zoneName} has been updated.`,
          life: 3000,
        });
      };
      showSuccess();
    } catch (error) {
      console.log("error on fetching Zone List", error);
    }
  };

  const deleteZoneWarn = async () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteZne(),
    });
  };

  const deleteZne = async () => {
    const deleteDetails = {
      zoneNick: selectedZone["zoneName"],
      // _version: selectedZone["_version"],
    };
    try {await deleteItem(deleteDetails)}
    catch (error) {console.log("error on fetching Zone List", error)}
  };

  return (
    <React.Fragment>
      <Toast ref={toast} />
      <ConfirmDialog />
      <ButtonBox>
        <Button
          label="Add a Zone"
          icon="pi pi-plus"
          onClick={showDialog}
          className={"p-button-raised p-button-rounded"}
        />
        
        <Dialog
          visible={visible}
          onHide={hideDialog}
          header="Enter Zone Name"
          footer={
            <div>
              <Button label="Cancel" onClick={hideDialog} />
              <Button label="Add" onClick={handleAddZone} />
            </div>
          }
        >
          <InputText value={value} onChange={(e) => setValue(e.target.value)} />
        </Dialog>
       
        
        <br />
        {selectedZone && (
          <React.Fragment>
            <Button
              label="Update Zone"
              icon="pi pi-map"
              onClick={updateZne}
              className={"p-button-raised p-button-rounded p-button-success"}
            />
            <br />
          </React.Fragment>
        )}
        {selectedZone && (
          <React.Fragment>
            <Button
              label="Delete Zone"
              icon="pi pi-minus"
              onClick={deleteZoneWarn}
              className={"p-button-raised p-button-rounded p-button-warning"}
            />
            <br />
            <br />
          </React.Fragment>
        )}
      </ButtonBox>
    </React.Fragment>
  );
};

export default Buttons;
