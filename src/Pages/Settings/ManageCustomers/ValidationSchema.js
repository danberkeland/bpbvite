import * as yup from "yup";

export const validationSchema = yup.object().shape({
  custName: yup
    .string()
    .required("Required"),

  authType: yup
    .string()
    .required("Required"),

 
});
