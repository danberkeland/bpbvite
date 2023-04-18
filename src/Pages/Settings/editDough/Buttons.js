import React from "react";

import styled from "styled-components";
// import swal from "@sweetalert/with-react";
import "primereact/resources/themes/saga-blue/theme.css";

import {
  
  deleteDoughBackup,
  createDoughComponentBackup,
  updateDoughComponentBackup,
  deleteDoughComponentBackup,
  updateDoughBackup,
  createDoughBackup
} from "../../../graphql/mutations";

import { Button } from "primereact/button";

import { API, graphqlOperation } from "aws-amplify";


const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  width: 80%;
  margin: 5px 10px;
  padding: 5px 20px;
`;

const Buttons = ({
  selectedDough,
  setSelectedDough,
  doughs,
  setDoughs,
  doughComponents,
  setDoughComponents,
  isModified,
  setIsModified,
  isReload,
  setIsReload,
}) => {
  const handleAddDough = () => {
    let doughName;
    /*
    swal("Enter Dough Name:", {
      content: "input",
    }).then(async (value) => {
      doughName = value;
      const addDetails = {
        doughName: doughName,
        hydration: 60,
        process: [
          "scale",
          "mix",
          "bulk",
          "divide",
          "shape",
          "proof",
          "bake",
          "cool",
        ],
        batchSize: 60,
        mixedWhere: "Carlton",
        components: ["lev", "dry", "wet", "dryplus"],
      };

      const levComponent = {
        dough: doughName,
        componentType: "lev",
        componentName: "Levain",
        amount: 20,
      };

      const dryComponent = {
        dough: doughName,
        componentType: "dry",
        componentName: "Bread Flour",
        amount: 100,
      };

      const wetComponent = {
        dough: doughName,
        componentType: "wet",
        componentName: "Water",
        amount: 100,
      };

      const saltComponent = {
        dough: doughName,
        componentType: "dryplus",
        componentName: "Salt",
        amount: 2,
      };

      const yeastComponent = {
        dough: doughName,
        componentType: "dryplus",
        componentName: "Yeast",
        amount: 1,
      };

      await createDgh(addDetails);
      await createDghComp(levComponent);
      await createDghComp(dryComponent);
      await createDghComp(wetComponent);
      await createDghComp(saltComponent);
      await createDghComp(yeastComponent);
      setIsReload(!isReload);
      
    });
    */
  };

  const createDgh = async (addDetails) => {
    try {
      await API.graphql(
        graphqlOperation(createDoughBackup, { input: { ...addDetails } })
      );
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
  };

  const createDghComp = async (addDetails) => {
    try {
      await API.graphql(
        graphqlOperation(createDoughComponentBackup, { input: { ...addDetails } })
      );
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
  };

  const deleteComps = async () => {
    let deleteList = doughComponents.filter(
      (dgh) => dgh.dough === selectedDough.doughName
    );
    for (let comp of deleteList) {
      let id = comp.id;
      const deleteDetails = {
        id: id,
      };

      try {
        await API.graphql(
          graphqlOperation(deleteDoughComponentBackup, {
            input: { ...deleteDetails },
          })
        );
      } catch (error) {
        console.log("error on deleting DoughComponent List", error);
      }
    }
  };

  const updateDgh = async () => {
    const updateDetails = {
      id: selectedDough.id,
      doughName: selectedDough.doughName,
      ingredients: selectedDough.ingredients,
      process: selectedDough.process,
      batchSize: selectedDough.batchSize,
      hydration: selectedDough.hydration,
      buffer: selectedDough.buffer,
      isBakeReady: selectedDough.isBakeReady,
      saltInDry: selectedDough.saltInDry,
      mixedWhere: selectedDough.mixedWhere,

      _version: selectedDough["_version"],
    };

    try {
      const doughData = await API.graphql(
        graphqlOperation(updateDoughBackup, { input: { ...updateDetails } })
      );
        /*
      swal({
        text: `${doughData.data.updateDough.doughName} has been updated.`,
        icon: "success",
        buttons: false,
        timer: 2000,
      });*/
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }

    let addBackList = doughComponents.filter(
      (dgh) => dgh.dough === selectedDough.doughName
    );

    for (let comp of addBackList) {
     
      if (comp.id && Number(comp.amount) === 0){
        const newDetails = {
          id: comp.id,
        };
        
          try {
            await API.graphql(
              graphqlOperation(deleteDoughComponentBackup, {
                input: { ...newDetails },
              })
            );
          } catch (error) {
            console.log("error on fetching Dough List", error);
          }
        
      }
      else if (comp.id) {
        const newDetails = {
          id: comp.id,
          dough: comp.dough,
          componentType: comp.componentType,
          componentName: comp.componentName,
          amount: comp.amount,
        };
        
          try {
            await API.graphql(
              graphqlOperation(updateDoughComponentBackup, {
                input: { ...newDetails },
              })
            );
          } catch (error) {
            console.log("error on fetching Dough List", error);
          }
        
      } else {
        const newDetails = {
          dough: comp.dough,
          componentType: comp.componentType,
          componentName: comp.componentName,
          amount: comp.amount,
        };
        
        if (Number(newDetails.amount > 0)) {
          try {
            await API.graphql(
              graphqlOperation(createDoughComponentBackup, {
                input: { ...newDetails },
              })
            );
          } catch (error) {
            console.log("error on fetching Dough List", error);
          }
        }
      }
    }
    
    setIsReload(!isReload);
  };

  const deleteDoughWarn = async () => {
    /*
    swal({
      text:
        " Are you sure that you would like to permanently delete this dough?",
      icon: "warning",
      buttons: ["Yes", "Don't do it!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (!willDelete) {
        deleteDgh();

        // delete dough components
      } else {
        return;
      }
    });*/
  };

  const deleteDgh = async () => {
    const deleteDetails = {
      id: selectedDough["id"],
      _version: selectedDough["_version"],
    };

    try {
      await API.graphql(
        graphqlOperation(deleteDoughBackup, { input: { ...deleteDetails } })
      );
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
    deleteComps();

    setSelectedDough();
    setIsReload(!isReload);
  };

  return (
    <ButtonBox>
      <Button
        label="Add a Dough"
        icon="pi pi-plus"
        onClick={handleAddDough}
        className={"p-button-raised p-button-rounded"}
      />
      <br />
      {selectedDough && (
        <React.Fragment>
          <Button
            label="Update Dough"
            icon="pi pi-user-edit"
            onClick={updateDgh}
            className={
              isModified
                ? "p-button-raised p-button-rounded p-button-danger"
                : "p-button-raised p-button-rounded p-button-success"
            }
          />
          <br />
        </React.Fragment>
      )}
      {selectedDough && (
        <React.Fragment>
          <Button
            label="Delete Dough"
            icon="pi pi-user-minus"
            onClick={deleteDoughWarn}
            className={"p-button-raised p-button-rounded p-button-warning"}
          />
          <br />
          <br />
        </React.Fragment>
      )}
    </ButtonBox>
  );
};

export default Buttons;
