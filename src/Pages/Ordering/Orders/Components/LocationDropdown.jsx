import { useRef, useState } from "react"
import { Dropdown } from "primereact/dropdown"

import { sortBy } from "lodash"
import { useListData } from "../../../../data/_listData"



export const LocationDropdown = ({ locNick, setLocNick, authClass }) => {
  const { data:locations } = useListData({ 
    tableName:"Location", shouldFetch: authClass === 'bpbfull'
  })

  const [highlightedLocNick, setHighlightedLocNick] = useState(locNick)
  const cancelAction = useRef(false)

  const locationDisplay = locations ? sortBy(locations, 'locName') : []
  return (
    <div className="custDrop p-fluid"
      style={{maxWidth: "28rem"}}
    >
      <Dropdown
        style={{width: "100%"}}
        options={locationDisplay}
        optionLabel="locName"
        optionValue="locNick"
        // value={locNick}
        value={highlightedLocNick}
        itemTemplate={(option) => <span>
          {`${option.locName} (${option.locNick})`}
        </span>}
        // onChange={e => setLocNick(e.value)}
        onChange={e => setHighlightedLocNick(e.value)}
        onHide={() => {
          if (!cancelAction.current) {
            setLocNick(highlightedLocNick)
          } else {
            setHighlightedLocNick(locNick)
          }
          cancelAction.current = false
        }}
        onKeyDown={e => {
          cancelAction.current = (e.key === "Escape")
        }}
        filter
        filterBy="locNick,locName"
        showFilterClear
        placeholder={locations ? "LOCATION" : "loading..."}
      />
    </div>
  )
}