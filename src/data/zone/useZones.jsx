import { ListDataCache, useListData } from "../_listData.js";
import { DBZone } from "../types.d.jsx";

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @returns {ListDataCache<DBZone>}
 */
const useZones = ({ shouldFetch }) => {
  const { data, ...otherCacheItems } =  
    useListData({ tableName: "Zone", shouldFetch })

    /**@type {DBZone[] | undefined} */
    const zones = data

    return { data: zones, ...otherCacheItems}

}

export {
  useZones
}