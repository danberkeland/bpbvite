import React from "react";
import { useFormik } from "formik";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import { useSimpleCustomerList, useSimpleLocationList } from "../../../swr";
import { createLocationUser } from "../../../restAPIs";

export const AddItem = (props) => {
  const { simpleLocationList } = useSimpleLocationList();
  const { simpleCustomerList } = useSimpleCustomerList();

  console.log("addOnProps", props);
  console.log("simpleLocationList", simpleLocationList);
  console.log("simpleCustomerList", simpleCustomerList);

  const checkForAddOns = () => {
    if (
      (props.id === "Location" &&
        simpleLocationList.data.filter(
          (data) => !props.selectedCustomer.location.includes(data.value)
        ).length > 0) ||
      (props.id === "Customer" &&
        simpleCustomerList.data.filter(
          (data) => !props.selectedCustomer.customer.includes(data.value)
        ).length > 0)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const formik = useFormik({
    initialValues: {
      location: "",
      customer: "",
      authType: "",
    },

    onSubmit: (data) => {
      console.log("data", data);
      const newLocUser = {
        authType: Number(data.authType),
        locNick:
          props.id === "Location" ? data.location : props.initialValues.locNick,
        sub: props.id === "Location" ? props.initialValues.sub : data.customer,
        Type: "LocationUser",
      };
      createLocationUser(newLocUser).then(() => {
        window.location = "/Settings/ManageCustomers";
      });
      console.log("newLocUser", newLocUser);
      formik.resetForm();
    },
  });

  const authTypes = [
    { label: "Admin", value: 1 },
    { label: "Manager", value: 2 },
    { label: "Read Only", value: 3 },
  ];

  return (
    <div className="form-demo">
      <div className="flex justify-content-center">
        <div className="card">
          <h5 className="text-center">Register</h5>
          <form onSubmit={formik.handleSubmit} className="p-fluid">
            {simpleLocationList.data && (
              <React.Fragment>
                {props.id === "Location" && (
                  <div className="field">
                    <span className="p-float-label">
                      
                      <Dropdown
                        id="location"
                        name="location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        options={simpleLocationList.data}
                        optionLabel="label"
                />
                      <label htmlFor="location">Location</label>
                    </span>
                  </div>
                )}
                {props.id === "Customer" && (
                  <div className="field">
                    <span className="p-float-label">
                      <Dropdown
                        id="customer"
                        name="customer"
                        value={formik.values.customer}
                        onChange={formik.handleChange}
                        options={simpleCustomerList}
                        optionLabel="label"
                      />
                      <label htmlFor="customer">Customer</label>
                    </span>
                  </div>
                )}
                <div className="field">
                  <span className="p-float-label">
                    <Dropdown
                      id="authType"
                      name="authType"
                      value={formik.values.authType}
                      onChange={formik.handleChange}
                      options={authTypes}
                      optionLabel="label"
                    />
                    <label htmlFor="authType">Auth Type</label>
                  </span>
                </div>
               
                  <Button type="submit" label="Submit" className="mt-2" />
               
              </React.Fragment>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
