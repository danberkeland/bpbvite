import React from "react";
import { CustomInputs } from "../../../FormComponents/CustomInputs";

import { validationSchema } from "./ValidationSchema";

import { Button } from "primereact/button";

import { deleteUser, updateUser, createUser } from "../../../restAPIs";
import { withFadeIn } from "../../../hoc/withFadeIn";
import { withBPBForm } from "../../../hoc/withBPBForm";
import { GroupBox } from "../../../CommonStyles";
import { compose } from "../../../utils";
import { useCustomerList, useSimpleLocationList } from "../../../swr";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";

const BPB = new CustomInputs();

function CustomerDetails({
  initialState,
  selectedCustomer = { initialState },
  activeIndex = 0,
}) {
  const { customerList } = useCustomerList();
  const add = useSettingsStore((state) => state.add);

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
                dontedit="true"
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
                    <Button type="button" label="delete" />

                    <BPB.CustomTextInput
                      key={"location" + ind}
                      name={`location[${ind}]`}
                      label="Location"
                      dontedit="true"
                      converter={{ ...props }}
                    />
                    <BPB.CustomTextInput
                      key={"auth" + ind}
                      name={`auth[${ind}]`}
                      label="Auth Type"
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
                    <Button type="button" label="delete" />
                    <BPB.CustomTextInput
                      key={"customer" + ind}
                      name={`customer[${ind}]`}
                      label="Customer"
                      dontedit="true"
                      converter={props}
                    />
                    <BPB.CustomTextInput
                      key={"auth" + ind}
                      name={`auth[${ind}]`}
                      label="Auth Type"
                      converter={props}
                    />
                  </GroupBox>
                ))}
            </GroupBox>
          )}
          <GroupBox>
            <Button type="button" label="add" />
          </GroupBox>
        </div>
      </React.Fragment>
    );
  });

  return (
    <React.Fragment>
      <BPBUserForm
        name="user"
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
