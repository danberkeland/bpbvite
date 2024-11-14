import { objProject } from "../../utils/objectFns"
import * as yup from "yup"
import { DBOrder } from "../types.d"

/** 
 * @typedef {Object} 
 * @property {string}	     delivDate
 * @property {string}	     locNick
 * @property {string}	     prodNick
 * @property {number}	     qty
 * @property {number}      [qtyShort] default 0
 * @property {string|null} ItemNote
 * @property {boolean}     isWhole
 * @property {number|null} rate
 * @property {string}	     route
 * @property {number|null} delivFee
 * @property {string}      updatedBy
 * 
 * // can be handled automatically 
 * // property {("Orders")}	 [Type] appsync defaults to "Orders" -- disabled for now
 * @property {number}	     sameDayMaxQty equal to qty on create
 * @property {string}	     qtyUpdatedOn use current TS on create
 */
let CreateOrderInput 

/** 
 * @typedef {Object} 
 * @property {string}      id
 * @property {number}	     [qty]
 * @property {number}      [qtyShort] default 0
 * @property {string|null} [ItemNote]
 * @property {number|null} [rate]
 * @property {string}	     [route]
 * @property {number|null} [delivFee]
 * @property {string}      [updatedBy]
 * 
 * // can be handled automatically 
 * // property {("Orders")}	 [Type] appsync defaults to "Orders" -- disabled for now
 * @property {number}	     [sameDayMaxQty] equal to qty on create
 * @property {string}	     [qtyUpdatedOn] use current TS on create
 */
let UpdateOrderInput 

/**
 * @typedef {Object}
 * @property {string} id
 */
let DeleteOrderInput

const yupId = yup.string().uuid()
const yupDelivDate = yup.string().matches(/\d{4}-\d{2}-\d{2}/, "expected yyyy-mm-dd format")
const yupLocNick = yup.string()
const yupProdNick = yup.string()
const yupQty = yup.number().integer()
const yupQtyShort = yup.number().integer().min(0).max(yup.ref('qty'), "cannot be greater than qty")
const yupItemNote = yup.string().nullable()
const yupIsWhole = yup.boolean()
const yupRate = yup.number()
const yupRoute = yup.string().oneOf(["deliv", "slopick", "atownpick"])
const yupDelivFee = yup.number().nullable()
const yupUpdatedBy = yup.string()
// const yupType = yup.string().oneOf(["Orders"])


const orderCreateSchema = yup.object().shape({
  delivDate: yupDelivDate.required(),
  locNick: yupLocNick.required(),
  prodNick: yupProdNick.required(),
  qty: yupQty.required(),
  qtyShort: yupQtyShort.required(),
  ItemNote: yupItemNote.defined(),
  isWhole: yupIsWhole.required(),
  rate: yupRate.defined(),
  route: yupRoute.required(),
  delivFee: yupDelivFee.defined(),
  updatedBy: yupUpdatedBy.required(),
  sameDayMaxQty: yup.number().required(),
  qtyUpdatedOn: yup.string().required(),
  // Type: yupType.optional(), // Excluding will allow appsync to generate the value "Orders" by default
})

const orderUpdateSchema = yup.object().shape({
  // we don't want to be too loosey-goosey with our updates for now,
  // so the following 3 fields shouldn't be updatable. These fields
  // pretty much serve as a compound primary key.
  // delivDate: yupDelivDate.optional(), 
  // locNick: yupLocNick.optional(),
  // prodNick: yupProdNick.optional(),
  id: yupId.required(),
  qty: yupQty.optional(),
  qtyShort: yupQtyShort.optional(),
  ItemNote: yupItemNote.nullable(),
  isWhole: yupIsWhole.optional(),
  rate: yupRate.optional(),
  route: yupRoute.optional(),
  delivFee: yupDelivFee.nullable(),
  updatedBy: yupUpdatedBy.required(),
  sameDayMaxQty: yup.number().optional(),
  qtyUpdatedOn: yup.string().optional(),
  // Type: yupType.optional(), // not updatable for now
})

const orderDeleteSchema = yup.object().shape({
  id: yupId.required(),
})

/**
 * returns validation errors on fail;
 * returns null if inputs are all valid.
 * @param {object} args 
 * @param {CreateOrderInput[]} args.createInputs 
 * @param {UpdateOrderInput[]} args.updateInputs
 * @param {DeleteOrderInput[]} args.deleteInputs
 */
const validateOrderInputs = ({ createInputs, updateInputs, deleteInputs }) => {
  let errors = []

  for (let input of createInputs) {
    try {
      orderCreateSchema.validateSync(input)
    } catch (err) {
      errors.push({ type: "create", error: err })
    }
  }
  for (let input of updateInputs) {
    try {
      orderUpdateSchema.validateSync(input)
    } catch (err) {
      errors.push({ type: "update", error: err })
    }
  }
  for (let input of deleteInputs) {
    try {
      orderDeleteSchema.validateSync(input)
    } catch (err) {
      errors.push({ type: "delete", error: err })
    }
  }

  if (errors.length) {
    return errors
  } else {
    return null
  }
}



/**
 * Throws error on validation fail
 * @param {DBOrder} order 
 */
const castToCreateInput = (order) => {
  const schema = orderCreateSchema
  /** @type {CreateOrderInput} */
  let input = objProject(order, Object.keys(schema.describe().fields))
  try { schema.validateSync(input) }
  catch (e) { throw new Error(e)}
  for (let key of Object.keys(input)) {
    if (input[key] === undefined) delete input[key]
  }
  return input
}

/**
 * Throws error on validation fail
 * @param {DBOrder} order 
 */
const castToUpdateInput = (order) => {
  const schema = orderUpdateSchema
  /** @type {UpdateOrderInput} */
  let input = objProject(order, Object.keys(schema.describe().fields))
  try { schema.validateSync(input) }
  catch (e) { throw new Error(e)}
  for (let key of Object.keys(input)) {
    if (input[key] === undefined) delete input[key]
  }
  return input
}

/**
 * Throws error on validation fail
 * @param {DBOrder} order 
 */
const castToDeleteInput = (order) => {
  const schema = orderDeleteSchema
  /** @type {DeleteOrderInput} */
  let input = objProject(order, Object.keys(schema.describe().fields))
  try { schema.validateSync(input) }
  catch (e) { throw new Error(e)}
  for (let key of Object.keys(input)) {
    if (input[key] === undefined) delete input[key]
  }
  return input
}

export const orderValidation = {
  cast: {
    toCreateInput: castToCreateInput,
    toUpdateInput: castToUpdateInput,
    toDeleteInput: castToDeleteInput,
  },
  validateOrderInputs,
}

export {
  CreateOrderInput,
  UpdateOrderInput,
  DeleteOrderInput
}

