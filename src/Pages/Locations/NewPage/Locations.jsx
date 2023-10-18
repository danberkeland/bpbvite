import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Dropdown } from "primereact/dropdown"
import { FilterMatchMode, FilterOperator } from "primereact/api"
import { InputText } from "primereact/inputtext"

import { useListData } from "../../../data/_listData"

import { debounce, keyBy, sortBy, truncate } from "lodash"
import { TabMenu } from "primereact/tabmenu"
import { useEffect, useState } from "react"

const tabOptions = [
  { label: 'Address', icon: '' },
  { label: 'Contact', icon: '' },
  { label: 'Billing', icon: '' },
  { label: 'Fulfillment', icon: '' },
]

const levenshteinDistance = (s, t) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[t.length][s.length];
};

const getMatchScore = (location, query) => {
  const d1 = levenshteinDistance(location.locNick, query)
  const d2 = levenshteinDistance(location.locName.toLowerCase(), query) 
  return Math.min(d1, d2)
}

const searchLocations = (locations, query) => {
  if (!query) return locations
  const q = query.toLowerCase()

  let results = locations.filter(L => 
    L.locNick.includes(q) 
    || L.locName.replace(/\s/g, '').toLowerCase().includes(q)
  )

  return results.length
    ? sortBy(results, L => getMatchScore(L, q)).slice(0,10)
    : locations

}

export const Locations = () => {

  const [activeIndex, setActiveIndex] = useState(0)
  const [columnCategory, setColumnCategory] = useState('Address')
  const [locations, setLocations] = useState()
  const dbSetLocations = debounce(setLocations, 100)

  const [filterValue, setFilterValue] = useState('')
  const dbSetFilterValue = debounce(setFilterValue, 100)

  const [zoneNickFilterValue, setZoneNickfilterValue] = useState()
  
  const { data:LOC } = useListData({ tableName:"Location", shouldFetch: true })
  const { data:ZNE } = useListData({ tableName: "Zone", shouldFetch: true})

  useEffect(() => {if (!!LOC) setLocations(structuredClone(LOC))}, [LOC])

  if (!locations || !LOC || !ZNE) return <div>Loading...</div>

  //console.log("attributes", Object.keys(LOC[0]))
  const zoneOptions = sortBy(ZNE.map(Z => Z.zoneNick))

  const zoneInputTemplate = (row) => {
    return <Dropdown options={zoneOptions} value={row.zoneNick} />
  }

  const tableData = searchLocations(LOC, filterValue).filter(L => 
    !zoneNickFilterValue || L.zoneNick === zoneNickFilterValue  
  )


  return(
    <div style={{padding: "6rem" }}>



      <div>
        <TabMenu model={tabOptions} 
          activeIndex={activeIndex} 
          onTabChange={(e) => {
            setActiveIndex(e.index)
            setColumnCategory(tabOptions[e.index].label)
          }} 
        />
      </div>
      <DataTable 
        value={tableData} 
        dataKey="locNick"
        editMode="cell"
        scrollable
        scrollHeight="600px"
        //size="large"
        //showGridlines
        //resizableColumns
        responsiveLayout="scroll"
      >
        {/* <Column rowEditor frozen style={{maxWidth: "7rem"}} /> */}
        {/* <Column header="locNick (ID)" field="locNick" frozen />
        <Column header="locName" field="locName" frozen /> */}
        <Column 
          field="locName" frozen
          header={row => {
            return <InputText 
              placeholder="Location"
              onChange={e => dbSetFilterValue(e.target.value)}
              style={{width: "10rem"}}
              onFocus={e => e.target.select()}
            />
          }} 
          body={R => <div onClick={() => console.log(R)}>
            <div>{R.locName}</div>
            <div style={{fontSize: ".8rem", fontFamily: "monospace"}}>{R.locNick}</div>
          </div>}
          style={{flex: "0 0 15rem"}}
        />

        <Column header="Addr1" field="addr1" hidden={columnCategory !== 'Address'} />
        <Column header="Addr2" field="addr2" hidden={columnCategory !== 'Address'}/>
        <Column header="City" field="city" hidden={columnCategory !== 'Address'} />
        <Column header="Zip" field="zip" hidden={columnCategory !== 'Address'} />

        <Column header="First Name" field="firstName" hidden={columnCategory !== 'Contact'} />
        <Column header="Last Name" field="lastName" hidden={columnCategory !== 'Contact'} />
        <Column header="Phone" field="phone" hidden={columnCategory !== 'Contact'} style={{width: "15rem"}}/>
        <Column header="Email" field="email" hidden={columnCategory !== 'Contact'} 
          body={R => <div>
            {R.email.replace(' ', '').split(",").map((email, idx) => {
              return <div key={`email=${idx}`}>{truncate(email, { length: 20 })}</div>
            })}
          </div>}
        />

        <Column header="qbID" field="qbID" body={R => truncate(R.qbID, { length: 10 })} hidden={columnCategory !== 'Billing'} sortable />
        <Column header="Invoice Frequency" field="invoicing" hidden={columnCategory !== 'Billing'} />
        <Column header="Terms" field="terms" hidden={columnCategory !== 'Billing'} />
        <Column header="Print Invoice?" body={R => JSON.stringify(R.toBePrinted)} hidden={columnCategory !== 'Billing'} />
        <Column header="Print Duplicate?" body={R => JSON.stringify(R.printDuplicate)} hidden={columnCategory !== 'Billing'} />
        <Column header="Email Invoice?" body={R => JSON.stringify(R.toBeEmailed)} hidden={columnCategory !== 'Billing'} />

        <Column field="zoneNick" hidden={columnCategory !== 'Fulfillment'} 
          header={R => <Dropdown placeholder="Zone" options={zoneOptions} value={zoneNickFilterValue} onChange={e => setZoneNickfilterValue(e.value)} showClear />}
        />
        <Column header="Preferred Fulfillment" field="dfFulfill" hidden={columnCategory !== 'Fulfillment'} />
        <Column header="Earliest Deliv" field="latestFirstDeliv" hidden={columnCategory !== 'Fulfillment'} />
        <Column header="Latest Deliv" field="latestFinalDeliv" hidden={columnCategory !== 'Fulfillment'} />
        <Column header="Deliv Order" field="delivOrder" body={R => JSON.stringify(R.delivOrder)} sortable hidden={columnCategory !== 'Fulfillment'} />
        

      </DataTable>
    </div>
  )

}