import { ListDataCache, useListData } from "../_listData.js"
import { DBTemplateProd } from "../types.d.jsx"

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @returns {ListDataCache<DBTemplateProd>}
 */
const useTemplateProds = ({ shouldFetch }) => 
  useListData({ tableName: "TemplateProd", shouldFetch })


/**
 * @param {Object} input
 * @param {string} input.locNick
 * @param {boolean} input.shouldFetch 
 * @returns {ListDataCache<DBTemplateProd>}
 */
const useTemplateProdsByLocNick = ({ locNick, shouldFetch }) => 
  useListData({ 
    tableName: "TemplateProd", 
    customQuery: "templateProdsByLocNick",
    variables: { locNick, limit: 5000 },
    shouldFetch 
  })


export {
  useTemplateProds,
  useTemplateProdsByLocNick,
}