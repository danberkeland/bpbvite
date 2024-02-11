import { useListData } from "../_listData"
import { DBProduct } from "../types.d.js"

/**
 * @typedef {"Type"
 * | "prodName"
 * | "prodNick"
 * | "packGroup"
 * | "packSize"
 * | "doughNick"
 * | "freezerThaw"
 * | "packGroupOrder"
 * | "shapeDay"
 * | "shapeNick"
 * | "bakeDay"
 * | "bakeNick"
 * | "guarantee"
 * | "transferStage"
 * | "readyTime"
 * | "bakedWhere"
 * | "wholePrice"
 * | "retailPrice"
 * | "isRetail"
 * | "retailName"
 * | "retailDescrip"
 * | "isWhole"
 * | "isEOD"
 * | "weight"
 * | "descrip"
 * | "picURL"
 * | "squareID"
 * | "forBake"
 * | "bakeExtra"
 * | "batchSize"
 * | "defaultInclude"
 * | "leadTime"
 * | "daysAvailable"
 * | "qbID"
 * | "currentStock"
 * | "whoCountedLast"
 * | "freezerClosing"
 * | "freezerCount"
 * | "freezerNorth"
 * | "freezerNorthClosing"
 * | "freezerNorthFlag"
 * | "prepreshaped"
 * | "preshaped"
 * | "updatePreDate"
 * | "updateFreezerDate"
 * | "backporchbakerypre"
 * | "backporchbakery"
 * | "bpbextrapre"
 * | "bpbextra"
 * | "bpbssetoutpre"
 * | "bpbssetout"
 * | "sheetMake"
 * | "updatedAt"
 * | "createdAt"
 * | "inventoryProductId"
 * } ProductKey 
 */

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @param {ProductKey[]} [input.projection]
 */
const useProducts = ({ shouldFetch, projection }) => {
  const { data, ...otherCacheItems} = 
    useListData({ tableName: "Product", shouldFetch, projection })

  /**@type {DBProduct[] | undefined} */
  const products = data

  return { data: products, ...otherCacheItems}

}

export {
  useProducts
}