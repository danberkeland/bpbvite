import React, { useEffect, useMemo, useState } from "react"

import { SelectButton } from "primereact/selectbutton"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"


import { getWeekday, getWorkingDate } from "../../../../functions/dateAndTime"
import dynamicSort from "../../../../functions/dynamicSort"
import { useStandingByLocation } from "../../../../data/standingData"
import { Dropdown } from "primereact/dropdown"
import { InputNumber } from "primereact/inputnumber"



const standOptions = [
  {label: "Standing", value: true},
  {label: "Holding", value: false}
]
const wholeOptions = [
  {label: "Wholesale", value: true},
  {label: "Retail", value: false}
]
const viewOptions = [
  {label: 'By Day', value: 'DAY'},
  {label: 'By Product', value: 'PRODUCT'}
]
const weekdayOptions = [
  {label: "Sunday", value: "Sun"},
  {label: "Monday", value: "Mon"},
  {label: "Tuesday", value: "Tue"},
  {label: "Wednesday", value: "Wed"},
  {label: "Thursday", value: "Thu"},
  {label: "Friday", value: "Fri"},
  {label: "Saturday", value: "Sat"},
]

export const StandingOrder = ({ user, locNick }) => {
  // standing::admin state
  const [isStand, setIsStand] = useState(true)
  const [isWhole, setIsWhole] = useState(true)
  
  // standing::public state
  const [viewMode, setViewMode] = useState('DAY')
  const [dayOfWeek, setDayOfWeek] = useState(getWeekday(new Date(getWorkingDate('NOW'))))
  const [prodNick, setProdNick] = useState(null)
  const [product, setProduct] = useState(null)
  
  const { data:standingData } = useStandingByLocation(locNick, !!locNick)
  // const [standingChanges, setStandingChanges] = useState(null)
  
  //const productOptions = makeProductOptions(standingChanges, isStand, isWhole)

  const [standingBase, setStandingBase] = useState(null)
  const [standingChanges, setStandingChanges] = useState(null)


  const makeProductOptions = () => {
    if (!standingChanges) return []
    
    return standingChanges
      .filter(item => item.isStand === isStand && item.isWhole === isWhole)
      .reduce((acc, curr) => {
        let matchIndex = acc.findIndex(item =>
          item.prodNick === curr.product.prodNick
        )
        if (matchIndex === -1) {
          acc.push(curr.product)
        }
        return acc
      }, [])
      .sort(dynamicSort('prodName'))
      
  }
  const productOptions = useMemo(makeProductOptions, [standingChanges, isStand, isWhole])

  useEffect(() => {
    if (!!standingData) {
      const baseItems = makeStandingBase(standingData, locNick)

      setStandingBase(JSON.parse(JSON.stringify(baseItems)))
      setStandingChanges(JSON.parse(JSON.stringify(baseItems)))
    }
  }, [standingData, locNick])

  const tableData = makeTableData(standingChanges, viewMode, dayOfWeek, product, isStand, isWhole)

  //console.log(tableData)
  return(
    <div>
      {user.authClass === 'bpbfull' &&
        <div style={{display: "flex", justifyContent:"space-between"}}>
          <div style={{padding: ".5rem"}}>
            <SelectButton 
              value={isStand} 
              onChange={(e) => {if (e.value !== null) setIsStand(e.value)}} 
              options={standOptions}
            />
          </div>
          <div style={{padding: ".5rem"}}>
            <SelectButton 
              value={isWhole} 
              onChange={(e) => {if (e.value !== null) setIsWhole(e.value)}} 
              options={wholeOptions}
            />
          </div>
        </div>
      }

      <div style={{margin: ".5rem"}}>
        <SelectButton
          value={viewMode}
          onChange={e => {
            if (e.value !== null) setViewMode(e.value)
            if (prodNick === null && e.value === 'PRODUCT' && productOptions.length) {
              setProdNick(productOptions[0].prodNick)
              setProduct(productOptions[0])
            }
          }}
          options={viewOptions}
        />
      </div>

      <div style={{padding: ".5rem"}}>
        {viewMode === 'DAY' &&
          <Dropdown 
            options={weekdayOptions}
            value={dayOfWeek}
            onChange={e => setDayOfWeek(e.value)}
          />
        }
        {viewMode === 'PRODUCT' &&
          <Dropdown
            options={productOptions}
            optionLabel="prodName"
            optionValue="prodNick"
            value={prodNick}
            onChange={(e) => {
              setProdNick(e.value)
              setProduct(productOptions.find(i => i.prodNick === e.value))
            }}
          />
        }
      </div>

      <div style={{margin: ".5rem"}}>
        <DataTable 
          value={tableData}
          responsiveLayout
          showGridlines
        >
          <Column header={viewMode === 'DAY' ? "Product" : "Weekday"}
            field={viewMode === 'DAY' 
              ? "product.prodName" 
              : "dayOfWeek"}
            />
          <Column header="Qty" 
            style={{width: "80px"}}
            field="qty" 
            body={rowData => {
              return(
                <div className="p-fluid">
                  <InputNumber
                    value={rowData.qty}
                    min={0}
                    max={999}
                    onChange={e => {    
                      const matchIndex = standingChanges.findIndex(i =>
                        i.product.prodNick === rowData.product.prodNick
                        && i.dayOfWeek === rowData.dayOfWeek  
                        && i.isWhole === rowData.isWhole
                        && i.isStand === rowData.isStand                   
                      )
                      if (matchIndex > -1) {
                        let _update = [...standingChanges]
                        let _updateItem = {
                          ..._update[matchIndex],
                          qty: e.value
                        }
                        _update[matchIndex] =_updateItem
                        setStandingChanges(_update)
                        console.log(_updateItem)
                      } else {
                        console.log("error: standing data could not be updated.")
                      }
                    }}
                  />
                </div>
              )
            }}  
          />

        </DataTable>
      </div>

      <pre>{JSON.stringify(isStand)}</pre>
      <pre>{JSON.stringify(isWhole)}</pre>
      <pre>{JSON.stringify(viewMode)}</pre>
      <pre>{JSON.stringify(dayOfWeek)}</pre>
      {/* <pre>{JSON.stringify(productOptions, null, 2)}</pre> */}

    </div>
  )

}


// const makeProductOptions = (standingChanges, isStand, isWhole) => {
//   if (!standingChanges) return []

//   return standingChanges
//     .filter(item => item.isStand === isStand && item.isWhole === isWhole)
//       .reduce((acc, curr) => {
//         let matchIndex = acc.findIndex(item =>
//           item.prodNick === curr.product.prodNick
//         )
//         if (matchIndex === -1) {
//           acc.push(curr.product)
//         }
//         return acc
//     }, [])
//     .sort(dynamicSort('prodName'))

// }

const makeTableData = (standingChanges, viewMode, dayOfWeek, product, isStand, isWhole) => {
  if (!standingChanges || (viewMode === 'PRODUCT' && !product)) return []
  
  let tableData = standingChanges
    .filter(item => item.isStand === isStand && item.isWhole === isWhole)

  if (viewMode === 'DAY') {
    tableData = tableData
      .filter(item => item.dayOfWeek === dayOfWeek)
  }

  else if (viewMode === 'PRODUCT') {
    tableData = tableData
      .filter(item => item.product.prodNick === product.prodNick)
  }

  return tableData
}

/** 
 * Fills in missing cells of the standing grid(s) and 
 * sorts data by prodName and by weekday.
 * 
 * We're now front-loading the data processing more,
 * leaving the more frequent update routines lighter.
 */
const makeStandingBase = (standingData, locNick) => {

  const categories = [
    { isStand: true, isWhole: true },
    { isStand: true, isWhole: false },
    { isStand: false, isWhole: true },
    { isStand: false, isWhole: false },
  ]
  const weekdays = weekdayOptions.map(i => i.value)

  let placeholders = []
  
  for (let cat of categories) {

    let catItems = standingData.filter(i => i.isStand === cat.isStand && i.isWhole === cat.isWhole)
    let catProducts = catItems.reduce((acc, curr) => {
      if (acc.findIndex(item => item.prodNick === curr.product.prodNick) === -1) {
        acc.push(curr.product)
      }
      return acc
    }, [])

    for (let p of catProducts) {
      for (let day of weekdays) {
        if (catItems.findIndex(i => i.product.prodNick === p.prodNick && i.dayOfWeek === day) === -1) {
          let newItem = {
            locNick: locNick,
            isStand: cat.isStand,
            isWhole: cat.isWhole,
            route: 'deliv',
            ItemNote: null,
            dayOfWeek: day,
            qty: 0,
            startDate: null, // assign value on submit
            updatedBy: null, // assign value on submit
            product: {
              prodNick: p.prodNick,
              prodName: p.prodName
            }
          }
          placeholders.push(newItem)

        }
      }
    }
  }

  console.log("placeholders", placeholders)

  const baseItems = standingData.concat(placeholders)

  baseItems.sort((a, b) => {
    let _a = weekdayOptions.findIndex(i => i.value === a.dayOfWeek)
    let _b = weekdayOptions.findIndex(i => i.value === b.dayOfWeek)
    return _a - _b
  })

  baseItems.sort((a, b) => {
    if (a.product.prodName < b.product.prodName) return -1
    if (a.product.prodName > b.product.prodName) return 1
    return 0
  })

  console.log("baseItems", baseItems)

  return baseItems

}
