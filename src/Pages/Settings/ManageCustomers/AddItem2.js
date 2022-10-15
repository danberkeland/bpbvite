import React, { useEffect, useState } from "react";
import { useFormik } from "formik";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import { Dialog } from "primereact/dialog";

import { useSimpleLocationList } from "../../../swr";

export const AddItem2 = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});

  const { simpleLocationList } = useSimpleLocationList()



  const formik = useFormik({
    initialValues: {
      location: "",
      
    },

    onSubmit: (data) => {
      setFormData(data);
      setShowMessage(true);

      formik.resetForm();
    },
  });

  
  useEffect(() => {
    console.log("formik.values", formik.values)
  },[formik.values])


  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );

  return (
    <div className="form-demo">
      <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position="top"
        footer={dialogFooter}
        showHeader={false}
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "30vw" }}
      >
        <div className="flex align-items-center flex-column pt-6 px-3">
          <i
            className="pi pi-check-circle"
            style={{ fontSize: "5rem", color: "var(--green-500)" }}
          ></i>
          <h5>Registration Successful!</h5>
          <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
            Your account is registered under name <b>{formData.name}</b> ; it'll
            be valid next 30 days without activation. Please check{" "}
            <b>{formData.email}</b> for activation instructions.
          </p>
        </div>
      </Dialog>

      <div className="flex justify-content-center">
        <div className="card">
          <h5 className="text-center">Register</h5>
          <form onSubmit={formik.handleSubmit} className="p-fluid">
            {simpleLocationList.data && <div className="field">
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
            </div>}

            <Button type="submit" label="Submit" className="mt-2" />
          </form>
        </div>
      </div>
    </div>
  );
};
