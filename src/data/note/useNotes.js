import { ListDataCache, useListData } from "../_listData"
import { DBNote } from "../types.d"

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @returns {ListDataCache<DBNote>}
 */
export const useNotes = ({ shouldFetch }) => 
  useListData({ tableName: "Notes", shouldFetch })


/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @param {string} input.Type
 * @returns {ListDataCache<DBNote>}
 */
export const useNotesByType = ({ shouldFetch, Type }) => 
  useListData({ 
    tableName: "Notes", 
    customQuery: "notesByType", 
    variables: { limit: 5000, Type },
    shouldFetch 
  })

  
/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @param {string} input.ref
 * @returns {ListDataCache<DBNote>}
 */
export const useNotesByRef = ({ shouldFetch, ref }) => 
  useListData({ 
    tableName: "Notes", 
    customQuery: "notesByRef", 
    variables: { limit: 5000, ref },
    shouldFetch 
  })


/** 
 * while ref is technically a sort key, it will typically be a string index
 * that isn't orderable, so we restrict usage to match by equality. We can make
 * a new hook if needed.
 * @param {Object} input
 * @param {boolean} input.shouldFetch 
 * @param {string} input.Type
 * @param {string} input.ref
 * @returns {ListDataCache<DBNote>}
 */
export const useNotesByTypeByRef = ({ shouldFetch, Type, ref }) => 
  useListData({ 
    tableName: "Notes", 
    customQuery: "notesByTypeByRef", 
    variables: { limit: 5000, Type, ref: { eq: ref } },
    shouldFetch 
  })