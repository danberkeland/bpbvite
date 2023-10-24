import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { MultiSelect } from "primereact/multiselect"
import { InputText } from "primereact/inputtext"

import { useListData } from "../../../data/_listData"

import { debounce, sortBy, truncate, uniqBy } from "lodash"
import { TabMenu } from "primereact/tabmenu"

import { useState } from "react"
import { LocationForm } from "./FormDialog"

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
  const q = query.toLowerCase().replace(/\s/g, '')

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

  const [query, setQuery] = useState('')
  const dbSetQuery = debounce(setQuery, 120)

  const [zoneNickFilterValues, setZoneNickfilterValues] = useState()
  
  const { data:LOC } = useListData({ tableName:"Location", shouldFetch: true })

  if (!LOC) return <div>Loading...</div>

  const zoneOptions = sortBy(uniqBy(LOC, 'zoneNick').map(L => L.zoneNick))

  const displayData = searchLocations(LOC, query)
    .filter(L =>
      (!zoneNickFilterValues || !zoneNickFilterValues.length)
      || zoneNickFilterValues.includes(L.zoneNick)
    )

  const CreateButtonTemplate = ({ rowData }) => {
    const [show, setShow] = useState(false)
    const editMode = 'create'
    const dialogProps = {rowData, editMode, show, setShow}

    return <div>
      <Button icon="pi pi-plus" 
        className="p-button-rounded" 
        onClick={() => setShow(true)}
      />
      {show && <LocationForm {...dialogProps} />}
    </div>
  }

  const UpdateButtonTemplate = ({ rowData }) => {
    const [show, setShow] = useState(false)
    const editMode = 'update'
    const dialogProps = {rowData, editMode, show, setShow}

    return <div>
      <Button icon="pi pi-pencil" 
        className="p-button-rounded p-button-outlined" 
        onClick={() => setShow(true)}
      />
      {show && <LocationForm {...dialogProps} />}
    </div>
  }

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
        value={displayData} 
        dataKey="locNick"
        editMode="cell"
        scrollable
        scrollHeight="600px"
        responsiveLayout="scroll"
        style={{background: "var(--bpb-surface-content)"}}
      
      >
        <Column frozen
          header={rowData => CreateButtonTemplate({ rowData })} 
          body={rowData => UpdateButtonTemplate({ rowData })} 
          style={{flex: "0 0 4.5rem"}}
          headerStyle={{height: "5.1rem"}}
        />
        <Column 
          field="locName" frozen
          header={row => {
            return <span className="p-input-icon-right" style={{flex: "1 .5 9rem"}}>
              <i className="pi pi-fw pi-search" />
              <InputText 
                placeholder="Location"
                onChange={e => dbSetQuery(e.target.value)}
                onFocus={e => e.target.select()}
                style={{width: "100%"}}
              />
            </span>
          }} 
          body={R => <div onClick={() => console.log(R)} style={{minHeight: "2.75rem"}}>
            <div>{R.locName}</div>
            <div style={{fontSize: ".8rem", fontFamily: "monospace" }}>{R.locNick}</div>
          </div>}
          style={{flex: "1 0 13rem"}}
        />

        {columnCategory === 'Address' && [
          <Column header="Addr1" field="addr1" style={{flex: "1 0 10rem", maxWidth: "15rem"}} />,
          <Column header="Addr2" field="addr2" style={{flex: "1 0 10rem", maxWidth: "15rem"}} />,
          <Column header="City" field="city" style={{flex: ".5 0 8rem", maxWidth: "15rem"}} />,
          <Column header="Zip" field="zip" style={{flex: "0 0 7rem"}} />,
          <Column header="gMap" field="gMap" style={{flex: "0 0 6rem"}}
            body={row => <GMapTemplate row={row} />}
          />,
        ]}

        {columnCategory === 'Contact' && [
          <Column header="First Name" field="firstName" style={{flex: ".25 0 8rem", maxWidth: "15rem"}} />,
          <Column header="Last Name" field="lastName" style={{flex: ".25 0 8rem", maxWidth: "15rem"}} />,
          <Column header="Phone" field="phone" style={{flex: "0 0 9rem"}} />,
          <Column header="Email" field="email" style={{flex: "1 0 10rem"}} bodyStyle={{overflow: "hidden"}}
            body={R => <div>
              {R.email.replace(' ', '').split(",").map((email, idx) => {
                return <div key={`email=${idx}`}>
                  {/* {truncate(email, { length: 20 })} */}
                  {email}
                </div>
              })}
            </div>}
          />,
        ]}

        {columnCategory === 'Billing' && [
          <Column header="qbID" field="qbID" body={R => truncate(R.qbID, { length: 10 })} sortable style={{flex: "0 0 7rem"}} />,
          <Column header="Invoice Frequency" field="invoicing"  style={{flex: "0 0 7rem"}} />,
          <Column header="Terms" field="terms" style={{flex: "0 0 7rem"}} />,
          <Column header="Email Invoice?" body={R => boolTemplate(R.toBeEmailed)} style={{flex: "0 0 6rem"}} />,
          <Column header="Print Invoice?" body={R => boolTemplate(R.toBePrinted)} style={{flex: "0 0 6rem"}} />,
          <Column header="Print Duplicate?" body={R => boolTemplate(R.printDuplicate)} style={{flex: "0 0 6rem"}} />,
        ]}

        {columnCategory === 'Fulfillment' && [
          <Column field="zoneNick"  
            header={R => <MultiSelect 
              placeholder="Zone" 
              options={zoneOptions} 
              value={zoneNickFilterValues} 
              onChange={e => setZoneNickfilterValues(e.value)} 
              showClear
              maxSelectedLabels={1}
              style={{width: "13rem"}}
              panelStyle={{ width: "13rem "}}
            />}
            style={{flex: ".15 0 10rem"}}
          />,
          <Column header="Preferred Fulfillment" field="dfFulfill" style={{flex: ".1 0 7rem"}} />,
          <Column header="Earliest Deliv" field="latestFirstDeliv" style={{flex: ".1 0 7rem"}} />,
          <Column header="Latest Deliv" field="latestFinalDeliv" style={{flex: ".1 0 7rem"}} />,
          <Column header="Deliv Order" field="delivOrder" body={R => JSON.stringify(R.delivOrder)} sortable style={{flex: ".1 0 7rem"}} />,
        ]}

      </DataTable>

      {/* <Button label="Clean up Deliv Order" 
        onClick={() => {
          const falsyItems = LOC.filter(L => !L.delivOrder).map(L => ({locNick: L.locNick, delivOrder: L.delivOrder}))
          console.log("Deliv Orders to fix: ", falsyItems)
          const logItems = sortBy(LOC, 'delivOrder')
            .filter(L => !!L.delivOrder) // preserve 0 or null values to be handled manually
            .map((L, idx) => {
              return {
                locNick: L.locNick,
                delivOrder: (idx + 1) * 10,
                oldDelivOrder: L.delivOrder,
              }
            })
          console.log("Changes to be submitted:", logItems)
          const updateInputs = logItems.map(L => ({ locNick: L.locNick, delivOrder: L.delivOrder}))
          console.log("submitting...", updateInputs)
        }}
      /> */}
    </div>
  )

}



const GMapTemplate = ({ row }) => {
  // const [showDialog, setShowDialog] = useState(false)
  if (!row.gMap) return 

  return <div>
    {/* <Dialog visible={showDialog} onHide={() => setShowDialog(false)}> */}
    <a 
      href={row.gMap} 
      target="_blank" 
      rel="noreferrer" 
      referrerPolicy="no-referrer"
    >
      Link
    </a>
  </div> 
  
}


const boolTemplate = (boolValue) => boolValue === true
  ? <i className="pi pi-check-circle" />
  : boolValue === false 
    ? <i className="pi pi-times" style={{opacity: ".35"}} />
    : JSON.stringify(boolValue, null, 2)