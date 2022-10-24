import * as yup from "yup";

export const validationSchema = (locationList) => {
  const phoneRegEx = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;

  return yup.object().shape({
    email: yup
      .array()
      .transform(function (value, originalValue) {
        if (this.isType(value) && value !== null) {
          return value;
        }
        return originalValue ? originalValue.split(/[\s,]+/) : [];
      })
      .of(yup.string().email(({ value }) => `${value} is not a valid email`)),

    phone: yup.string().matches(phoneRegEx, "Phone number format xxx-xxx-xxxx"),

    
  });
};
