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
    await createZne(addDetails, zoneName);
    hideDialog();
  };

  const createZne = async (addDetails) => {
    try {
      await API.graphql(
        graphqlOperation(createZone, { input: { ...addDetails } })
      );
    } catch (error) {
      console.log("error on fetching Zone List", error);
    }
  };

  const updateZne = async () => {
    const updateDetails = {
      zoneName: selectedZone["zoneName"],
      zoneNick: selectedZone["zoneName"],
      zoneFee: selectedZone["zoneFee"],
      _version: selectedZone["_version"],
    };

    try {
      const zoneData = await API.graphql(
        graphqlOperation(updateZone, { input: { ...updateDetails } })
      );
      const showSuccess = () => {
        toast.current.show({
          severity: "success",
          summary: "Zone Updated",
          detail: `${zoneData.data.updateZone.zoneName} has been updated.`,
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
      _version: selectedZone["_version"],
    };

    try {
      await API.graphql(
        graphqlOperation(deleteZone, { input: { ...deleteDetails } })
      );
      setSelectedZone();
    } catch (error) {
      console.log("error on fetching Zone List", error);
    }
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
