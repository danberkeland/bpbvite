import React from "react";
import { CustomInputs } from "../../../FormComponents/CustomInputs";

import { validationSchema } from "./ValidationSchema";

// import { deleteLocation, updateLocation, createLocation } from "../../restAPIs";
// import {
//   createTraining,
//   updateTraining,
//   deleteTraining,
// } from "../../../data/trainingData.mjs";
import { withFadeIn } from "../../../hoc/withFadeIn";
import { withBPBForm } from "../../../hoc/withBPBForm";
import { GroupBox } from "../../../CommonStyles";
import { compose } from "../../../utils/_deprecated/utils";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";
import { useListData } from "../../../data/_listData";
// import { useSimpleZoneList } from "../../swr";
import * as yup from "yup"

const createTrainingSchema = yup.object().shape({
  Type: yup.string().default("Training"),
  role: yup.string().required("Required"),

  header: yup
    .string()

    .required("Required"),

  order: yup.number().required("Required"),
  instruction: yup.string(),
});


const BPB = new CustomInputs();

function TrainingDetails({ initialState }) {

  const isEdit = useSettingsStore((state) => state.isEdit);
  const TRAIN = useListData({ tableName: "Training", shouldFetch: true })

  const createTraining = async createTrainingInput => {
    if (!createTrainingSchema.isValid(createTrainingInput)) {
      TRAIN.updateLocalData(
        await TRAIN.submitMutations({ deleteInputs: [createTrainingInput]})
      )
    } else {
      console.log("createTraining validation failed")
      return
    }
  }  
  const updateTraining = async updateTrainingInput => {
    TRAIN.updateLocalData(
      await TRAIN.submitMutations({ deleteInputs: [updateTrainingInput]})
    )
  }
  const deleteTraining = async deleteTrainingInput => {
    TRAIN.updateLocalData(
      await TRAIN.submitMutations({ deleteInputs: [deleteTrainingInput]})
    )
  }
  

  const BPBTrainingForm = compose(
    withBPBForm,
    withFadeIn
  )((props) => {
    console.log("props", props);
    return (
      <React.Fragment>
        <div className="bpbSimpleForm">
          <GroupBox>
            <h2>
              <i className="pi pi-map"></i> Training
            </h2>

            <BPB.CustomTextInput label="Role" name="role" converter={props} />
            <BPB.CustomTextInput
              label="Heading"
              name="heading"
              converter={props}
            />
            {!isEdit ? (
              <BPB.CustomEditor
              label="Instructions"
              name="instruction"
              readOnly
              converter={props}
            />
            ) : (
              <BPB.CustomEditor
                label="Instructions"
                name="instruction"
                converter={props}
              />
            )}

            <BPB.CustomIntInput label="Order" name="order" converter={props} />
          </GroupBox>
        </div>
      </React.Fragment>
    );
  });

  return (
    <BPBTrainingForm
      name="settings/ManageTraining"
      validationSchema={validationSchema}
      initialState={initialState}
      create={createTraining}
      delete={deleteTraining}
      update={updateTraining}
    />
  );
}

export default TrainingDetails;
