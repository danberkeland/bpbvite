import React from "react"
import { useListData } from "../../../../../data/_listData"



const BpbnBuckets = () => {
  
  const { data:DGH } = useListData({ tableName: "DoughBackup", shouldFetch: true})
  const { data:DCP } = useListData({ tableName: "DoughComponentBackup", shouldFetch: true })

  console.log('DGH', DGH)
  console.log('DCP', DCP)

  return (
    <h1>Buckets</h1>
  )
}

export { BpbnBuckets as default }