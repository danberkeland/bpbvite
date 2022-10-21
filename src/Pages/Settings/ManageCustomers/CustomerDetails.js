import React from "react";

import { validationSchema } from "./ValidationSchema";

import { deleteUser, updateUser, createUser } from "../../../restAPIs";
import { withFadeIn } from "../../../hoc/withFadeIn";
import { withBPBForm } from "../../../hoc/withBPBForm";

import { compose } from "../../../utils";

import CustomerDescription from "./CustomerDescription";
import LocationDescription from "./LocationDescription";

function CustomerDetails({
  initialState,
  selectedCustomer = { initialState },
  activeIndex = 0,
}) {
  const BPBUserForm = compose(
    withBPBForm,
    withFadeIn
  )((props) => {
    console.log("props.values", props.values);

    return (
      <React.Fragment>
        <div className="productDetails">
          <h1>
            {activeIndex === 0
              ? selectedCustomer.custName
              : selectedCustomer.locName}
          </h1>
          {activeIndex === 0 ? (
            <CustomerDescription
              {...props}
              activeIndex={activeIndex}
              selectedCustomer={selectedCustomer}
            />
          ) : (
            <LocationDescription
              {...props}
              activeIndex={activeIndex}
              selectedCustomer={selectedCustomer}
            />
          )}
        </div>
      </React.Fragment>
    );
  });

  return (
    <React.Fragment>
      <BPBUserForm
        name="settings/ManageCustomer"
        validationSchema={validationSchema}
        initialState={initialState}
        create={createUser}
        delete={deleteUser}
        update={updateUser}
      />
    </React.Fragment>
  );
}

export default CustomerDetails;
