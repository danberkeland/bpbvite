// Data for Admins; Manage notes about customer ordering

//import { useMemo } from "react"
import { orderBy } from "lodash"
import { useListData } from "../../../../data/_listData"
import { useMemo } from "react"


const useOrderNotesByCustomer = ({ locNick, shouldFetch }) => {

  const { data, ...rest } = useListData({ 
    tableName: "Notes",
    customQuery: "notesByTypeByRef",
    variables: { 
      limit: 5000, 
      Type: 'ordering',
      ref: { eq: locNick }
    },
    shouldFetch,
  
  })

  // console.log('DATA', data)
  // console.log('locnick', locNick)

  const calculateValue = () => !!data
    ? orderBy(data, 'createdAt', 'desc')      
        .concat([{ note: '' }])
        .map((item, idx) => ({ ...item, _idx: idx}))
    : undefined

  return { 
    data: useMemo(calculateValue, [data]),
    ...rest
  }

}

export { useOrderNotesByCustomer }