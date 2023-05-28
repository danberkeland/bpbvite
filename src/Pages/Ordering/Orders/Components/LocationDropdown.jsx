import { Dropdown } from "primereact/dropdown"

import { sortBy } from "lodash"
import { useListData } from "../../../../data/_listData"



export const LocationDropdown = ({ locNick, setLocNick, authClass }) => {
  const { data:locations } = useListData({ 
    tableName:"Location", shouldFetch: authClass === 'bpbfull'
  })

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
        value={locNick}
        itemTemplate={(option) => <span>
          {`${option.locName} (${option.locNick})`}
        </span>}
        onChange={e => setLocNick(e.value)}
        filter
        filterBy="locNick,locName"
        showFilterClear
        placeholder={locations ? "LOCATION" : "loading..."}
      />
    </div>
  )
}