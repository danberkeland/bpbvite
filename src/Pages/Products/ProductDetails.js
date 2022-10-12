import React, { useEffect } from "react";

import { Form, Formik } from "formik";

import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method // To use confirmDialog method

import {
  CustomIDInput,
  CustomTextInput,
  CustomFloatInput,
  CustomIntInput,
  CustomYesNoInput,
  CustomDropdownInput,
  CustomMultiSelectInput,
} from "../../FormComponents/CustomInputs";
import { validationSchema } from "./ValidationSchema";

import styled from "styled-components";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { deleteProduct, updateProduct, createProduct } from "../../restAPIs";
import { withFadeIn } from "../../utils";

const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  border: 1px solid lightgrey;
  width: 95%;
  margin: 5px 10px 20px 10px;
  padding: 5px 5px 10px 5px;
`;

function ProductDetails({ initialState, productList }) {
  const setIsEdit = useSettingsStore((state) => state.setIsEdit);
  const isEdit = useSettingsStore((state) => state.isEdit);
  const isCreate = useSettingsStore((state) => state.isCreate);
  const setIsCreate = useSettingsStore((state) => state.setIsCreate);

  let str = "product"
  let source = str+"List"
  let path = "/"+ str.charAt(0).toUpperCase()+str.slice(1)+"s"
  let create = "create"+str.charAt(0).toUpperCase()+str.slice(1)
  console.log("create", create)
  

  var sourceVar = window[source]
  let createFunc = window[create]
  console.log("type",typeof createFunc)
  

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsEdit(false);
  }, [setIsEdit]);

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
      message: `Are you sure you want to delete this ${str}?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        console.log("values", props);
        window.scrollTo(0, 0);
        setIsEdit(false);
        setIsCreate(false);
        deleteProduct(props).then(() => {
          window.location = path;
        });
      },
      reject: () => {
        return;
      },
    });
  };

  const packGroups = [
    { label: "Baked Pastries", value: "baked pastries" },
    { label: "Frozen Pastries", value: "frozen pastries" },
    { label: "Rustic Breads", value: "rustic breads" },
    { label: "Brioche Products", value: "brioche products" },
    { label: "Sandwich Breads", value: "sandwich breads" },
    { label: "Rolls", value: "rolls" },
    { label: "Focaccia", value: "focaccia" },
    { label: "Retail", value: "retail" },
    { label: "Cafe Menu", value: "cafe menu" },
  ];

  const doughs = [
    { label: "French", value: "french" },
    { label: "Baguette", value: "baguette" },
    { label: "Brioche", value: "brioche" },
    { label: "Croissant", value: "croix" },
    { label: "Levain", value: "lev" },
    { label: "Rustic Rye", value: "rusticRye" },
    { label: "Multigrain", value: "multi" },
    { label: "Ciabatta", value: "cia" },
    { label: "Doobie", value: "doobie" },
    { label: "Siciliano", value: "siciliano" },
  ];

  const bakedWhere = [
    { label: "Prado", value: "prado" },
    { label: "Carlton", value: "carlton" },
  ];

  const FadeLocationList = withFadeIn((props) => {
    return (
      <React.Fragment>
        <GroupBox>
          <h2>
            <i className="pi pi-user"></i> Product Description
          </h2>
          <CustomIDInput
            label="Product ID"
            name="prodNick"
            dontedit="true"
            converter={props}
          />
          <CustomTextInput
            label="Product Name"
            name="prodName"
            converter={props}
          />
          <CustomTextInput
            label="Square ID"
            name="squareID"
            converter={props}
          />
          <CustomTextInput label="QB ID" name="qbID" converter={props} />
        </GroupBox>
        <GroupBox>
          <h2>
            <i className="pi pi-dollar"></i> Billing
          </h2>
          <CustomFloatInput
            label="Wholesale Price"
            name="wholePrice"
            converter={props}
          />
          <CustomFloatInput
            label="Retail Price"
            name="retailPrice"
            converter={props}
          />
          <CustomYesNoInput
            label="Available Wholesale?"
            name="isWhole"
            converter={props}
          />
          <CustomYesNoInput
            label="Default Include?"
            name="defaultInclude"
            converter={props}
          />
        </GroupBox>

        <GroupBox>
          <CustomDropdownInput
            label="Pack Group"
            name="packGroup"
            options={packGroups}
            converter={props}
          />
          <CustomIntInput label="Pack Size" name="packSize" converter={props} />
          <CustomYesNoInput
            label="Freezer Thaw?"
            name="freezerThaw"
            converter={props}
          />
          <CustomYesNoInput label="Count EOD?" name="isEOD" converter={props} />
        </GroupBox>
        <GroupBox>
          <h2>
            <i className="pi pi-dollar"></i> Baking Info
          </h2>
          <CustomDropdownInput
            label="Dough Type"
            name="doughNick"
            options={doughs}
            converter={props}
          />
          <CustomIntInput label="Lead Time" name="leadTime" converter={props} />
          <CustomTextInput label="For Bake" name="forBake" converter={props} />
          <CustomMultiSelectInput
            label="Baked Where"
            name="bakedWhere"
            options={bakedWhere}
            converter={props}
          />

          <CustomFloatInput
            label="Guaranteed Ready (0-24)"
            name="readyTime"
            converter={props}
          />
          <CustomIntInput
            label="Batch Size"
            name="batchSize"
            converter={props}
          />
          <CustomIntInput
            label="Bake Extra"
            name="bakeExtra"
            converter={props}
          />
          <CustomFloatInput label="Weight" name="weight" converter={props} />
        </GroupBox>
      </React.Fragment>
    );
  });

  return (
    <div>
      <ConfirmDialog />
      <Formik
        initialValues={initialState}
        validationSchema={validationSchema(sourceVar)}
        onSubmit={(props) => {
          console.log("values", props);
          window.scrollTo(0, 0);
          setIsEdit(false);
          setIsCreate(false);
          if (isCreate) {
            createProduct(props).then(() => {
              window.location = path;
            });
          } else {
            updateProduct(props).then(() => {
              window.location = path;
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
              <FadeLocationList {...props} />

              {!isEdit && !isCreate && (
                <Button
                  label="Edit"
                  className="editButton p-button-raised p-button-rounded p-button-success"
                  style={editButtonStyle}
                  onClick={(e) => handleEdit(e, props)}
                />
              )}
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

export default ProductDetails;
