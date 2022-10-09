import * as yup from "yup";

export const validationSchema = yup.object().shape({

  prodNick: yup
    .string()
    .matches(/^[a-z]+$/, "must contain only lowercase letters")
    .min(2, "Product ID must have at least 2 characters")
    .required("Required"),

  prodName: yup
    .string()
    .required("Required"),

  wholePrice: yup.number().min(0),
  retailPrice: yup.number().min(0),
  leadTime: yup.number().min(0),
  readyTime: yup.number().min(0).max(23.9),
  packSize: yup.number().min(1),
  batchSize: yup.number().min(1),
  weight: yup.number().moreThan(0)
  
});
