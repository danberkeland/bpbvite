import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
// import { MultiSelect } from "primereact/multiselect"
import { InputText } from "primereact/inputtext"

import { useListData } from "../../../data/_listData"

import { debounce,  flow,  groupBy, mapValues, min, pickBy, sortBy } from "lodash/fp"
import { TabMenu } from "primereact/tabmenu"
import { useProductSchema } from "./schema"
import { useState } from "react"
import { ProductForm } from "./Form"
import { bodyTemplates } from "./TableTempates"

const pickByWithKey = pickBy.convert({ 'cap': false })

export const Products = () => {

  const [activeIndex, setActiveIndex] = useState(0)
  const [editMode, setEditMode] = useState('')

  const [query, setQuery] = useState('')
  const dbSetQuery = debounce(120)(setQuery)
  
  const productCache = useListData({ tableName: "Product", shouldFetch: "true" })
  const { data:PRD=[] } = productCache
  const tableData = rankedSearch({ 
    data: PRD, 
    onFields: ['prodNick', 'prodName'], 
    query,
    nResults: 20
  })

  const schema = useProductSchema({ editMode })
  const schemaDescription = schema.describe()
  // console.log("schema description:", schemaDescription)

  const tabModel = schemaDescription.meta.categories.map(cat => ({ label: cat }))
  const activeCategory = schemaDescription.meta.categories[activeIndex]

  const fieldsByCategory = flow(
    groupBy(field => schemaDescription.fields[field].meta?.category),
    pickByWithKey((_, category) => 
      schemaDescription.meta.categories.includes(category)
    )
  )(Object.keys(schemaDescription?.fields ?? []))
  //console.log("fieldsByCategory", fieldsByCategory)

  const columnsByCategory = mapValues(fields => fields.map(field => {
    const dataType = schemaDescription.fields[field]?.type
    const bodyTemplate = bodyTemplates[field]
      ?? bodyTemplates[dataType]
      ?? bodyTemplates['default']

    return (
      <Column 
        key={field} 
        header={field} 
        body={row => bodyTemplate(row[field], row)} 
      />
    )
  })
  )(fieldsByCategory)

  const FormButton = ({ 
    initialValues, 
    icon, 
    buttonClassName, 
    editModeValue,
  }) => {
    const [show, setShow] = useState(false)
    const dialogProps = {
      initialValues, 
      schema, 
      schemaDescription,
      fieldsByCategory,
      listDataCache: productCache,
      show, setShow, 
      editMode, setEditMode
    }

    return (
      <div>
        <Button 
          icon={icon}
          className={buttonClassName}
          onClick={() => {
            setEditMode(editModeValue)
            setShow(true)
          }}
        />
        {show && <ProductForm {...dialogProps} />}
      </div>
    )
  }

  const CreateButton = ({ initialValues }) => {
    return FormButton({ 
      initialValues, 
      icon: "pi pi-plus",
      buttonClassName: "p-button-rounded",
      editModeValue: 'create'
    })
  }

  const UpdateButton = ({ initialValues }) => {
    return FormButton({ 
      initialValues, 
      icon: "pi pi-pencil",
      buttonClassName: "p-button-rounded p-button-outlined",
      editModeValue: 'update'
    })
  }

  return (
    <div style={{paddingInline: "6rem" }}>
      <h1>Products</h1>
      <TabMenu 
        model={tabModel} 
        activeIndex={activeIndex}
        onTabChange={e => setActiveIndex(e.index)}  
      />
      <DataTable 
        value={tableData}
        scrollable
        scrollHeight="50rem"
        responsiveLayout="scroll"
      >
        <Column frozen
          header={() => CreateButton({ initialValues: schema.default() })} 
          body={rowData => UpdateButton({ initialValues: rowData })} 
          style={{flex: "0 0 4.5rem"}}
          headerStyle={{height: "5.1rem"}}
        />
        <Column 
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
          frozen
          style={{width: "14rem"}}
        />        
        {columnsByCategory[activeCategory]}
      </DataTable>
    </div>
  )
  

}





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

const getBestMatchScore = (queries, item, onFields) => {
  const distances = onFields.map(f => 
    min(queries.map(query => 
      levenshteinDistance(
        item[f].replace(/\s/g, '').toLowerCase(), 
        query
      )
    ))
  )
  return min(distances)
}

const rankedSearch = ({ query, data, onFields, nResults=10 }) => {
  if (!query) return data

  // const q = query.toLowerCase().replace(/\s/g, '')
  const queries = query.replace(/\s/g, '').toLowerCase().split(',').filter(q => !!q)

  let substrMatches = data.filter(item => 
    onFields.some(field => 
      queries.some(q => 
        item[field].replace(/\s/g, '').toLowerCase().includes(q)
      )
    )
  )

  return substrMatches.length
    ? sortBy(item => getBestMatchScore(queries, item, onFields))(substrMatches).slice(0, nResults)
    : sortBy(item => getBestMatchScore(queries, item, onFields))(data).slice(0, nResults)

}