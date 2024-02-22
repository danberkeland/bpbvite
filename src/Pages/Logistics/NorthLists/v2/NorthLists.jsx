import React from "react"
import { useNorthListData } from "./data"
import { DT } from "../../../../utils/dateTimeFns"



const NorthLists = () => {

  const { data:northLists } = useNorthListData({ delivDT: DT.today() })

  return <h1>North Lists</h1>
}

export { NorthLists as default } 