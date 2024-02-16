import { useListData } from "../_listData"



const useUser2s = ({ shouldFetch }) => {

  const { data } = useListData({ tableName: "User2", shouldFetch })

  return { data }

}

/**
 * Breaks out of the usual pattern -- this query joins location attributes
 * to listed items. 
 */
const useUser2sByEmail = ({ shouldFetch, email }) => {

  const { data } = useListData({ 
    tableName: "User2",
    customQuery: "User2byEmail",
    variables: { email, limit: 5000 },
    shouldFetch
  })

  return { data }

}

export {
  useUser2s,
  useUser2sByEmail,
}