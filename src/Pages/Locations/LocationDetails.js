import React, { useEffect } from "react";

import { Form, Formik } from "formik";

import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method // To use confirmDialog method

import { motion } from "framer-motion";
import {
  CustomIDInput,
  CustomInput,
  CustomFloatInput,
  CustomIntInput,
  CustomYesNoInput,
  CustomDropdownInput,
  CustomMultiSelectInput,
} from "../../FormComponents/CustomIDInput";
import { validationSchema } from "./ValidationSchema";

import styled from "styled-components";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { deleteLocation, updateLocation, createLocation } from "../../restAPIs";
import { useSimpleZoneList } from "../../hooks";

const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  border: 1px solid lightgrey;
  width: 95%;
  margin: 5px 10px 20px 10px;
  padding: 5px 5px 10px 5px;
`;

function LocationDetails({ initialState, locationList }) {
  const setIsEdit = useSettingsStore((state) => state.setIsEdit);
  const isEdit = useSettingsStore((state) => state.isEdit);
  const isCreate = useSettingsStore((state) => state.isCreate);
  const setIsCreate = useSettingsStore((state) => state.setIsCreate);

  const { simpleZoneList } = useSimpleZoneList();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsEdit(false);
  }, [setIsEdit]);

  useEffect(() => {
    console.log("simpleZoneList", simpleZoneList)
  },[simpleZoneList])

  const editButtonStyle = {
    width: "100px",
    margin: "20px",
    fontSize: "1.2em",
  };

  const handleEdit = (e, props) => {
    console.log("values", props.values);
    window.scrollTo(0, 0);
    setIsEdit(true);
  };

  const handleDelete = (e, props) => {
    confirmDialog({
      message: "Are you sure you want to delete this location?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        console.log("values", props);
        window.scrollTo(0, 0);
        setIsEdit(false);
        setIsCreate(false);
        deleteLocation(props).then(() => {
          window.location = "/Locations";
        });
      },
      reject: () => {
        return;
      },
    });
  };

  const terms = [
    { label: "0", value: "0" },
    { label: "15", value: "15" },
    { label: "30", value: "30" },
  ];

  const invoicing = [
    { label: "daily", value: "daily" },
    { label: "weekly", value: "weekly" },
  ];

  const zones = simpleZoneList
    ? simpleZoneList.data
    : [];

  return (
    <div>
      <ConfirmDialog />
      <Formik
        initialValues={initialState}
        validationSchema={validationSchema(locationList)}
        onSubmit={(props) => {
          console.log("values", props);
          window.scrollTo(0, 0);
          setIsEdit(false);
          setIsCreate(false);
          if (isCreate) {
            createLocation(props).then(() => {
              window.location = "/Locations";
            });
          } else {
            updateLocation(props).then(() => {
              window.location = "/Locations";
            });
          }
        }}
      >
        {(props) => (
          <React.Fragment>
            <Form>
              {isEdit | isCreate ? (
                <div className="floatButtonsTop">
                  <Button
                    label="Submit"
                    type="submit"
                    className="p-button-raised p-button-rounded p-button-danger"
                    style={editButtonStyle}
                  />
                </div>
              ) : (
                <div></div>
              )}
              <motion.div
                initial={{ opacity: 0, x: "0", y: "0" }}
                animate={{ opacity: 1, x: "0" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                exit={{ opacity: 0, x: "0" }}
              >
                <GroupBox>
                  <h2>
                    <i className="pi pi-user"></i> Location Name
                  </h2>
                  <CustomIDInput
                    label="Location ID"
                    name="locNick"
                    converter={props}
                  />
                  <CustomInput
                    label="Location Name"
                    name="locName"
                    converter={props}
                  />
                </GroupBox>

                <GroupBox>
                  <h2>
                    <i className="pi pi-map"></i> Location
                  </h2>
                  <CustomDropdownInput
                    label="Zone"
                    name="zoneNick"
                    options={zones}
                    converter={props}
                  />
                  <CustomInput label="Address" name="addr1" converter={props} />
                  <CustomInput label="Address" name="addr2" converter={props} />
                  <CustomInput label="City" name="city" converter={props} />
                  <CustomInput label="Zip" name="zip" converter={props} />
                </GroupBox>

                <GroupBox>
                  <h2>
                    <i className="pi pi-phone"></i> Contact
                  </h2>
                  <CustomInput
                    label="First Name"
                    name="firstName"
                    converter={props}
                  />
                  <CustomInput
                    label="Last Name"
                    name="lastName"
                    converter={props}
                  />
                  <CustomInput label="Email" name="email" converter={props} />
                  <CustomInput label="Phone" name="phone" converter={props} />
                </GroupBox>

                <GroupBox>
                  <h2>
                    <i className="pi pi-dollar"></i> Billing
                  </h2>
                  <CustomYesNoInput
                    label="Paper Invoice"
                    name="toBePrinted"
                    converter={props}
                  />
                  <CustomYesNoInput
                    label="Email Invoice"
                    name="toBeEmailed"
                    converter={props}
                  />
                  <CustomYesNoInput
                    label="Print Duplicate"
                    name="printDuplicate"
                    converter={props}
                  />
                  <CustomDropdownInput
                    label="Terms"
                    name="terms"
                    options={terms}
                    converter={props}
                  />
                  <CustomDropdownInput
                    label="Invoicing"
                    name="invoicing"
                    options={invoicing}
                    converter={props}
                  />
                </GroupBox>

                {!isEdit && !isCreate && (
                  <Button
                    label="Edit"
                    className="editButton p-button-raised p-button-rounded p-button-success"
                    style={editButtonStyle}
                    onClick={(e) => handleEdit(e, props)}
                  />
                )}
              </motion.div>
            </Form>
            <Button
              label="Delete"
              type="delete"
              className="editButton p-button-raised p-button-rounded p-button-success"
              style={editButtonStyle}
              onClick={(e) => handleDelete(e, props)}
            />
          </React.Fragment>
        )}
      </Formik>
      <div className="bottomSpace"></div>
    </div>
  );
}

export default LocationDetails;
