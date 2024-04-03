import { ListDataCache, useListData } from "../_listData"
import { DBDoughComponentBackup } from "../types.d.js"

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @returns {ListDataCache<DBDoughComponentBackup>}
 */
export const useDoughComponents = ({ shouldFetch }) => 
  useListData({ tableName: "DoughComponentBackup", shouldFetch })