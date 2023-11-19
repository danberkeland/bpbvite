import { useListData } from "../_listData"



export const useLiveNoteData = () => {

  const { data:notes } = useListData({ tableName: "Notes", shouldFetch: true})

  const subData = 



}