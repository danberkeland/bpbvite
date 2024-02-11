import { keyBy } from "lodash"
import { useListData } from "../../../../../data/_listData"
import { useLegacyOverrideData } from "./legacyOverrideData"
import { useMemo } from "react"



// Goal: Be able to asserts override data from multiple legacy tables to new table.



const useOverrideSyncData = () => {

  const { data:LOV } = useLegacyOverrideData()
  const { data:OVR } = useListData({ tableName: "LocationProductOverride", shouldFetch: true })

  // makes nicely structured data that indicates what to create/update/delete.
  const calculateValue = () => {
    if (!LOV || !OVR) return undefined

    const legacyOverrides = keyBy(LOV, item => `${item.locNick}#${item.prodNick}`)
    const overrides = keyBy(OVR, item => `${item.locNick}#${item.prodNick}`)

    const keysForDeletion = Object.keys(overrides).filter(key => !legacyOverrides.hasOwnProperty(key))
    const keysForCreation = Object.keys(legacyOverrides).filter(key => !overrides.hasOwnProperty(key))

    

    const deleteItems = keysForDeletion.map(key => ({
      id: overrides[key].id
    }))

    const createItems = keysForCreation.map(key => ({
      locNick: legacyOverrides[key].locNick,
      prodNick: legacyOverrides[key].prodNick,
      defaultInclude: legacyOverrides[key].defaultInclude ?? null,
      leadTime: legacyOverrides[key].leadTime ?? null,
      readyTime: legacyOverrides[key].readyTime ?? null,
      daysAvailable: legacyOverrides[key].daysAvailable ?? null,
      wholePrice: legacyOverrides[key].wholePrice ?? null,
    }))

    const comparisonAttributes = [
      "defaultInclude",
      "leadTime",
      "readyTime",
      "daysAvailable",
      "wholePrice",
    ]

    const updateItems = Object.keys(overrides)
      .filter(key => legacyOverrides.hasOwnProperty(key))
      .filter(key => comparisonAttributes.some(att => 
        overrides[key][att] !== legacyOverrides[key][att]
      ))
      .map(key => ({
        id: overrides[key].id,
        defaultInclude: legacyOverrides[key].defaultInclude ?? null,
        leadTime: legacyOverrides[key].leadTime ?? null,
        readyTime: legacyOverrides[key].readyTime ?? null,
        daysAvailable: legacyOverrides[key].daysAvailable ?? null,
        wholePrice: legacyOverrides[key].wholePrice ?? null,
      }))


      return {
        deleteItems,
        createItems,
        updateItems,
      }
  }

  return { data: useMemo(calculateValue, [LOV, OVR])}

}

export { useOverrideSyncData }