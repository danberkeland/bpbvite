import { sortBy } from "lodash"
import { useListData } from "../../../../data/_listData"
import { Dropdown } from "primereact/dropdown"

// TODO: convert to AutoComplete component (as on the Orders page)

const LocationSelector = ({ locNick, onChange }) => {

  const { data:LOC } = useListData({ 
    tableName: "Location", 
    shouldFetch: true 
  })

  return(

    <Dropdown 
      id="location-selector"
      options={sortBy(LOC, 'locName')}
      value={locNick}
      //placeholder="Select Location"
      optionValue="locNick"
      optionLabel="locName"
      onChange={onChange}
      filter
      showClear
      style={{width: "20rem"}}
    />
    
  )
}

export { LocationSelector }