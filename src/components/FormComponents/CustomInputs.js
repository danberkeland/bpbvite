import React from "react";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Password } from "primereact/password";
import { Editor } from "primereact/editor";

import { withFormComponentWrap } from "../../components/hoc/withFormComponentWrap";

const options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const CustomIDInputBase = ({ label, ...props }) => {
  return (
    <InputText
      {...props}
      value={props.value ? props.value : ""}
      type="string"
      autoCapitalize="none"
      securetextentry="true"
      keyboardtype="visible-password"
    />
  );
};

const CustomTextInputBase = ({ label, ...props }) => {
  return (
    <InputText
      {...props}
      type="string"
      value={props.value ? props.value : ""}
    />
  );
};

const CustomPasswordInputBase = ({ label, ...props }) => {
  return (
    <Password
      {...props}
      type="string"
      toggleMask={true}
      value={props.value ? props.value : ""}
    />
  );
};

const CustomFloatInputBase = ({ label, ...props }) => {
  return (
    <InputNumber
      {...props}
      type="tel"
      value={isNaN(props.value) ? 0 : Number(props.value)}
      onChange={(values) => {
        props.converter.setFieldValue(props.name, Number(values.value));
      }}
      mode="decimal"
      minFractionDigits={2}
      maxFractionDigits={2}
    />
  );
};

const CustomIntInputBase = ({ label, ...props }) => {
  return (
    <InputNumber
      {...props}
      type="tel"
      value={isNaN(props.value) ? 0 : Number(props.value)}
      onChange={(values) => {
        props.converter.setFieldValue(props.name, Number(values.value));
      }}
    />
  );
};

const CustomYesNoInputBase = ({ label, ...props }) => {
  return (
    <SelectButton
      {...props}
      value={props.value ? props.value : false}
      onChange={() => {
        props.converter.setFieldValue(
          props.name,
          !props.converter.values[props.name]
        );
      }}
      options={options}
    />
  );
};

const CustomDropdownInputBase = ({ label, ...props }) => {
  return (
    <Dropdown
      {...props}
      type="string"
      value={props.value ? props.value : null}
    />
  );
};

const CustomMultiSelectInputBase = ({ label, ...props }) => {
  return <MultiSelect {...props} value={props.value ? props.value : null} />;
};

const CustomEditor = ({ label, ...props }) => {
  console.log("props", props);

  return (
    <Editor
      {...props}
      headerTemplate={toolbarHeader}
      value={props.value ? props.value : null}
      style={{ height: "300px" }}
      onTextChange={(e) =>
        props.converter.setFieldValue(props.name, e.htmlValue)
      }
    />
  );
};

const toolbarHeader = (
  <span className="ql-formats">
    <span className="ql-formats">
      <select className="ql-size">
        <option value="small"></option>
        <option value="normal"></option>
        <option value="large"></option>
        <option value="huge"></option>
      </select>
      <select className="ql-font">
        <option value="serif"></option>
        <option value="sansserif"></option>
        <option value="monospace"></option>
      </select>
    </span>

    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-strike" aria-label="Strikethrough"></button>
    </span>
    <span className="ql-formats">
      <select className="ql-color" aria-label="Color"></select>
      <select className="ql-background" aria-label="Background"></select>
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" aria-label="ordered"></button>
      <button className="ql-list" value="bullet" aria-label="bullet"></button>
    </span>
    <span className="ql-formats">
      <select className="ql-align" aria-label="align"></select>
    </span>
    <span className="ql-formats">
      <button className="ql-indent" value="-1" aria-label="add indent"></button>
      <button
        className="ql-indent"
        value="+1"
        aria-label="remove indent"
      ></button>
    </span>
    <span className="ql-formats">
      <button className="ql-blockquote" aria-label="blockquote"></button>
      <button className="ql-code-block" aria-label="code-block"></button>
    </span>
  </span>
);
export class CustomInputs {
  constructor() {
    this.CustomTextInput = withFormComponentWrap(CustomTextInputBase);
    this.CustomPasswordInput = withFormComponentWrap(CustomPasswordInputBase);
    this.CustomIDInput = withFormComponentWrap(CustomIDInputBase);
    this.CustomFloatInput = withFormComponentWrap(CustomFloatInputBase);
    this.CustomIntInput = withFormComponentWrap(CustomIntInputBase);
    this.CustomYesNoInput = withFormComponentWrap(CustomYesNoInputBase);
    this.CustomDropdownInput = withFormComponentWrap(CustomDropdownInputBase);
    this.CustomMultiSelectInput = withFormComponentWrap(
      CustomMultiSelectInputBase
    );
    this.CustomEditor = withFormComponentWrap(CustomEditor);
  }
}
