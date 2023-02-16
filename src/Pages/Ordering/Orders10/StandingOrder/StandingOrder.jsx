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

  const [standingBase] = useState(null)
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
      const baseData = makeStandingBase(standingData, isStand, isWhole)


      setStandingChanges(JSON.parse(JSON.stringify(standingData)))
    }
  }, [standingData])

  const tableData = makeTableData(standingChanges, productOptions, viewMode, dayOfWeek, product, isStand, isWhole)
  console.log(tableData)
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
          <Column header="label" 
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
                        let newItem = {
                          ...rowData,
                          qty: e.value
                        }
                        setStandingChanges([...standingChanges].concat([newItem]))
                        console.log(newItem)
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

const makeTableData = (standingChanges, productOptions, viewMode, dayOfWeek, product, isStand, isWhole) => {
  if (!standingChanges || (viewMode === 'PRODUCT' && !product)) return []
  
  let tableData = standingChanges
    .filter(item => item.isStand === isStand && item.isWhole === isWhole)

  if (viewMode === 'DAY') {
    tableData = tableData
      .filter(item => item.dayOfWeek === dayOfWeek)

    // add placeholders for products
    for (let p of productOptions) {
      if (tableData.findIndex(i => i.product.prodNick === p.prodNick) === -1) {
        //let matchProduct = productOptions.find(i => i.prodNick === prodNick)
        tableData.push({
          dayOfWeek: dayOfWeek,
          product: {
            prodNick: p.prodNick,
            prodName: p.prodName
          },
          qty: 0,
          isWhole: isWhole,
          isStand: isStand
        })
      }
    }

    tableData.sort((a, b) => {
      if (a.product.prodName < b.product.prodName) return -1
      if (a.product.prodName > b.product.prodName) return 1
      return 0
    })

  }
  else if (viewMode === 'PRODUCT') {
    tableData = tableData
      .filter(item => item.product.prodNick === product.prodNick)
    console.log(tableData)
    // add placeholders for missing days
    for (let day of weekdayOptions) {
      if (tableData.findIndex(i => i.dayOfWeek === day.value) === -1) {
        //let matchProduct = productOptions.find(i => i.prodNick === prodNick)
        tableData.push({
          dayOfWeek: day.value,
          product: {
            prodNick: product.prodNick,
            prodName: product.prodName
          },
          qty: 0,
          isWhole: isWhole,
          isStand: isStand
        })
      }
    }

    tableData.sort((a, b) => {
      let _a = weekdayOptions.findIndex(i => i.value === a.dayOfWeek)
      let _b = weekdayOptions.findIndex(i => i.value === b.dayOfWeek)
      return _a - _b
    })
  }
  return tableData

}

// const cartesian =
//   (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))

// const makeStandingBase = (standingData, isStand, isWhole) => {
//   let tableData = standingData.filter(i => i.isStand === isStand && i.isWhole === isWhole)
  
//   const weekdays = weekdayOptions.map(i => i.value)
//   const products = [...new Set (tableData.map(i => i.product.prodNick))]

//   const placeholders = cartesian(weekdays, products).map(item => ({
//     dayOfWeek: item[0],
//     prodNick: item[1],
//     qty: 0
//   }))
//   console.log(placeholders)
  

// }


const makeStandingBase = (standingData, isStand, isWhole) => {
  // filter to category
  // fill in missing items with placeholders
  // placeholders should be 'ready to go' for submission;
  // supply attributes.
  const _standingData = standingData
    .filter(item => item.isStand === isStand && item.isWhole === isWhole)


  /*

  const weekdays = weekdayOptions.map(i => i.value)
  const products = [...new Set (tableData.map(i => i.product.prodNick))]

  //group filtered standing data by product
  const baseData = products.map(p => _standingData.filter(i => i.product.prodNick === p))

  for (let pGroup of baseData) {
    let days = [...new Set (pGroup.map(i => i.dayOfWeek))]

    



  }
  
  
*/

}
