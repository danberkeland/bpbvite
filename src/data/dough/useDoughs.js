import { useListData } from "../_listData"
import { DBDoughBackup } from "../types.d.js"

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 */
const useDoughs = ({ shouldFetch }) => {
  const { data, ...otherCacheItems} = 
    useListData({ tableName: "DoughBackup", shouldFetch })

  /**@type {DBDoughBackup[] | undefined} */
  const routes = data

  return { data: routes, ...otherCacheItems}

}

export {
  useDoughs
}