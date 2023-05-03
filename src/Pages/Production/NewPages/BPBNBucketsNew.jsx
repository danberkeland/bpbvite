import { sortBy } from "lodash"
import { useListData } from "../../../data/_listData"



export const BPBNBuckets = () => {
  const doughCache = useListData({ 
    tableName:"DoughBackup", shouldFetch: true
  })

  const BPBNdoughs = sortBy(
    doughCache.data?.filter(dough => dough.mixedWhere === "Carlton") ?? [],
    ['doughName']
  )


  return (<>
    <div>Buckets</div>
    <pre>{JSON.stringify(BPBNdoughs, null, 2)}</pre>
  </>)


}