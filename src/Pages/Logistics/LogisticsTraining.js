import React from "react";
import DOMPurify from 'dompurify';

// Components

import { Accordion, AccordionTab } from "primereact/accordion";
import { useTrainingListFull } from "../../data/trainingData";

function LogisticsTraining() {
  const { data: trainingList, errors: trainingListErrors } =
    useTrainingListFull(true);

  if (trainingListErrors) {
    return <div>Error loading data</div>;
  }

  if (!trainingList) {
    return <div>Loading data...</div>;
  }
  return (
    <div className="bpbAccordion">
      <React.Fragment>
        <h1>Long Driver Training</h1>

        <Accordion>
          {trainingList.map((item, index) => (
            <AccordionTab key={index} header={item.heading}>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.instruction) }}></div>
            </AccordionTab>
          ))}
        </Accordion>
      </React.Fragment>
    </div>
  );
}

export default LogisticsTraining;
