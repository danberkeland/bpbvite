

/** 
 * @typedef {Object} 
 * @property {'Orders'|'Standing'|'Holding'|'Template'}	 [Type]: String
 * @property {string}	     [id]: ID
 * @property {number}	     [qty]: Int
 * @property {number|null} [qtyShort]: Int
 * @property {string}	     [qtyUpdatedOn]: AWSDateTime
 * @property {number}	     [sameDayMaxQty]: Int
 * @property {string}	     prodNick: String!
 * @property {string}	     locNick: String!
 * @property {string|null} [ItemNote]: String
 * @property {number|null} [SO]: Int
 * @property {boolean}     [isWhole]: Boolean
 * @property {string}	     [delivDate]: String
 * @property {number|null} [rate]: Float
 * @property {string}	     [route]: String
 * @property {number|null} [delivFee]: Float
 * @property {number|null} [isLate]: Int
 * @property {string|null} [createdOn]: AWSDateTime
 * @property {string|null} [updatedOn]: AWSDateTime
 * @property {string|null} updatedBy: String!
 * @property {number|null} [ttl]: Int
 */
let CreateOrderInput 

/** 
 * @typedef {Object} 
 * @property {'Orders'|'Standing'|'Holding'|'Template'}	 [Type]: String
 * @property {string}	     id: ID!
 * @property {number}	     [qty]: Int
 * @property {number|null} [qtyShort]: Int
 * @property {string}	     [qtyUpdatedOn]: AWSDateTime
 * @property {number}	     [sameDayMaxQty]: Int
 * @property {string}	     [prodNick]: String
 * @property {string}	     [locNick]: String
 * @property {string|null} [ItemNote]: String
 * @property {number|null} [SO]: Int
 * @property {boolean}     [isWhole]: Boolean
 * @property {string}	     [delivDate]: String
 * @property {number|null} [rate]: Float
 * @property {string}	     [route]: String
 * @property {number|null} [delivFee]: Float
 * @property {number|null} [isLate]: Int
 * @property {string|null} [createdOn]: AWSDateTime
 * @property {string|null} [updatedOn]: AWSDateTime
 * @property {string|null} updatedBy: String
 * @property {number|null} [ttl]: Int
 */
let UpdateOrderInput

/** 
 * @typedef {Object} 
 * @property {string}	 id: ID!
 */
let DeleteOrderInput

export {
  CreateOrderInput,
  UpdateOrderInput,
  DeleteOrderInput,
}