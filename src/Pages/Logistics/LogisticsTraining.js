import React from "react";

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
              <div dangerouslySetInnerHTML={{ __html: item.instruction }}></div>
            </AccordionTab>
          ))}
        </Accordion>
       
        {/*}
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
          <AccordionTab header="Load Pockets and shaped product">
            <p className="m-0">
              From the Pockets North grid on the Long North Driver List, gather
              mini dutch pockets and pre shaped ficelle from the walk in fridge
              and load onto van.
            </p>
            <p className="m-0">
              Be delicate with these. Make sure they remain properly covered
              during transit.
            </p>
          </AccordionTab>
          <AccordionTab header="Check desk/front door area">
            <p className="m-0">
              Scan front desk area for additional stuff that may need to go
              north. This could include pantry products, coffee, paper bags or
              stickers, paychecks, etc.
            </p>
            <p className="m-0">
              This should all be indicated for you but always double check when
              in doubt.
            </p>
          </AccordionTab>
          <AccordionTab header="Check van for additional stuff going up">
            <p className="m-0">
              Sometimes things will be placed in the van overnight for north
              delivery. Check van for these and see that they get taken to cafe.
            </p>
          </AccordionTab>
          <AccordionTab header="Check walk-in for produce, etc.">
            <p className="m-0">
              Check the walk-in fridge for crates or boxes of product that need
              to go up to the cafe. This will usually include produce, meats,
              cheeses, etc. form Costco or Smart n Final.
            </p>
            <p className="m-0">
              This should be indicated for you in the walk-in.
            </p>
          </AccordionTab>
          <AccordionTab header="Grab invoices and route lists.  Depart Prado.">
            <p className="m-0">
              I think you're ready to go! Don't forget your invoices and route
              lists. Drive safely.
            </p>
          </AccordionTab>
          <AccordionTab header="Arrive at Carlton">
            <p className="m-0">Park in front of Carlton.</p>
            <p className="m-0">
              Middle hall door should be propped open for you. If not, go in
              through front desk area and open the hallway doors to the outside.
            </p>
          </AccordionTab>
          <AccordionTab header="Unload frozen croissants">
            <p className="m-0">Frozen croix go into walk-in freezer.</p>
            <p className="m-0">
              Be sure to empty contents of each croix container, load with
              newest croix, and then return older croix to the top of the stack
              to ensure that they are properly rotated.
            </p>
          </AccordionTab>
          <AccordionTab header="Unload frozen almonds">
            <p className="m-0">
              Frozen almonds get loaded into speed rack in walk-in freezer.
            </p>
            <p className="m-0">
              Be sure to move older almonds up and put newer almonds at the
              bottom.
            </p>
          </AccordionTab>
          <AccordionTab header="Unload proofing, unbaked products">
            <p className="m-0">
              Deliver unbaked ficelle and any other unbaked product to the
              morning baker.
            </p>
          </AccordionTab>
          <AccordionTab header="Unload breads and pastries">
            <p className="m-0">
              All other breads and pastries can be brought in and placed on the
              long metal table to be sorted for delivery and cafe use.
            </p>
          </AccordionTab>
          <AccordionTab header="Communicate with cook on Costco stuff">
            <p className="m-0">
              Check with bakery crew on what to do with Costco stuff.
            </p>
            <p className="m-0">
              Some stuff may need to be refrigerated immediately. Be sure to
              coordinate a plan with the cook.
            </p>
          </AccordionTab>
          <AccordionTab header="Take back sheet pans, pins, and couches">
            <p className="m-0">
              Keep track of how many sheet pans, bins, couches are brought into
              bakery.
            </p>
            <p className="m-0">
              That's how many need to go back to Prado. Might as well load them
              into the van immediately.
            </p>
          </AccordionTab>
          <AccordionTab header="Post Carlton Pickup list and invoices">
            <p className="m-0">
              Clip Carlton Pickup list and invoices to rail above long metal
              table.
            </p>
            <p className="m-0">
              Communicate well with bakery crew on how these pickups will be
              handled.
            </p>
          </AccordionTab>
          <AccordionTab header="Prepare orders for AM North County run">
            <p className="m-0">Pack and load AM North deliveries.</p>
            <p className="m-0">
              Always double check for accuracy. Make sure you have all related
              invoices.
            </p>
          </AccordionTab>
          <AccordionTab header="DOUBLE CHECK">
            <p className="m-0">I mean it!</p>
            <p className="m-0">Triple check your deliveries!</p>
          </AccordionTab>
          <AccordionTab header="Make AM North Deliveries">
            <p className="m-0">
              Drive carefully. SMILE. You are the face of the Back Porch Bakery.
            </p>
            <p className="m-0">
              Click location links below for detailed information about each
              location as well as specific instructions.
            </p>
          </AccordionTab>
          </Accordion>*/}
      </React.Fragment>
    </div>
  );
}

export default LogisticsTraining;
