import { useListData } from "../_listData"
import { DBTemplateProd } from "../types.d.js"

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 */
const useTemplateProds = ({ shouldFetch }) => {
  const { data, ...otherCacheItems } = 
    useListData({ tableName: "TemplateProd", shouldFetch })

  /**@type {DBTemplateProd[] | undefined} */
  const overrides = data

  return { data: overrides, ...otherCacheItems}

}

/**
 * @param {Object} input
 * @param {string} input.locNick
 * @param {boolean} input.shouldFetch 
 */
const useTemplateProdsByLocNick = ({ locNick, shouldFetch }) => {
  const { data, ...otherCacheItems } = 
    useListData({ 
      tableName: "TemplateProd", 
      customQuery: "templateProdsByLocNick",
      variables: { locNick, limit: 5000 },
      shouldFetch 
    })

  //Might want to Dedupe this one!
  /**@type {DBTemplateProd[] | undefined} */
  const overrides = data

  return { data: overrides, ...otherCacheItems}

}


export {
  useTemplateProds,
  useTemplateProdsByLocNick,
}