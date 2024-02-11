import { keyBy, uniq } from "lodash"
import { useListData } from "../../../../../data/_listData"
import { useMemo } from "react"



const useLegacyOverrideData = () => {

  const shouldFetch = true
  const { data:PNA } = useListData({ tableName: "ProdsNotAllowed", shouldFetch })
  const { data:APR } = useListData({ tableName: "AltPricing", shouldFetch: true })
  const { data:ALT } = useListData({ tableName: "AltLeadTime", shouldFetch })
  const { data:PRD } = useListData({ tableName: "Product", shouldFetch })

  const calculateValue = () => {
    if (!PNA || !APR || !ALT ||!PRD) return undefined

    const products = keyBy(PRD, 'prodNick')
    const prodsNotAllowed = keyBy(PNA, item => `${item.locNick}#${item.prodNick}`)
    const altPrices = keyBy(APR, item => `${item.locNick}#${item.prodNick}`)
    const altLeadTimes = keyBy(ALT, item => `${item.locNick}#${item.prodNick}`)

    const dataKeys = uniq([
      ...Object.keys(prodsNotAllowed), 
      ...Object.keys(altPrices), 
      ...Object.keys(altLeadTimes)
    ])

    return dataKeys.map(key => ({
      locNick: key.split("#")[0],
      prodNick: key.split("#")[1],
      defaultInclude: prodsNotAllowed[key]?.isAllowed,
      leadTime: altLeadTimes[key]?.leadTime,
      readyTime: null,
      daysAvailable: null,
      wholePrice: altPrices[key]?.wholePrice,
    }))
  }

  return { data: useMemo(calculateValue, [PNA, APR, ALT])}

}

export { useLegacyOverrideData }