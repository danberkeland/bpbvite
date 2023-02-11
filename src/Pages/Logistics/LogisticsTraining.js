import React from "react";

// Components

import { Accordion, AccordionTab } from "primereact/accordion";

function LogisticsTraining() {
  return (
    <div>
      <React.Fragment>
        <h1>Training</h1>
        <Accordion>
          <AccordionTab header="Print North Driver Lists">
            <p className="m-0">On office computer, go to:</p>
            <p className="m-0">
              bpbadmin.com {">"} Logistics {">"} North Driver Lists
            </p>
            <p className="m-0">
              Print both <strong>Long Driver North List</strong> and{" "}
              <strong>Long Driver South List</strong>
            </p>
          </AccordionTab>
          <AccordionTab header="Print Invoices and Route Lists">
            <p className="m-0">
              Make sure there is plenty of paper in the printer. On office
              computer, go to:
            </p>
            <p className="m-0">
              bpbadmin.com {">"} Logistics {">"} By Route
            </p>
            <p className="m-0">
              Click <strong>Print All Routes</strong>
            </p>
            <p>
              This will take time to generate. While this is running, you can
              begin gathering the items on the North Driver List.
            </p>
          </AccordionTab>
          <AccordionTab header="Load Van for North Run">
            <p className="m-0">
              Use AM North Pack as reference for loading the van.
            </p>
            <p>
              <strong>Trust the list!!</strong>
            </p>
            <p>
              if anything seems wrong, be sure to check with Dan or text
              wholesale line before making any changes.
            </p>
          </AccordionTab>
          <AccordionTab header="Pack Load frozen croix">
            <p className="m-0">
              Frozen croix go in zip lock bags. Take EXACTLY the amount
              indicated on the North Driver List.
            </p>
            <p className="m-0">
              Load bags into cooler and put cooler on van for transport.
            </p>
          </AccordionTab>
          <AccordionTab header="Load frozen almonds">
            <p className="m-0">
              Take EXACTLY the amount indicated on the Long North Driver List.
            </p>
            <p className="m-0">
              These can be transported on sheet pans loaded onto shelves of van.
              Pay attention to loading these as contents may shift in transit.
            </p>
          </AccordionTab>
          <AccordionTab header="Load Breads and Pastries">
            <p className="m-0">
              Load breads and pastries as indicated on Long North Driver List in
              the grid labeled Shelf Products.
            </p>
            <p className="m-0">Refer to totals at the bottom of the grid.</p>
          </AccordionTab>
        </Accordion>
      </React.Fragment>
    </div>
  );
}

export default LogisticsTraining;
