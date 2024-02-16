import { useListData } from "../_listData";
/**@typedef {import('../types.d.js').DBZone[]} DBZone */

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
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