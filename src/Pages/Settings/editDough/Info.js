import React from "react";

import "primeflex/primeflex.css";

import DoughInfo from "./InfoParts/DoughInfo";
import PreMix from "./InfoParts/PreMix";
import Drys from "./InfoParts/Drys";
import Wets from "./InfoParts/Wets";
import Additions from "./InfoParts/Additions";
import Post from "./InfoParts/Post";

const Info = ({
  selectedDough,
  setSelectedDough,
  doughComponents,
  setDoughComponents,
  setIsModified,
}) => {
  return (
    <React.Fragment>
      <DoughInfo
        selectedDough={selectedDough}
        setSelectedDough={setSelectedDough}
        setIsModified={setIsModified}
      />
      <PreMix
        selectedDough={selectedDough}
        doughComponents={doughComponents}
        setDoughComponents={setDoughComponents}
        setIsModified={setIsModified}
      />
      <Drys
        selectedDough={selectedDough}
        doughComponents={doughComponents}
        setDoughComponents={setDoughComponents}
        setIsModified={setIsModified}
      />

      <Wets
        selectedDough={selectedDough}
        doughComponents={doughComponents}
        setDoughComponents={setDoughComponents}
        setIsModified={setIsModified}
      />

      <Additions
        selectedDough={selectedDough}
        doughComponents={doughComponents}
        setDoughComponents={setDoughComponents}
        setIsModified={setIsModified}
      />

      <Post
        selectedDough={selectedDough}
        doughComponents={doughComponents}
        setDoughComponents={setDoughComponents}
        setIsModified={setIsModified}
      />
    </React.Fragment>
  );
};

export default Info;
