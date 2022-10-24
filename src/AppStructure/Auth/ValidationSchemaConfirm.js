import * as yup from "yup";

export const validationSchemaConfirm = (locationList) => {
 
  return yup.object({
   
    passwordNew: yup.string().required("Password is required"),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref("passwordNew"), null], "Passwords must match"),
  });
};
