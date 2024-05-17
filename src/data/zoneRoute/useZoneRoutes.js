import { ListDataCache, useListData } from "../_listData";
/**@typedef {import('../types.d.js').DBZoneRoute} DBZoneRoute */

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @returns {ListDataCache<DBZoneRoute>}
 */
export const useZoneRoutes = ({ shouldFetch }) => 
  useListData({ tableName: "ZoneRoute", shouldFetch })

