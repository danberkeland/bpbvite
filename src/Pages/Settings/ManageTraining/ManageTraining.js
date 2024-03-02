import React, { useState } from "react";

import TrainingList from "./TrainingList";
import TrainingDetails from "./TrainingDetails";
import { withFadeIn } from "../../../components/hoc/withFadeIn";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";

function ManageTraining() {
  const [selectedTraining, setSelectedTraining] = useState("");
  const setIsEdit = useSettingsStore((state) => state.setIsEdit);

  const handleLocClick = () => {
    setSelectedTraining("");
    setIsEdit(false);
    
  };

  const FadeTrainingList = withFadeIn(() => {
    return (
      <TrainingList
        selectedTraining={selectedTraining}
        setSelectedTraining={setSelectedTraining}
      />
    );
  });

  return (
    <React.Fragment>
      {selectedTraining === "" ? (
        <FadeTrainingList />
      ) : (
        <React.Fragment>
          <button className="fullButton" onClick={handleLocClick}>TRAINING LIST</button>
          <TrainingDetails initialState={selectedTraining} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default ManageTraining;
