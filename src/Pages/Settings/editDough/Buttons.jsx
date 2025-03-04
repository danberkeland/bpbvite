import React, { useRef, useState } from "react";

import styled from "styled-components";
// import swal from "@sweetalert/with-react";
// import "primereact/resources/themes/saga-blue/theme.css";

// import {
//   deleteDoughBackup,
//   createDoughComponentBackup,
//   updateDoughComponentBackup,
//   deleteDoughComponentBackup,
//   updateDoughBackup,
//   createDoughBackup,
// } from "../../../graphql/mutations";

import { Button } from "primereact/button";

// import { API, graphqlOperation } from "aws-amplify";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
// import { revalidateDough, revalidateDoughComponents } from "../../../data/doughData";
import { useListData } from "../../../data/_listData";

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
  doughComponents,
  isModified,
  setIsModified
}) => {

  const DOUGH = useListData({ tableName: "DoughBackup", shouldFetch: true })
  const DGCMP = useListData({ tableName: "DoughComponentBackup", shouldFetch: true})

  const [value, setValue] = useState();
  const toast = useRef(null);

  const [visible, setVisible] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const handleAddDough = async () => {
    let doughName;

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

    DOUGH.updateLocalData(
      await DOUGH.submitMutations({ createInputs: [addDetails ]})
    )

    const componentInputs = [
      levComponent,
      dryComponent,
      wetComponent,
      saltComponent,
      yeastComponent,
    ]

    DGCMP.updateLocalData(
      await DGCMP.submitMutations({ createInputs: componentInputs })
    )

    // await createDgh(addDetails);
    // await createDghComp(levComponent);
    // await createDghComp(dryComponent);
    // await createDghComp(wetComponent);
    // await createDghComp(saltComponent);
    // await createDghComp(yeastComponent);
   
    hideDialog();
  };

  // const createDgh = async (addDetails) => {
  //   try {
  //     await API.graphql(
  //       graphqlOperation(createDoughBackup, { input: { ...addDetails } })
  //     );
  //     revalidateDough()
  //   } catch (error) {
  //     console.log("error on creating Dough", error);
  //   }
  // };

  // const createDghComp = async (addDetails) => {
  //   try {
  //     await API.graphql(
  //       graphqlOperation(createDoughComponentBackup, {
  //         input: { ...addDetails },
  //       })
  //     );
      
  //   revalidateDoughComponents()
  //   } catch (error) {
  //     console.log("error on creating Dough Component", error);
  //   }
  // };

  // const deleteComps = async () => {
  //   // let deleteList = doughComponents.filter(
  //   //   (dgh) => dgh.dough === selectedDough.doughName
  //   // );
  //   // for (let comp of deleteList) {
  //   //   let id = comp.id;
  //   //   const deleteDetails = {
  //   //     id: id,
  //   //   };

  //   //   try {
  //   //     await API.graphql(
  //   //       graphqlOperation(deleteDoughComponentBackup, {
  //   //         input: { ...deleteDetails },
  //   //       })
  //   //     );
  //   //     revalidateDoughComponents()
  //   //   } catch (error) {
  //   //     console.log("error on deleting DoughComponent List", error);
  //   //   }
  //   // }
  //   const deleteInputs = doughComponents
  //     .filter(item => item.dough === selectedDough.doughName)
  //     .map(item => ({ id: item.id }))

  //   DGCMP.updateLocalData(
  //     await DGCMP.submitMutations({ deleteInputs })
  //   )
  // };

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

    const gqlResponse = 
      await DOUGH.submitMutations({ updateInputs: [updateDetails] })

    if (!gqlResponse.errors) {
      DOUGH.updateLocalData(gqlResponse)
      // revalidateDough()

      toast.current.show({
        severity: "success",
        summary: "Zone Updated",
        detail: `${updateDetails.doughName} has been updated.`,
        life: 3000,
      });

      setIsModified(false)

    } else {
      console.log("error on fetching Dough List");
    }

    // try {
    //   const doughData = await API.graphql(
    //     graphqlOperation(updateDoughBackup, { input: { ...updateDetails } })
    //   );

    //   toast.current.show({
    //     severity: "success",
    //     summary: "Zone Updated",
    //     detail: `${doughData.data.updateDoughBackup.doughName} has been updated.`,
    //     life: 3000,
    //   });

    //   setIsModified(false)

    // } catch (error) {
    //   console.log("error on fetching Dough List", error);
    // }


    const componentList = doughComponents.filter(item => 
      item.dough === selectedDough.doughName
    )

    const createInputs = componentList.filter(item =>
      !item.id
    ).map(item => ({
      dough:         item.dough,
      componentType: item.componentType,
      componentName: item.componentName,
      amount:        item.amount,
    }))

    const updateInputs = componentList.filter(item =>
      !!item.id && Number(item.amount) !== 0  
    ).map(item => ({
      id:            item.id,
      dough:         item.dough,
      componentType: item.componentType,
      componentName: item.componentName,
      amount:        item.amount,
    }))

    const deleteInputs = componentList.filter(item =>
      !!item.id && Number(item.amount) === 0
    ).map(item => ({ id: item.id }))

    const dgcmpResponse = 
      await DGCMP.submitMutations({ createInputs, updateInputs, deleteInputs })

    if (!dgcmpResponse.errors) {
      DGCMP.updateLocalData(dgcmpResponse)

      toast.current.show({
        severity: "success",
        summary: "Components Updated",
        detail: `Dough Components have been updated.`,
        life: 3000,
      });

    } else {
      console.log("error on fetching Dough List");
    }

    // let addBackList = doughComponents.filter(
    //   (dgh) => dgh.dough === selectedDough.doughName
    // );

    // for (let comp of addBackList) {
    //   if (comp.id && Number(comp.amount) === 0) {
    //     const newDetails = {
    //       id: comp.id,
    //     };

    //     try {
    //       await API.graphql(
    //         graphqlOperation(deleteDoughComponentBackup, {
    //           input: { ...newDetails },
    //         })
    //       );
    //     } catch (error) {
    //       console.log("error on updating Dough Component", error);
    //     }
    //   } else if (comp.id) {
    //     const newDetails = {
    //       id: comp.id,
    //       dough: comp.dough,
    //       componentType: comp.componentType,
    //       componentName: comp.componentName,
    //       amount: comp.amount,
    //     };

    //     try {
    //       await API.graphql(
    //         graphqlOperation(updateDoughComponentBackup, {
    //           input: { ...newDetails },
    //         })
    //       );
    //       const showSuccess = () => {
    //         toast.current.show({
    //           severity: "success",
    //           summary: "Zone Updated",
    //           detail: `Dough Component has been updated.`,
    //           life: 3000,
    //         });
    //       };
    //       showSuccess();
    //     } catch (error) {
    //       console.log("error on fetching Dough List", error);
    //     }
    //   } else {
    //     const newDetails = {
    //       dough: comp.dough,
    //       componentType: comp.componentType,
    //       componentName: comp.componentName,
    //       amount: comp.amount,
    //     };

    //     if (Number(newDetails.amount > 0)) {
    //       try {
    //         await API.graphql(
    //           graphqlOperation(createDoughComponentBackup, {
    //             input: { ...newDetails },
    //           })
    //         );
    //         const showSuccess = () => {
    //           toast.current.show({
    //             severity: "success",
    //             summary: "Zone Updated",
    //             detail: `Dough Component has been created.`,
    //             life: 3000,
    //           });
    //         };
    //         showSuccess();
    //       } catch (error) {
    //         console.log("error on fetching Dough List", error);
    //       }
    //     }
    //   }
    // }

   
  };

  const deleteDoughWarn = async () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteDgh(),
    });
  };

  const deleteDgh = async () => {
    const deleteDetails = {
      id: selectedDough["id"],
      _version: selectedDough["_version"],
    };

    const doughResponse = 
      await DOUGH.submitMutations({ deleteInputs: [deleteDetails] })

    if (!doughResponse.errors) {

      const deleteComponentInputs = doughComponents
        .filter(item => item.dough === selectedDough.doughName)
        .map(item => ({ id: item.id }))

      DGCMP.updateLocalData(
        await DGCMP.submitMutations({ deleteInputs: deleteComponentInputs })
      )
      DOUGH.updateLocalData(doughResponse)

    }

    setSelectedDough()

    // try {
    //   await API.graphql(
    //     graphqlOperation(deleteDoughBackup, { input: { ...deleteDetails } })
    //   );
    // } catch (error) {
    //   console.log("error on fetching Dough List", error);
    // }
    // deleteComps();
    // revalidateDough()
    // setSelectedDough();
   
  };

  return (
    <React.Fragment>
      <Toast ref={toast} />
      <ConfirmDialog />
      <ButtonBox>
        <Button
          label="Add a Dough"
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
              <Button label="Add" onClick={handleAddDough} />
            </div>
          }
        >
          <InputText value={value} onChange={(e) => setValue(e.target.value)} />
        </Dialog>
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
    </React.Fragment>
  );
};

export default Buttons;
