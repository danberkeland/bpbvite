import { useListData } from "../_listData"
import { DBNote } from "../types.d"

export const useNotes = ({ shouldFetch }) => 
  useListData({ tableName: "Notes", shouldFetch })

export const useNotesByType = ({ shouldFetch, Type }) => {
  const { data, ...rest } = useListData({ 
      tableName: "Notes", 
      customQuery: "notesByType", 
      variables: { limit: 5000, Type },
      shouldFetch 
  })

  /** @type {DBNote[]} */
  const notes = data

  return { data: notes, ...rest }

}

export const useNotesByRef = ({ shouldFetch, ref }) => {
  const { data, ...rest } = useListData({ 
    tableName: "Notes", 
    customQuery: "notesByRef", 
    variables: { limit: 5000, ref },
    shouldFetch 
  })

  /** @type {DBNote[]} */
  const notes = data

  return { data: notes, ...rest }

}



/** 
 * while ref is technically a sort key, it will typically be a string index
 * that isn't orderable, so we restrict usage to match by equality. We can make
 * a new hook if needed.
 */
export const useNotesByTypeByRef = ({ shouldFetch, Type, ref }) => {
  const { data, ...rest } = useListData({ 
    tableName: "Notes", 
    customQuery: "notesByTypeByRef", 
    variables: { limit: 5000, Type, ref: { eq: ref } },
    shouldFetch 
  })

  /** @type {DBNote[]} */
  const notes = data

  return { data: notes, ...rest }

}
