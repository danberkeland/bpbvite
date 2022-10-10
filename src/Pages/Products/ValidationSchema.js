import * as yup from "yup";

export const validationSchema = (productList) => {

  const prodNicks = productList ? productList.map(prod => prod.prodNick) : []
  const prodNames = productList ? productList.map(prod => prod.prodName) : []

  return yup.object().shape({
    prodNick: yup
      .string()
      .matches(/^[a-z]+$/, "must contain only lowercase letters")
      .notOneOf(prodNicks, "this id is not available.")
      .min(2, "Product ID must have at least 2 characters")
      .required("Required"),

    prodName: yup
      .string()
      .notOneOf(prodNames, "this name is not available.")
      .required("Required"),

    wholePrice: yup.number().min(0),
    retailPrice: yup.number().min(0),
    leadTime: yup.number().min(0),
    readyTime: yup.number().min(0).lessThan(24),
    packSize: yup.number().min(1),
    batchSize: yup.number().min(1),
    weight: yup.number().moreThan(0),
  });
};
