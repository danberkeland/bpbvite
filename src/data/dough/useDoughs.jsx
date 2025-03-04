import { ListDataCache, useListData } from "../_listData"
import { DBDoughBackup } from "../types.d.jsx"

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @returns {ListDataCache<DBDoughBackup>}
 */
export const useDoughs = ({ shouldFetch }) => 
  useListData({ tableName: "DoughBackup", shouldFetch })
