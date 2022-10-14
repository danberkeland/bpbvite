import React, { useEffect } from "react";
import { CustomInputs } from "../../../FormComponents/CustomInputs";

import { validationSchema } from "./ValidationSchema";

import { deleteUser, updateUser, createUser } from "../../../restAPIs";
import { withFadeIn } from "../../../hoc/withFadeIn";
import { withBPBForm } from "../../../hoc/withBPBForm";
import { GroupBox } from "../../../CommonStyles";
import { compose } from "../../../utils";
import { useCustomerList } from "../../../swr";

const BPB = new CustomInputs();

function CustomerDetails({ initialState, selectedCustomer, activeIndex }) {
  const { customerList } = useCustomerList();

  const BPBUserForm = compose(
    withBPBForm,
    withFadeIn
  )((props) => {
    return (
      <React.Fragment>
        <div className="productDetails">
          <h1>
            {activeIndex === 0
              ? selectedCustomer.custName
              : selectedCustomer.locNick}
          </h1>
          {activeIndex === 0 ? (
            <GroupBox>
              <h2>
                <i className="pi pi-user"></i> Customer Description{" "}
              </h2>

              <BPB.CustomTextInput
                label="Customer Name"
                name="custName"
                converter={props}
              />
              <BPB.CustomTextInput
                label="Class"
                name="authClass"
                converter={props}
              />

              {customerList.data
                .filter((cust) => cust.custName === selectedCustomer.custName)
                .map((item, ind) => (
                  <GroupBox key={"group" + ind}>
                    <h2>
                      <i className="pi pi-user"></i> Location Info{" "}
                    </h2>

                    <BPB.CustomTextInput
                      key={"location" + ind}
                      name={"location" + ind}
                      label="Location"
                      attr={item.locNick}
                      converter={props}
                    />
                    <BPB.CustomTextInput
                      key={"auth" + ind}
                      name={"auth" + ind}
                      label="Auth Type"
                      attr={item.authType}
                      converter={props}
                    />
                  </GroupBox>
                ))}
            </GroupBox>
          ) : (
            <GroupBox>
              <h2>
                <i className="pi pi-user"></i> Location Description
              </h2>

              {customerList.data
                .filter((cust) => cust.locNick === selectedCustomer.locNick)
                .map((item, ind) => (
                  <GroupBox key={"group" + ind}>
                    <h2>
                      <i className="pi pi-user"></i> Customer Info
                    </h2>
                    <BPB.CustomTextInput
                      key={"customer" + ind}
                      name={"customer" + ind}
                      label="Customer"
                      attr={item.custName}
                      converter={props}
                    />
                    <BPB.CustomTextInput
                      key={"auth" + ind}
                      name={"auth" + ind}
                      label="Auth Type"
                      attr={item.authType}
                      converter={props}
                    />
                  </GroupBox>
                ))}
            </GroupBox>
          )}
        </div>
      </React.Fragment>
    );
  });

  return (
    <BPBUserForm
      name="user"
      validationSchema={validationSchema}
      initialState={initialState}
      create={createUser}
      delete={deleteUser}
      update={updateUser}
    />
  );
}

export default CustomerDetails;
