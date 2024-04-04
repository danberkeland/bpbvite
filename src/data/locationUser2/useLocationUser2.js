import { ListDataCache, useListData } from "../_listData"
import { DBLocationUser2 } from "../types.d"

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @returns {ListDataCache<DBLocationUser2>}
 */
export const useLocationUser2s = ({ shouldFetch }) => 
  useListData({ tableName: "LocationUser2", shouldFetch })
