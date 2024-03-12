import { DateTime } from "luxon"
import { useListData } from "../_listData"
import { DT } from "../../utils/dateTimeFns"
import { DBInfoQBAuth } from "../types.d"


const useInfoQBAuths = ({ shouldFetch }) => {
  
  const { data, submitMutations, updateLocalData } 
    = useListData({ tableName: "InfoQBAuth", shouldFetch })


  if (!!data) {
    // console.log("InfoQB", data)
    const nowDT = DT.now()

    // const itemsToKeep = data.filter(item => 
    //   !item.id.includes("setoutTime")
    //   || nowDT.diff(DateTime.fromISO(item.updatedAt), 'days').days <= 30
    // )
    const itemsToCleanUp = data.filter(item => 
      item.id.includes("setoutTime")
      && nowDT.diff(DateTime.fromISO(item.updatedAt), 'days').days > 30
    )
    // console.log("to delete", deleteInputs) 

    if (itemsToCleanUp.length > 20) {
      console.log("cleaning up infoQBAuths...")

      // declaring the function contains the async to 1 spot
      const handleDeletion = async (deleteInputs) => {
        updateLocalData( await submitMutations({ deleteInputs }) )
      }

      handleDeletion(itemsToCleanUp.map(item => ({ id: item.id })))
        
    }
  }

  /**@type {DBInfoQBAuth[] | undefined} */
  const infoQbAuths = data

  return { data:infoQbAuths }

}

export {
  useInfoQBAuths
}