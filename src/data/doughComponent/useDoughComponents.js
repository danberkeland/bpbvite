import { useListData } from "../_listData"
import { DBDoughComponentBackup } from "../types.d.js"

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 */
const useDoughComponents = ({ shouldFetch }) => {
  const { data, ...otherCacheItems} = 
    useListData({ tableName: "DoughComponentBackup", shouldFetch })

  /**@type {DBDoughComponentBackup[] | undefined} */
  const doughComponents = data

  return { data: doughComponents, ...otherCacheItems }

}

export {
  useDoughComponents
}