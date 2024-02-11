import * as yup from "yup";

export const validationSchema = (locationList) => {
  const locNicks = locationList ? locationList.map((loc) => loc.locNick) : [];
  const locNames = locationList ? locationList.map((loc) => loc.locName) : [];

  const phoneRegEx = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
  
  return yup.object().shape({
    locNick: yup
      .string()
      .matches(/^[a-z0-9]+$/, "must contain only lowercase letters or numbers")
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

// const buildLocationSchema = (locNicks, locNames, zoneNicks) => {
//   const contextSchema = yup.object({
//     action: yup.string().oneOf(["create", "update"])
//   })

//   const nameSchema = yup.object({
//     locNick: yup.string().required().oneOf(locNicks)
//       .meta({isPK: true }),
//     locName: yup.string().required()

//   }).meta({ group: "name" })

//   const contactSchema = yup.object({
//     firstName: yup.string(),
//     lastName: yup.string(),
//     phone: yup.string(),
//     email: yup.string().email(),
//   }).meta({ group: "contact"})
  
//   const billingSchema = yup.object({
//     qbID: yup.string(),
//     toBePrinted: yup.boolean(),
//     toBeEmailed: yup.boolean(),
//     printDuplicate: yup.boolean(),
//     terms: yup.string().oneOf(["0", "15", "30"]),
//     invoicing: yup.string().oneOf(["daily", "weekly"]),
//   }).meta({ group: "billing"})

//   const address = yup.object({
//     addr1: yup.string(),
//     addr2: yup.string(),
//     city: yup.string(),
//     zip: yup.string(),
//     webpageURL: yup.string(),
//     gMap: yup.string()
//   }).meta({ group: "address"})
  
//   const delivery = yup.object({
//     zoneNick: yup.string().oneOf(zoneNicks),
//     latestFirstDeliv: yup.number().lessThan(24),
//     latestFinalDeliv: yup.number().lessThan(24),
//     delivOrder: yup.number().integer(),
//     specialInstructions: yup.string(),
//     orderCnfEmail: yup.string().email(),
//     delivOrder: yup.number(),
//   }).meta({ group: "delivery"})

//   // attributes that arent being used, or are managed automatically
//   // in the background.
//   const hidden = yup.object({
//     Type: yup.string().default("Location"),
//     createdAt: yup.string(),
//     updatedAt: yup.string(),
//     isActive: yup.boolean(),
//     ttl: yup.number().integer(),
//     locationCreditAppId: yup.string(),
//     currentBalance: yup.number(),
//     picURL: yup.string(),
//   }).meta({ group: "hidden"})

//   const fullSchema = nameSchema
//     .concat(contactSchema)
//     .concat(addressSchema)
//     .concat(deliverySchema)
//     .concat(billingSchema)
//     .meta({ groups: ["Name", "Contact", "Address", "Delivery", "Billing"] })
// }