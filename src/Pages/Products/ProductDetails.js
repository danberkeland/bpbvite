import React from "react";

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

import { deleteProduct, updateProduct, createProduct } from "../../restAPIs";
import { withFadeIn, withBPBForm } from "../../utils";
import { GroupBox } from "../../utils";

const compose = (...fns) =>
  fns.reduceRight(
    (prevFn, nextFn) =>
      (...args) =>
        nextFn(prevFn(...args)),
    (value) => value
  );

function ProductDetails({ initialState }) {
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

  const BPBLocationForm = compose(
    withBPBForm,
    withFadeIn
  )((props) => {
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
    <BPBLocationForm
      name="product"
      validationSchema={validationSchema}
      initialState={initialState}
      createProduct={createProduct}
      deleteProduct={deleteProduct}
      updateProduct={updateProduct}
    />
  );
}

export default ProductDetails;
