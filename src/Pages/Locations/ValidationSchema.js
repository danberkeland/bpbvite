import * as yup from "yup";

export const validationSchema = (locationList) => {
  const locNicks = locationList ? locationList.map((loc) => loc.locNick) : [];
  const locNames = locationList ? locationList.map((loc) => loc.locName) : [];

  const phoneRegEx = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
  
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

    email: yup
      .array()
      .transform(function(value,originalValue){
        if (this.isType(value) && value !==null) {
          return value;
        }
        return originalValue ? originalValue.split(/[\s,]+/) : [];
      })
      .of(yup.string().email(({ value }) => `${value} is not a valid email`)),
      

    phone: yup
      .string()
      .matches(phoneRegEx, "Phone number format xxx-xxx-xxxx")


  });
};
