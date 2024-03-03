import { useListData } from "../_listData"
import { DBLocationUser2 } from "../types.d"

export const useLocationUser2s = ({ shouldFetch }) => {

  const { data, ...rest } = useListData({ 
    tableName: "LocationUser2", 
    shouldFetch 
  })

  /**@type {DBLocationUser2[] | undefined } */
  const locationUser2s = data

  return { data:locationUser2s, ...rest }

}