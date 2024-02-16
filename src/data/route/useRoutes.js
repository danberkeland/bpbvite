import { useListData } from "../_listData"
/**@typedef {import('../types.d.js').DBRoute} DBRoute */

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 */
const useRoutes = ({ shouldFetch }) => {
  const { data, ...otherCacheItems} = 
    useListData({ tableName: "Route", shouldFetch })

  /**@type {DBRoute[] | undefined} */
  const routes = data

  return { data: routes, ...otherCacheItems}

}

export {
  useRoutes
}