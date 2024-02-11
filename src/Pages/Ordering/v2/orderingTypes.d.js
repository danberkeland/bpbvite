import { DateTime } from "luxon";

/**
 * @typedef {Object}
 * @property {DateTime} DT - luxon DateTime
 * @property {Date} JS - JS Date object
 * @property {string} iso - 'yyyy-MM-dd' 
 * @property {string} wdEEE - e.g. 'Sun', 'Mon', ...
 * @property {number} wdNum - numbered according to the JS Date convention. Sun === 0, Sat === 6
 */
let DateObj

/**
 * @typedef {Object}
 * @param {string} name
 * @param {string} sub
 * @param {string} authClass
 * @param {string} locNick
 */
let OrderingUser

export {
  DateObj,
  OrderingUser,
}
