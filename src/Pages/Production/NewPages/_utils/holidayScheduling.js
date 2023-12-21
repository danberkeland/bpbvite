import { HOLIDAYS } from "../_constants/holidays";
import { DateTime } from "luxon";




/**
 * For use with production data hooks. When the input list contains a holiday,
 * That date(time) and subsequent dates are advanced forward so that production
 * on the holiday is skipped, and so that prep anticipates production needs for
 * the day after the holiday.
 * 
 * Requires holidays and input dates to be sorted chronologically. Sequential 
 * holidays will cause input dates to jump forward multiple days
 * @param {DateTime[]} dts 
 * @returns {DateTime[]} 
 */
const scheduleForwardOnHolidays = dts => {

  let adjustedDts = [...dts]
  
  for (let holiday of HOLIDAYS) {
    let matchIdx = dts.findIndex(dt => dt.toFormat('MM-dd') === holiday)

    adjustedDts = matchIdx > -1
      ? adjustedDts.map((dt, idx) => dt.plus({ days: (idx >= matchIdx ? 1 : 0) }))
      : adjustedDts

  }

  return adjustedDts
}


/**
 * Holidays are returned as undefined in the list, giving a signal to cancel
 * data fetching
 * @param {DateTime[]} dts 
 * @returns {(DateTime|null)[]}
 */
const cancelOnHolidays = dts => dts.map(dt =>
  HOLIDAYS.includes(dt.toFormat('MM-dd')) ? null : dt  
)


const isHoliday = isoDate => HOLIDAYS.includes(isoDate.slice(5))


export {
  scheduleForwardOnHolidays,
  cancelOnHolidays,
  isHoliday
}