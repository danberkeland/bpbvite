import React from "react";
import { useFormik } from "formik";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import { useSimpleLocationList } from "../../../swr";

export const AddItem2 = (props) => {
  const { simpleLocationList } = useSimpleLocationList();

  console.log("props", props);
  console.log('simpleLocationList.data', simpleLocationList.data)

  const formik = useFormik({
    initialValues: {
      location: "",
      authType: "",
    },

    onSubmit: (data) => {
      const newLocUser = {
        authType: Number(data.authType),
        locNick: data.location,
        sub: props.initialValues.sub,
        Type: "LocationUser",
      };

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
                <div className="field">
                  <span className="p-float-label">
                    <Dropdown
                      id="location"
                      name="location"
                      value={formik.values.location}
                      onChange={formik.handleChange}
                      options={simpleLocationList.data.filter(
                        (data) =>
                          !props.selectedCustomer.location.includes(data.value)
                      )}
                      optionLabel="label"
                    />
                    <label htmlFor="location">Location</label>
                  </span>
                </div>
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
              </React.Fragment>
            )}

            <Button type="submit" label="Submit" className="mt-2" />
          </form>
        </div>
      </div>
    </div>
  );
};
