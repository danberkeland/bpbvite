import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { MultiSelect } from "primereact/multiselect"
import { InputText } from "primereact/inputtext"

import { useListData } from "../../../data/_listData"

import { debounce, flow, groupBy, mapValues, min, sortBy, truncate } from "lodash/fp"
import { TabMenu } from "primereact/tabmenu"
import { useProductSchema } from "./schema"
import { useState } from "react"
import { ProductForm } from "./Form"

export const Products = () => {

  const [activeIndex, setActiveIndex] = useState(0)
  const [editMode, setEditMode] = useState('')

  const [query, setQuery] = useState('')
  const dbSetQuery = debounce(120)(setQuery)
  
  const { data:PRD=[] } = useListData({ tableName: "Product", shouldFetch: "true" })
  const tableData = rankedSearch({ 
    data: PRD, 
    onFields: ['prodNick', 'prodName'], 
    query
  })

  const schema = useProductSchema({ editMode })
  const schemaDescription = schema.describe()

  const tabModel = schemaDescription.meta.categories.map(cat => ({ label: cat }))
  const activeColumnCategory = schemaDescription.meta.categories[activeIndex]
  // console.log("activeIndex", activeIndex)
  // console.log("activeColumnCategory", activeColumnCategory)

  const attributesByCategory = !!schemaDescription.fields
    ? flow(
        groupBy(key => schemaDescription.fields[key].meta?.category),
        //mapKeys(key => key === 'undefined' ? 'Other' : key),
      )(Object.keys(schemaDescription.fields))
    : []

  const columnsByCategory = mapValues(attributes => attributes.map(att => {
    return <Column key={att} header={att} body={row => truncate(25)(JSON.stringify(row[att]))} />
  })
  )(attributesByCategory)

  const CreateButtonTemplate = () => {
    const [show, setShow] = useState(false)
    const dialogProps = {
      initialValues: schema.default(), 
      schema, 
      show, 
      setShow, 
      setEditMode
    }

    return <div>
      <Button icon="pi pi-plus" 
        className="p-button-rounded" 
        onClick={() => {
          setEditMode('create')
          setShow(true)
        }}
      />
      {show && <ProductForm {...dialogProps} />}
    </div>
  }

  const UpdateButtonTemplate = ({ rowData }) => {
    const [show, setShow] = useState(false)
    const dialogProps = {initialValues:rowData, schema, show, setShow, setEditMode}

    return <div>
      <Button icon="pi pi-pencil" 
        className="p-button-rounded p-button-outlined" 
        onClick={() => {
          setEditMode('update')
          setShow(true)
        }}
      />
      {show && <ProductForm {...dialogProps} />}
    </div>
  }

  return (
    <div style={{padding: "6rem" }}>
      <h1>Products</h1>
      <TabMenu 
        model={tabModel} 
        activeIndex={activeIndex}
        onTabChange={e => setActiveIndex(e.index)}  
      />
      <DataTable 
        value={tableData}
        scrollable
        scrollHeight="600px"
        responsiveLayout="scroll"
      >
        <Column frozen
          header={CreateButtonTemplate()} 
          body={rowData => UpdateButtonTemplate({ rowData })} 
          style={{flex: "0 0 4.5rem"}}
          headerStyle={{height: "5.1rem"}}
        />
        <Column 
          frozen
          // header="Product"
          header={() => {
            return <span className="p-input-icon-right" style={{flex: "1 .5 9rem"}}>
              <i className="pi pi-fw pi-search" />
              <InputText 
                placeholder="Product"
                onChange={e => dbSetQuery(e.target.value)}
                onFocus={e => e.target.select()}
                style={{width: "100%"}}
              />
            </span>
          }} 
          body={R => <div onClick={() => console.log(R)} style={{minHeight: "2.75rem"}}>
            <div>{R.prodName}</div>
            <div style={{fontSize: ".8rem", fontFamily: "monospace" }}>{R.prodNick}</div>
          </div>}
          // style={{flex: "1 0 13rem"}}
          style={{width: "14rem"}}
        />        
        {columnsByCategory[activeColumnCategory]}
      </DataTable>
    </div>
  )
  

}



// const TextSearch = ({}) => {}




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

const getBestMatchScore = (query, item, onFields) => {
  // const d1 = levenshteinDistance(location.locNick, query)
  // const d2 = levenshteinDistance(location.locName.toLowerCase(), query) 
  // return Math.min(d1, d2)
  const distances = onFields.map(f => levenshteinDistance(item[f], query))
  return min(distances)
}

const rankedSearch = ({ query, data, onFields }) => {
  if (!query) return data

  const q = query.toLowerCase().replace(/\s/g, '')

  let substrMatches = data.filter(item => 
    onFields.some(field => 
      item[field].replace(/\s/g, '').toLowerCase().includes(q)
    )
  )

  return substrMatches.length
    ? sortBy(item => getBestMatchScore(query, item, onFields, ))(substrMatches).slice(0,10)
    : sortBy(item => getBestMatchScore(query, item, onFields))(data).slice(0,10)

}