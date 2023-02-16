import React from "react";
import { CustomInputs } from "../../../FormComponents/CustomInputs";

import { validationSchema } from "./ValidationSchema";

// import { deleteLocation, updateLocation, createLocation } from "../../restAPIs";
import {
  createTraining,
  updateTraining,
  deleteTraining,
} from "../../../data/trainingData";
import { withFadeIn } from "../../../hoc/withFadeIn";
import { withBPBForm } from "../../../hoc/withBPBForm";
import { GroupBox } from "../../../CommonStyles";
import { compose } from "../../../utils";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";
// import { useSimpleZoneList } from "../../swr";

const BPB = new CustomInputs();

function TrainingDetails({ initialState }) {

  const isEdit = useSettingsStore((state) => state.isEdit);


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
            <BPB.CustomTextInput
              label="Instruction"
              name="instruction"
              converter={props}
            />

            <BPB.CustomIntInput label="Order" name="order" converter={props} />
          </GroupBox>
        </div>
      </React.Fragment>
    );
  });

  return (
    <BPBTrainingForm
      name="training"
      validationSchema={validationSchema}
      initialState={initialState}
      create={createTraining}
      delete={deleteTraining}
      update={updateTraining}
    />
  );
}

export default TrainingDetails;
