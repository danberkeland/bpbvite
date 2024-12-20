import { DateTime } from "luxon"

/**
 * Array.map callback.
 * 
 * Not intended as a general solution for augmenting date scheduling around
 * a holiday -- there are many edge cases that this fn does not handle.
 * @param {DateTime} dt The current DateTime item.
 * @param {number} _idx Array index.
 * @param {DateTime[]} sequentialDTs The .map that uses this callback should act on a list of sequential DateTimes.
 * @returns 
 */
export function holidayShift(dt, _idx, sequentialDTs) {
  const holiday = { month: 12, day: 25 }
  const n = sequentialDTs.length
  if (holiday.month !== sequentialDTs[0].month) return dt
  if (holiday.day < sequentialDTs[0].day || sequentialDTs[n-1].day < holiday.day) return dt

  return (holiday.day <= dt.day)
    ? dt.plus({ days: 1 })
    : dt
}