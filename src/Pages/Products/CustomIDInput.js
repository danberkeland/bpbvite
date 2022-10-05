import { useField } from "formik";

const CustomIDInput = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  console.log("field", field);
  console.log("meta", meta);
  return (
    <div>
      <div className="field">
        <label>{label}</label>
        <input
          {...field}
          {...props}
          className={meta.touched && meta.error ? "p-error" : ""}
        />
      </div>
      {((meta.touched && meta.error) || meta.error==="must contain only letters") && (
        <h4 className="p-error">{meta.error}</h4>
      )}
    </div>
  );
};

export default CustomIDInput;
