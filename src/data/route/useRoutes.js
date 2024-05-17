import { useMemo } from "react"
import { ListDataCache, useListData } from "../_listData"
import { DBRoute2 } from "../types.d.js"
/**@typedef {import('../types.d.js').DBRoute} DBRoute */

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @returns {ListDataCache<DBRoute>}
 */
export const useRoutes = ({ shouldFetch }) => 
  useListData({ tableName: "Route", shouldFetch })



/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @returns {ListDataCache<DBRoute2>}
 */
export const useRoutes_v2 = ({ shouldFetch }) => {
  /** @type {ListDataCache<DBRoute>} */
  const { data, ...rest } = useListData({ tableName: "Route", shouldFetch })

  const _data = useMemo(() => {
    if (!data) return undefined
    return data.map(route => ({
      ...route,
      RouteSched: ["1", "2", "3", "4", "5", "6", "7"].map(legacyWeekday => 
        route.RouteSched.includes(legacyWeekday)
      )
    }))
  }, [data])


  return { data: _data, ...rest }
}