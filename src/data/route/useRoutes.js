import { ListDataCache, useListData } from "../_listData"
/**@typedef {import('../types.d.js').DBRoute} DBRoute */

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @returns {ListDataCache<DBRoute>}
 */
export const useRoutes = ({ shouldFetch }) => 
  useListData({ tableName: "Route", shouldFetch })