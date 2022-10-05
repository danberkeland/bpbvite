import { useField, formik } from "formik";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";

export const CustomIDInput = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  console.log("field", field);
  console.log("meta", meta);
  return (
    <div>
      <div className="field">
        <label>{label}</label>
        <InputText
          {...field}
          {...props}
          className={meta.touched && meta.error ? "p-error" : ""}
        />
      </div>
      {((meta.touched && meta.error) ||
        meta.error === "must contain only lowercase letters") && (
        <h4 className="p-error">{meta.error}</h4>
      )}
    </div>
  );
};

export const CustomInput = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  console.log("field", field);
  console.log("meta", meta);
  return (
    <div>
      <div className="field">
        <label>{label}</label>
        <InputText
          {...field}
          {...props}
          className={meta.touched && meta.error ? "p-error" : ""}
        />
      </div>
      {meta.touched && meta.error && <h4 className="p-error">{meta.error}</h4>}
    </div>
  );
};

export const CustomFloatInput = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  console.log("field", field);
  console.log("meta", meta);
  console.log("...props", props);
  return (
    <div>
      <div className="field">
        <label>{label}</label>
        <InputNumber
          {...field}
          {...props}
          value={Number(props.converter.values[props.name])}
              onChange={(values) => {
                console.log("value", values.value);
                props.converter.setFieldValue("wholePrice", Number(values.value))}}
          mode="decimal"
          minFractionDigits={0}
          maxFractionDigits={2}
          className={meta.touched && meta.error ? "p-error" : ""}
        />
      </div>
      {meta.touched && meta.error && <h4 className="p-error">{meta.error}</h4>}
    </div>
  );
};

export const CustomIntInput = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  console.log("field", field);
  console.log("meta", meta);
  return (
    <div>
      <div className="field">
        <label>{label}</label>
        <InputNumber
          {...field}
          {...props}
          value={Number(props.converter.values[props.name])}
              onChange={(values) => {
                console.log("value", values.value);
                props.converter.setFieldValue("packSize", Number(values.value))}}
          
          className={meta.touched && meta.error ? "p-error" : ""}
        />
      </div>
      {meta.touched && meta.error && <h4 className="p-error">{meta.error}</h4>}
    </div>
  );
};
