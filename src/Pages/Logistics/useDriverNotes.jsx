import { useNotesByTypeByRef } from "../../data/note/useNotes"

export const useDriverNotes = ({ reportDate }) => {

  const { data } = useNotesByTypeByRef({ 
    shouldFetch:true , 
    Type: "logistics", 
    ref: "longdriver"
  })

  const notes = (data ?? [])
    .filter(N => N.when === reportDate)

  return {
    data: notes
  }

}