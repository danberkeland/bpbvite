import { useListData } from "../../../data/_listData"




const ManageCustomers = () => {

  const { data:LOC } = useListData({ tableName: "Location",      shouldFetch: true })
  const { data:LCU } = useListData({ tableName: "LocationUser2", shouldFetch: true })
  const { data:USR } = useListData({ tableName: "User2",         shouldFetch: true })

  



}