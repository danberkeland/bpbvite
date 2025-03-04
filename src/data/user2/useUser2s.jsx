import { ListDataCache, useListData } from "../_listData"
import { DBUser2 } from "../types.d"


/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @returns {ListDataCache<DBUser2>}
 */
const useUser2s = ({ shouldFetch }) =>
  useListData({ tableName: "User2", shouldFetch })


/**
 * Breaks out of the usual pattern -- this query joins location attributes
 * to listed items. 
 */
const useUser2sByEmail = ({ shouldFetch, email }) => {

  const { data, ...rest } = useListData({ 
    tableName: "User2",
    customQuery: "User2byEmail",
    variables: { email, limit: 5000 },
    shouldFetch
  })

  /**@type {DBUser2[] | undefined} */
  const user2s = data

  return { data:user2s, ...rest }

}

export {
  useUser2s,
  useUser2sByEmail,
}