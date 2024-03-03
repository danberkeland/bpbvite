import { useListData } from "../_listData"
import { DBUser2 } from "../types.d"



const useUser2s = ({ shouldFetch }) => {

  const { data, ...rest } = useListData({ 
    tableName: "User2", 
    shouldFetch 
  })

  /**@type {DBUser2[] | undefined} */
  const user2s = data

  return { data:user2s, ...rest }

}

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