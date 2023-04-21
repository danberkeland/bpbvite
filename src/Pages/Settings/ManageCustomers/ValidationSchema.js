import * as yup from "yup";

export const validationSchema = () => {
  return yup.object().shape({
    custName: yup.string().required("Required"),
   

    authClass: yup.string().required("Required"),

    email: yup
      .array()
      .transform(function(value,originalValue){
        if (this.isType(value) && value !==null) {
          return value;
        }
        return originalValue ? originalValue.split(/[\s,]+/) : [];
      })
      .of(yup.string().email(({ value }) => `${value} is not a valid email`)), 
  });
};
