import { DateTime } from "luxon"

const BPB_ZONE = 'America/Los_Angeles'


const localNow = () => DateTime.now()
const now = () => DateTime.now().setZone(BPB_ZONE)
const today = () => DateTime.now().setZone(BPB_ZONE).startOf('day')



/**
 * Sets to BPB Zone. 
 * @param {string} isoDate yyyy-MM-dd string. For a full timestamp, use fromIsoTs
 */
const fromIso = (isoDate) => 
  DateTime.fromFormat(isoDate, 'yyyy-MM-dd', { zone: BPB_ZONE }).startOf('day')

/**
 * Sets to BPB Zone
 * @param {string} isoTimestamp  
 */
const fromIsoTs = isoTimestamp => 
  DateTime.fromISO(isoTimestamp).setZone(BPB_ZONE)

/**Sets to BPB Zone */
const fromJs = (jsDate) => 
  DateTime.fromJSDate(jsDate, { zone: BPB_ZONE})

/**
 * Sets to BPB Zone. Applies 8pm cutoff rule. Cuts off hrs and smaller units.
 * @param {DateTime} dt 
 * @returns {DateTime}
 */
const toOrderDate = dt => dt.setZone(BPB_ZONE).plus({ hours: 4 }).startOf('day')

/** converts to javascript style weekday numbers (0 - 6) */

const isoToWeekdayNum = (isoDate) => fromIso(isoDate).weekday % 7
const isoToWeekdayEEE = (isoDate) => fromIso(isoDate).toFormat('EEE')



/**
 * Module to streamline/standardize the way we leverage Luxon DateTimes.
 * Converts to BPB's IANA Zone ('America/Los_Angeles'), EXCEPT the localNow 
 * function.
 */
export const DT = {
  localNow,
  now,
  today,
  toOrderDate,
  fromIso,
  fromIsoTs,
  fromJs,
}

export const IsoDate = {
  toWeekdayNum: isoToWeekdayNum,
  toWeekdayEEE: isoToWeekdayEEE,
}