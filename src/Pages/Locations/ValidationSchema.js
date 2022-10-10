import * as yup from "yup";

export const validationSchema = (locationList) => {

  const locNicks = locationList ? locationList.map(loc => loc.locNick) : []
  const locNames = locationList ? locationList.map(loc => loc.locName) : []

  return yup.object().shape({
    locNick: yup
      .string()
      .matches(/^[a-z]+$/, "must contain only lowercase letters")
      .notOneOf(locNicks, "this id is not available.")
      .min(2, "Location ID must have at least 2 characters")
      .required("Required"),

    locName: yup
      .string()
      .notOneOf(locNames, "this name is not available.")
      .required("Required"),

  });
};
