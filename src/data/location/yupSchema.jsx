
// /***********
//  * SCHEMAS *
//  ***********/

// const createLocationSchema = yup.object().shape({
//   Type: yup.string().default('Location'),
//   locNick: yup.string()
//     .required("Required")
//     .matches(/^[a-z]+$/, "must contain only lowercase letters")
//     // .notOneOf(locNicks, "this id is not available.")
//     .min(2, "Location ID must have at least 2 characters"),
//   locName: yup.string()
//     // .notOneOf(locNames, "this name is not available.")
//     .required("Required"),

//   zoneNick: yup.string(),
//   addr1: yup.string(),
//   addr2: yup.string(),
//   city: yup.string(),
//   zip: yup.string(),
//   email: yup.array()
//     .transform(function(value,originalValue){
//       if (this.isType(value) && value !==null) {
//         return value;
//       }
//       return originalValue ? originalValue.split(/[\s,]+/) : [];
//     })
//     .of(yup.string().email(({ value }) => `${value} is not a valid email`)),
//   phone: yup.string()
//     .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, "Phone number format xxx-xxx-xxxx"),
//   firstName: yup.string(),
//   lastName: yup.string(),
//   toBePrinted: yup.bool(),
//   toBeEmailed: yup.bool(),
//   printDuplicate: yup.bool(),
//   terms: yup.string(),
//   invoicing: yup.string(),
//   latestFirstDeliv: yup.number(),
//   latestFinalDeliv: yup.number(),
//   webpageURL: yup.string(),
//   picURL: yup.string(),
//   gMap: yup.string(),
//   specialInstructions: yup.string(),
//   delivOrder: yup.number().integer(),
//   qbID: yup.string(),
//   currentBalance: yup.string(),
//   isActive: yup.bool(),
// })

// const updateLocationSchema = yup.object().shape({
//   Type: yup.string(),
//   locNick: yup.string().required(),
//   locName: yup.string(),
//     // .notOneOf(locNames, "this name is not available.")
//   zoneNick: yup.string(),
//   addr1: yup.string(),
//   addr2: yup.string(),
//   city: yup.string(),
//   zip: yup.string(),
//   email: yup.array()
//     .transform(function(value,originalValue){
//       if (this.isType(value) && value !==null) {
//         return value;
//       }
//       return originalValue ? originalValue.split(/[\s,]+/) : [];
//     })
//     .of(yup.string().email(({ value }) => `${value} is not a valid email`)),
//   phone: yup.string()
//     .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, "Phone number format xxx-xxx-xxxx"),
//   firstName: yup.string(),
//   lastName: yup.string(),
//   toBePrinted: yup.bool(),
//   toBeEmailed: yup.bool(),
//   printDuplicate: yup.bool(),
//   terms: yup.string(),
//   invoicing: yup.string(),
//   latestFirstDeliv: yup.number(),
//   latestFinalDeliv: yup.number(),
//   webpageURL: yup.string(),
//   picURL: yup.string(),
//   gMap: yup.string(),
//   specialInstructions: yup.string(),
//   delivOrder: yup.number().integer(),
//   qbID: yup.string(),
//   currentBalance: yup.string(),
//   isActive: yup.bool(),
// })

// const deleteLocationSchema = yup.object().shape({
//   locNick: yup.string().required()
// })