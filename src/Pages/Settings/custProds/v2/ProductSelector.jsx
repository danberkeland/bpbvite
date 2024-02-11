import { sortBy } from "lodash"
import { useListData } from "../../../../data/_listData"
import { Dropdown } from "primereact/dropdown"

// TODO: convert to AutoComplete component (as on the Orders page)

const ProductSelector = ({ prodNick, onChange }) => {

  const { data:LOC } = useListData({ 
    tableName: "Product", 
    shouldFetch: true 
  })

  return(

    <Dropdown 
      id="product-selector"
      options={sortBy(LOC, 'prodName')}
      value={prodNick}
      //placeholder="Select Product"
      optionValue="prodNick"
      optionLabel="prodName"
      onChange={onChange}
      filter
      showClear
      style={{width: "20rem"}}
    />
    
  )
}

export { ProductSelector }