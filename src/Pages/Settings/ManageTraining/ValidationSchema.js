import * as yup from "yup";

export const validationSchema = (productList) => {


  return yup.object().shape({
    role: yup
      .string()
      .required("Required"),

  });
};
