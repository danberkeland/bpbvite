import React, { useEffect, useMemo, useState } from "react"
import { useListData } from "../../../../data/_listData"
import { LocationSelector } from "./LocationSelector"
import { ProductSelector } from "./ProductSelector"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"
import { InputNumber } from "primereact/inputnumber"
import { Checkbox } from "primereact/checkbox"
import { InputSwitch } from "primereact/inputswitch"

import { sortBy } from "lodash"
// import { useLegacyOverrideData } from "./data/legacyOverrideData"
// import { useOverrideSyncData } from "./data/dataSyncing"

const overrideAttributes = 
  ['defaultInclude', 'leadTime', 'readyTime', 'daysAvailable', 'wholePrice']

const LocationProductOverrides = () => {

  const shouldFetch = true
  const { data:LOC=[] } = useListData({ tableName: "Location", shouldFetch })
  const { data:PRD=[] } = useListData({ tableName: "Product", shouldFetch })

  const locationList = useMemo(() => sortBy(LOC, 'locName'), [LOC])
  const productList = useMemo(() => sortBy(PRD, 'prodName'), [PRD])

  const [locNick, setLocNick] = useState(null)
  const [prodNick, setProdNick] = useState(null)


  



  const { 
    data:overrides,
    submitMutations,
    updateLocalData,
  } = useListData({ tableName: "LocationProductOverride", shouldFetch })

  // if (!!overrides) console.log("OVERRIDES:", overrides)

  // const { data:legacyOverrides=[] } = useLegacyOverrideData() 
  // const { data:syncData } = useOverrideSyncData()




  const [tableData, setTableData] = useState([])
  const [editingRow, setEditingRow] = useState(null)
  const [editingIdx, setEditingIdx] = useState(null)
  const isEditing = editingIdx !== null

  
  const location = !!editingRow?.locNick ? LOC.find(L => L.locNick === editingRow.locNick) : {}
  const product = !!editingRow?.prodNick ? PRD.find(P => P.prodNick === editingRow.prodNick) : {}
  
  // console.log(editingRow)
  // console.log(location)
  // console.log(product)
  useEffect(() => {
    const newRow = {
      locNick: null,
      prodNick: null,
      defaultInclude: null,
      leadTime: null,
      readyTime: null,
      daysAvailable: null,
      wholePrice: null
    }

    const baseData = !!locNick || !!prodNick
      ? sortBy(
          (overrides ?? []).filter(item => 
            (!locNick || item.locNick === locNick)
            && (!prodNick || item.prodNick === prodNick)
          ),
          ['locNick', 'prodNick']
        ).concat([newRow])
      : []

    setTableData(baseData)

  }, [locNick, prodNick, overrides])

  // console.log("table data", tableData)


  // const onRowEditComplete = (e) => {
  //   console.log(e)
  //   let _tableData = [...tableData]
  //   let { newData, index } = e

  //   _tableData[index] = newData

  //   setTableData(_tableData)
  // }

  return (
    <div style={{ margin: "auto", padding: "2rem 5rem 5rem 5rem"}}>
      <h1>Product Overrides</h1>

      <div style={{ marginBlock: "1rem"}}>
        <label htmlFor="location-selector" style={{display: "block"}}>By Location</label>  
        <LocationSelector locNick={locNick} 
          onChange={e => {
            setLocNick(e.value)
            if (!!e.value) setProdNick(null)
            setEditingIdx(null)
            setEditingRow(null)
          }} 
        />
      </div>
      
      <div style={{ marginBlock: "1rem"}}>
        <label htmlFor="product-selector" style={{display: "block"}}>By Product</label>  
        <ProductSelector 
          prodNick={prodNick} 
          onChange={e => {
            setProdNick(e.value)
            if (!!e.value) setLocNick(null)
            setEditingIdx(null)
            setEditingRow(null)
          }} 
        />
      </div>

      <DataTable 
        value={tableData}
        responsiveLayout="scroll"
        scrollable
        scrollHeight="40rem"
      >
        <Column 
          style={{flex: "0 0 8rem"}}
          body={(rowData, options) => {
            const { rowIndex } = options

            return editingIdx === rowIndex 
              ? <>
                  <Button 
                    icon="pi pi-times"
                    className="p-button-rounded p-button-outlined" 
                    onClick={() => {
                      setEditingIdx(null)
                      setEditingRow(null)
                    }}
                    style={{marginRight: "1rem"}}
                  />
                  <Button 
                    icon={!editingRow.id || overrideAttributes.some(att => editingRow[att] !== null)
                      ? "pi pi-send"
                      : "pi pi-trash"
                    }
                    className="p-button-rounded" 
                    onClick={async () => {
                      const { id, createdAt, updatedAt, ...submitData } = editingRow

                      const createInputs = !id && overrideAttributes.some(att => submitData[att] !== null) 
                        ? [submitData] 
                        : []
                      const deleteInputs = 
                        overrideAttributes.every(att => submitData[att] === null) 
                          ? [{ id }] 
                          : []
                      const updateInputs 
                        = !!id && overrideAttributes.some(att => submitData[att] !== null) 
                          ? [{ id, ...submitData }] 
                          : []

                      // let newData = [...tableData]
                      // newData[editingIdx] = editingRow
                      // setTableData(newData)
                      setEditingIdx(null)
                      setEditingRow(null)
                      
                      const gqlResponse = await submitMutations({ createInputs, updateInputs, deleteInputs })
                      console.log(gqlResponse)
                      updateLocalData(gqlResponse)
                    }}
                    disabled={!editingRow.prodNick 
                      || !editingRow.locNick
                      || overrideAttributes.every(att => editingRow[att] === rowData[att])
                    }
                  />
                </>
              : !!rowData.id 
                ? <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-outlined" 
                    onClick={() => {
                      setEditingIdx(rowIndex)
                      setEditingRow({...tableData[rowIndex]})
                    }}
                    disabled={isEditing}
                  />
                : <Button 
                    icon="pi pi-plus" 
                    className="p-button-rounded" 
                    onClick={() => {
                      setEditingIdx(rowIndex)
                      setEditingRow({
                        ...tableData[rowIndex],
                        locNick,
                        prodNick,
                      })
                    }}
                    disabled={isEditing}
                  />
                
          }} 
        />
        <Column header="location"
          style={{flex: "0 0 14rem"}}
          body={(row, opts) => opts.rowIndex === editingIdx
            ? locNick === null && row.locNick === null
              ? locNickInput({ 
                  data: editingRow, 
                  setData: setEditingRow,
                  locations: locationList,
                  overrideList: overrides ?? []
                })
              : locNick || row.locNick
            : row.locNick
          }      
        />
        <Column header="product"
          style={{flex: "0 0 10rem"}}
          body={(row, opts) => opts.rowIndex === editingIdx
            ? prodNick === null && row.prodNick === null
              ? prodNickInput({ 
                  data: editingRow, 
                  setData: setEditingRow,
                  products: productList,
                  overrideList: overrides ?? []
                })
              : prodNick || row.prodNick
            : row.prodNick
          }      
        />
        <Column header="Allowed?"
          body={(row, opts) => opts.rowIndex === editingIdx 
            ? defaultIncludeInput({ 
                data: editingRow, 
                setData: setEditingRow,
                defaultValue: product.defaultInclude
              })
            : JSON.stringify(row.defaultInclude ?? undefined)}
        />
        <Column header="leadTime" 
          style={{flex: "0 0 6.5rem"}}
          body={(row, opts) => opts.rowIndex === editingIdx 
            ? intInput({
                value: editingRow.leadTime,
                onChange: e => setEditingRow({ ...editingRow, leadTime: e.value }),
                max: 9,
                disabled: !editingRow.locNick || !editingRow.prodNick
              })
            : JSON.stringify(row.leadTime ?? undefined)}
        />
        <Column header="readyTime" 
          style={{flex: "0 0 6.5rem"}}
          body={(row, opts) => opts.rowIndex === editingIdx 
            ? floatInput({
                value: editingRow.readyTime,
                onChange: e => setEditingRow({ ...editingRow, readyTime: e.value }),
                max: 23.99,
                disabled: !editingRow.locNick || !editingRow.prodNick
              })
            : JSON.stringify(row.readyTime ?? undefined)
          }
        />
        <Column header="daysAvailable" 
          style={{flex: "1 0 12rem"}}
          body={(row, opts) => opts.rowIndex === editingIdx 
            ? daysAvailableInput({
                data: editingRow, 
                setData: setEditingRow,
                defaultValue: product.daysAvailable ?? [1, 1, 1, 1, 1, 1, 1]
              })
            : JSON.stringify(row.daysAvailable ?? undefined)
          }        
        />
        <Column header="wholePrice" 
          style={{flex: "0 0 6.5rem"}}
          body={(row, opts) => opts.rowIndex === editingIdx 
            ? floatInput({
              value: editingRow.wholePrice,
              onChange: e => setEditingRow({ ...editingRow, wholePrice: e.value }),
              max: 999.99,
              disabled: !editingRow.locNick || !editingRow.prodNick
            })
            : JSON.stringify(row.wholePrice ?? undefined)}
        />
      </DataTable>


      {/* <h2>Syncing</h2>

      <Button label="Create Items"
        onClick={async () => {
          console.log(syncData.createItems)
          updateLocalData(
            await submitMutations({ createInputs: syncData.createItems })
          ) 
        }}
      /> */}

    </div>
  )
}

export { LocationProductOverrides as default }


const locNickInput = ({ data, setData, locations, overrideList }) => {

  return <Dropdown 
    value={data.locNick}
    valueTemplate={option => option?.locNick ?? <span style={{opacity: ".8"}}>location</span>}
    options={locations}
    optionValue="locNick"
    optionLabel="locName"
    optionDisabled={option => 
      overrideList.some(item => 
        item.locNick === option.locNick 
        && item.prodNick === data.prodNick
      )
    }
    onChange={e => setData({ ...data, locNick: e.value })}
    style={{width: "12rem"}}
    filter
    showFilterClear
  />
}
const prodNickInput = ({ data, setData, products, overrideList }) => {

  return <Dropdown 
    value={data.prodNick}
    valueTemplate={option => option?.prodNick ?? <span style={{opacity: ".8"}}>product</span>}
    options={products}
    optionValue="prodNick"
    optionLabel="prodName"
    optionDisabled={option => 
      overrideList.some(item => 
        item.prodNick === option.prodNick 
        && item.locNick === data.locNick
      )
    }
    onChange={e => setData({ ...data, prodNick: e.value })}
    style={{width: "8rem"}}
    filter
    showFilterClear
  />
}




const defaultIncludeOptions = [
  { label: "auto", value: null },
  { label: "true", value: true },
  { label: "false", value: false },
]

const defaultIncludeInput = ({ data, setData }) => {  
  const value = data.defaultInclude
  const setValue = value => setData({ ...data, defaultInclude: value })

  return <Dropdown 
    placeholder={`auto`}
    value={value}
    options={defaultIncludeOptions}
    onChange={e => setValue(e.value)}
    disabled={!data.locNick || !data.prodNick}
  />
}

const intInput = ({ value, onChange, max, disabled }) => {

  return <InputNumber
    placeholder={"auto"} 
    value={value}
    min={0}
    max={max}
    onChange={onChange}
    inputStyle={{ width: "4.5rem" }}
    disabled={disabled}
  />
}

const floatInput = ({ value, onChange, max, disabled }) => {

  return <InputNumber 
    placeholder={"auto"} 
    value={value}
    min={0}
    max={max}
    maxFractionDigits={2}
    onChange={onChange}
    inputStyle={{ width: "4.5rem" }}
    disabled={disabled}
  />
}

const daysAvailableInput = ({ data, setData, defaultValue }) => {
  const value = data.daysAvailable
  const setValue = newValue => setData({ ...data, daysAvailable: newValue })

  return <>
    <InputSwitch 
      checked={value !== null}
      onChange={e => setValue(
        value === null ? defaultValue : null
      )}
      style={{marginRight: ".67rem"}}
      disabled={!data.locNick || !data.prodNick}
    />
    {value !== null
      ? <div style={{
          width: "15rem", 
          display: "flex", 
          justifyContent: "space-between",
          //backgroundColor: "var(--bpb-orange-vibrant-020)",
          //marginTop: ".25rem",
          paddingInline: ".5rem",
          //border: "solid 1px var(--bpb-surface-content-border)",
          //borderRadius: "4px",
        }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((W, idx) => <div>
            <span
              style={{
                display: "block",
                textAlign: "center",
                opacity: !!value?.[idx] ? '' : ".375",
                marginBottom: "-0.35rem"
              }}
            >
              {W}
            </span>
            <Checkbox 
              checked={!!value?.[idx]}
              onChange={() => {
                let newValue = [...value]
                newValue[idx] = !!value[idx] ? 0 : 1
                setValue(newValue)
              }}
            
            />
          </div>)}
        </div>
      : "auto"
    }

  </> 
  


}

// const daysAvailableInput = ({ value, onChange }) => {


//   return(
//     <div style={{
//       // width: "15rem", 
//       display: "flex", 
//       justifyContent: "space-between",
//       backgroundColor: "var(--bpb-orange-vibrant-020)",
//       marginTop: ".25rem",
//       padding: ".2rem .5rem",
//       border: "solid 1px var(--bpb-surface-content-border)",
//       borderRadius: "4px",
//     }}>
//       {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((W, idx) => {

//         return (
//           <div>
//             <label

//               style={{
//                 display: "block",
//                 textAlign: "center",
//                 opacity: !!value[idx] ? '' : ".375"
//               }}
//             >
//               {W}
//             </label>
//             <Checkbox 
//               inputId={`${field}-${idx}`}
//               name={field}
//               checked={!!value[idx]}
//               onChange={e => {
//                 formik.setFieldValue(
//                   field, 
//                   Object.assign([...value], { [idx]: e.checked ? 1 : 0 })
//                 ).then(() => formik.validateForm())
//               }}
//               disabled={disabled}
//             />
//           </div>
//         )
//       })}
//     </div>
//   )
// }
