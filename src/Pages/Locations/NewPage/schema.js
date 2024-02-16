import * as yup from 'yup'
import { useListData } from '../../../data/_listData'
import { pickBy, set } from 'lodash'

export const useLocationSchema = ({ editMode }) => {
  
  const { data:LOC=[] } = useListData({ tableName:"Location", shouldFetch:true })
  const locNicks = LOC.map(L => L.locNick)
  const locNames = LOC.map(L => L.locName)

  const phoneRegEx = /^$|[0-9]{3}-[0-9]{3}-[0-9]{4}$/
  
  const locationSchema = yup.object().shape({
    // Id
    Type: yup.string(),
    locNick: yup
      .string()
      .matches(/^[a-z0-9]+$/, "must contain only lowercase letters or numbers.")
      .when("$editMode", {
        is: 'create',
        then: schema => schema.notOneOf(locNicks, "this id is not available.")
      })
      .min(2, "Location ID must have at least 2 characters")
      .max(13, "Location ID must have at most 13 characters")
      .required("Required"),
    locName: yup
      .string()
      .when("$editMode", {
        is: 'create',
        then: schema => schema.notOneOf(locNames, "this name is not available.")
      })
      .required("Required"),
    // Address
    addr1: yup.string().nullable(),
    addr2: yup.string().nullable(),
    city: yup.string().nullable(),
    zip: yup.string().nullable(),
    gMap: yup.string().nullable(),

    // Contact
    firstName: yup.string().nullable(),
    lastName: yup.string().nullable(),
    phone: yup
      .string()
      .matches(phoneRegEx, "Phone number format xxx-xxx-xxxx"),
    email: yup
      .array()
      .transform(function (value, originalValue) {
        if (this.isType(value) && value !== null) return value
        else return originalValue ? originalValue.split(/[\s,]+/) : []
      })
      .of(yup.string().email(({ value }) => `${value} is not a valid email`))
      .test(
        'email-string-length',
        'string will exceed max 100 characters',
        value => value.join(",").length <= 100
      ),
      
    // Billing
    qbID: yup.string().nullable(),
    invoicing: yup.string().nullable(),
    terms: yup.string().nullable(),
    toBeEmailed: yup.bool(),
    toBePrinted: yup.bool(),
    printDuplicate: yup.bool(),

    zoneNick: yup.string().required(),
    dfFulfill: yup.string().nullable(),
    latestFirstDeliv: yup
      .number()
      .min(0)
      .lessThan(24),
    latestFinalDeliv: yup
      .number()
      .min(0)
      .lessThan(24),
    delivOrder: yup.number().nullable(),
  })

  // return useMemo(() => locationSchema, [editMode, LOC])
  return locationSchema
}

export const defaultLocation = {
  Type: "Location",
  locNick: "",
  // Address
  locName: "",
  addr1: "",
  addr2: "",
  city: "",
  zip: "",
  gMap: "",
  // Contact,
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  // Billing
  qbID: "",
  invoicing: "",
  // terms: "15",           // better to not set these for now.
  // toBeEmailed: true,     // Some items may have unusual settings that
  // toBePrinted: true,     // should be preserved.
  // printDuplicate: false,
  // Fulfillment
  zoneNick: "",
  dfFulfill: "",
  latestFirstDeliv: 7,
  latestFinalDeliv: 13,
  delivOrder: 0,
  // Others we may integrate in the future
  currentBalance: '',         // string
  picURL: '',                 // string
  orderCnfEmail: '',          // string
  specialInstructions: '',    // string
  webpageURL: '',             // string
  isActive: true,             // bool
}

// Coerces null values in old data to standard defaults,
// elminiates whitespace from strings
export const cleanLocationValues = (location) => {
  const cleanedLocation = { 
    ...defaultLocation,
    ...pickBy(location, (key, val) => val !== null), 
    email: location.email.split(/[\s,]+/).join(',')
  }

  return cleanedLocation
}

/**
 * Enhances the default validation of formik's validationSchema 
 * integration with yup, allowing us to pass a context object.
 * 
 * This lets us use .when() in our schema, allowing for different
 * validation requirements in create vs. update contexts.
 * 
 * Source: https://www.fullstacklabs.co/blog/how-to-use-yup-context-variables-in-formik-validation#:~:text=The%20validation%20library%20Yup%20allows,instance%20of%20the%20other%20object.
 */
export const validateWithContext = (schema, values, context) => {
  try {
    schema.validateSync(values, {
      abortEarly: false,
      context,
    })
  } catch (error) {
    if (error.name !== "ValidationError") {
      throw error;
    }

    return error.inner.reduce((errors, currentError) => {
      errors = set(errors, currentError.path, currentError.message);
      return errors;
    }, {})
  }

  return {}
}