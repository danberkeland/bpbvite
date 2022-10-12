import React from "react";
import { CustomInputs } from "../../FormComponents/CustomInputs";

import { validationSchema } from "./ValidationSchema";

import { deleteProduct, updateProduct, createProduct } from "../../restAPIs";
import { withFadeIn, withBPBForm } from "../../utils";
import { GroupBox } from "../../utils";
import { compose } from "../../utils";

const BPB = new CustomInputs();

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

  const BPBProductForm = compose(
    withBPBForm,
    withFadeIn
  )((props) => {
    return (
      <React.Fragment>
        <GroupBox>
          <h2>
            <i className="pi pi-user"></i> Product Description
          </h2>
          <BPB.CustomIDInput
            label="Product ID"
            name="prodNick"
            dontedit="true"
            converter={props}
          />
          <BPB.CustomTextInput
            label="Product Name"
            name="prodName"
            converter={props}
          />
          <BPB.CustomTextInput
            label="Square ID"
            name="squareID"
            converter={props}
          />
          <BPB.CustomTextInput label="QB ID" name="qbID" converter={props} />
        </GroupBox>
        <GroupBox>
          <h2>
            <i className="pi pi-dollar"></i> Billing
          </h2>
          <BPB.CustomFloatInput
            label="Wholesale Price"
            name="wholePrice"
            converter={props}
          />
          <BPB.CustomFloatInput
            label="Retail Price"
            name="retailPrice"
            converter={props}
          />
          <BPB.CustomYesNoInput
            label="Available Wholesale?"
            name="isWhole"
            converter={props}
          />
          <BPB.CustomYesNoInput
            label="Default Include?"
            name="defaultInclude"
            converter={props}
          />
        </GroupBox>

        <GroupBox>
          <BPB.CustomDropdownInput
            label="Pack Group"
            name="packGroup"
            options={packGroups}
            converter={props}
          />
          <BPB.CustomIntInput
            label="Pack Size"
            name="packSize"
            converter={props}
          />
          <BPB.CustomYesNoInput
            label="Freezer Thaw?"
            name="freezerThaw"
            converter={props}
          />
          <BPB.CustomYesNoInput
            label="Count EOD?"
            name="isEOD"
            converter={props}
          />
        </GroupBox>
        <GroupBox>
          <h2>
            <i className="pi pi-dollar"></i> Baking Info
          </h2>
          <BPB.CustomDropdownInput
            label="Dough Type"
            name="doughNick"
            options={doughs}
            converter={props}
          />
          <BPB.CustomIntInput
            label="Lead Time"
            name="leadTime"
            converter={props}
          />
          <BPB.CustomTextInput
            label="For Bake"
            name="forBake"
            converter={props}
          />
          <BPB.CustomMultiSelectInput
            label="Baked Where"
            name="bakedWhere"
            options={bakedWhere}
            converter={props}
          />

          <BPB.CustomFloatInput
            label="Guaranteed Ready (0-24)"
            name="readyTime"
            converter={props}
          />
          <BPB.CustomIntInput
            label="Batch Size"
            name="batchSize"
            converter={props}
          />
          <BPB.CustomIntInput
            label="Bake Extra"
            name="bakeExtra"
            converter={props}
          />
          <BPB.CustomFloatInput
            label="Weight"
            name="weight"
            converter={props}
          />
        </GroupBox>
      </React.Fragment>
    );
  });

  return (
    <BPBProductForm
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
