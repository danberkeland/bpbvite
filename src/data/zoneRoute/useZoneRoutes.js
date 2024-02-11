import { useListData } from "../_listData";
/**@typedef {import('../types.d.js').DBZoneRoute} DBZoneRoute */

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 */
const useZoneRoutes = ({ shouldFetch }) => {
  const { data, ...otherCacheItems } =  
    useListData({ tableName: "ZoneRoute", shouldFetch })

    /**@type {DBZoneRoute[] | undefined} */
    const zones = data

    return { data: zones, ...otherCacheItems}

}

export {
  useZoneRoutes
}