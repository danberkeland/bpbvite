import React, { useState, useMemo } from "react"
import { useDimensionData } from "../../../../data/productionData"
import { buildRouteMatrix_test } from "../../../../functions/routeFunctions/buildRouteMatrix"
import { Dropdown } from "primereact/dropdown"

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']


export const Routing = () => {


  const { data:dim } = useDimensionData({ shouldFetch:true })
  const testMatrix = useMemo(() => {
    if (!dim) return []
    return buildRouteMatrix_test(dim.locations, dim.products, dim.routes)

  }, [dim])

  const [locNick, setLocNick] = useState()
  const [prodNick, setProdNick] = useState()

  const locDisplay = (dim?.locations && locNick) ? {
    locNick: dim.locations[locNick].locNick,
    zoneNick: dim.locations[locNick].zoneNick,
    latestFirstDeliv: dim.locations[locNick].latestFirstDeliv,
    latestFinalDeliv: dim.locations[locNick].latestFinalDeliv,
  } : {}

  const validRoutes = (locNick && prodNick)
    ? weekdays.map(day => testMatrix[`${locNick}#${prodNick}#${day}`])
    : null
  
  if (!dim) return undefined
  return (<>
    <h1>Routing</h1>

    <div style={{padding: "1rem"}}>
    <Dropdown 
      value={locNick}
      options={Object.keys(dim.locations).sort().map(i => ({label: i, value: i}))}
      onChange={e => setLocNick(e.value)}
      placeholder="locNick"
      filter
    />
    </div>

    <div style={{padding: "1rem"}}>
    <Dropdown 
      value={prodNick}
      options={Object.keys(dim.products).sort().map(i => ({label: i, value: i}))}
      onChange={e => setProdNick(e.value)}
      placeholder="prodNick"
      filter
    />
    </div>
    <h3>Route Summary</h3>
    <pre>
      {JSON.stringify(validRoutes, null, 2)}
    </pre>

    <h3>Location Info</h3>
    <pre>{JSON.stringify(locDisplay, null, 2)}</pre>
    
  </>)
}