import React, { useState, useEffect, useMemo } from "react";
import { useRouteListFull, useZoneRouteListFull } from "../../data/routeData";
import * as yup from "yup"
import { useZoneListFull } from "../../data/zoneData";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber"
import { Checkbox } from "primereact/checkbox";
import { MultiSelect } from "primereact/multiselect"
import { Dropdown } from "primereact/dropdown";
import { isEqual } from "lodash";
import { useLocationListFull } from "../../data/locationData";
import { useProductListFull } from "../../data/productData";




export const Database = () => {
  const [tableName, setTableName] = useState()
  const [tableBase, setTableBase] = useState()
  const [tableData, setTableData] = useState()
  const [schema, setSchema] = useState()
  const description = schema?.describe() ?? null
  const groups = description?.meta.groups ?? []
  const [selectedGroup, setSelectedGroup] = useState()
  const fields = selectedGroup 
    ? Object.keys( description.fields ).filter(f => {
        const field = description.fields[f]
        console.log(field)
        return field.meta.group === selectedGroup && !("isPK" in field.meta)
      })
    : []
  const pkField = selectedGroup 
    ? Object.keys( description.fields ).filter(f => {
        const field = description.fields[f]
        console.log(field)
        return "isPK" in field.meta
      })
    : []

  // ********
  // * DATA *
  // ********

  const { data:locationData } = useLocationListFull(tableName === 'location')
  const { data:zoneData } = useZoneListFull(tableName === 'location') // for schema validaiton
  
  const { data:productData } = useProductListFull(tableName === 'product')

  const { data:routes } = useRouteListFull(tableName === 'route')
  const { data:zoneRoutes } = useZoneRouteListFull({ shouldFetch: tableName === 'route' })
  const joinData = () => {
    if (!routes || !zoneRoutes) return []
    const routeData = routes.map(route => {
      const _zr = zoneRoutes.filter(zr => zr.routeNick === route.routeNick)
        .map(zr => zr.zoneNick)

      return ({ ...route, zoneRoutes: _zr })
    })
      
    return routeData
  }
  const routeData = useMemo(joinData, [routes, zoneRoutes])

  // ***********
  // * SCHEMAS *
  // ***********

  useEffect(() => {
    if (tableName === 'location' && locationData && zoneData) {
      setTableBase([...locationData])
      setTableData([...locationData])
      setSchema(getLocationSchema(zoneData.map(z => z.zoneNick)))
    }
  }, [tableName, locationData, zoneData])
  
  // const tableOptions = {
  //   location: locationData,
  //   product: productData,
  //   route: routeData
  // }
  console.log("schema", description)
  return (<div style={{margin: "1rem"}}>
    
    <Dropdown placeholder="Select a Table"
      options={dropdownOptions}
      onChange={e => setTableName(e.value)}
    />

    {tableData && schema && 
      <div style={{margin: "1rem"}}>
        <Dropdown options={groups} value={selectedGroup} onChange={e => setSelectedGroup(e.value)} />
        {!!fields &&
        <DataTable value={tableData}
          size="small"
          //paginator rows={10}
          editMode="row"
        >
          <Column rowEditor />
          <Column field={pkField} header={pkField} />
          {fields.map((field, cIdx) => <Column key={`col-${cIdx}`} 
            header={field} 
            body={rowData => <span>{JSON.stringify(rowData[field])}</span>} 
            sortable 
          />)}

        </DataTable>
        }
      </div>
    } 
  </div>) // end return
}

const dropdownOptions = [
  { label: "Location", value: "location" },
  { label: "Product", value: "product" },
  { label: "Route", value: "route" },
]


// ***Schema constructors***
// schemas may use existing data as part of validation
// For example, foreign keys need to be 'oneOf' some value
// list that needs to be fetched and cannot be hardcoded here.

const getLocationSchema = (zoneNicks) => {
  
  const nameMeta = { group: "Name" }
  const nameSchema = yup.object({
    locNick: yup.string().meta({ ...nameMeta, isPK: true }), // primary key
    locName: yup.string().required().meta(nameMeta),
    isActive: yup.boolean().meta(nameMeta)
  })

  const contactMeta = { group: "Contact"}
  const contactSchema = yup.object({
    phone: yup.string().meta(contactMeta),
    email: yup.string().email().meta(contactMeta),
    firstName: yup.string().meta(contactMeta),
    lastName: yup.string().meta(contactMeta),
  })
  
  const addressMeta = { group : "Address" }
  const addressSchema = yup.object({
    addr1: yup.string().meta(addressMeta),
    addr2: yup.string().meta(addressMeta),
    city: yup.string().meta(addressMeta),
    zip: yup.string().meta(addressMeta),
    webpageURL: yup.string().meta(addressMeta),
    gMap: yup.string().meta(addressMeta)
  })

  const deliveryMeta = { group : "Delivery" }
  const deliverySchema = yup.object({
    zoneNick: yup.string().oneOf(zoneNicks).meta(deliveryMeta),
    latestFirstDeliv: yup.number().lessThan(24).meta(deliveryMeta),
    latestFinalDeliv: yup.number().lessThan(24).meta(deliveryMeta),
    delivOrder: yup.number().integer().meta(deliveryMeta),
    specialInstructions: yup.string().meta(deliveryMeta),
    orderCnfEmail: yup.string().email().meta(deliveryMeta),
    
  })

  const billingMeta = { group: "Billing" }
  const billingSchema = yup.object({
    qbID: yup.string().meta(billingMeta),
    toBePrinted: yup.boolean().meta(billingMeta),
    toBeEmailed: yup.boolean().meta(billingMeta),
    printDuplicate: yup.boolean().meta(billingMeta),
    terms: yup.string().oneOf(["0", "15", "30"]).meta(billingMeta),
    invoicing: yup.string().oneOf(["daily", "weekly"]).meta(billingMeta),
  })

  const hiddenSchema = yup.object({
    Type: yup.string().default("Location")
  })  

  const fullSchema = nameSchema
    .concat(contactSchema)
    .concat(addressSchema)
    .concat(deliverySchema)
    .concat(billingSchema)
    .meta({ groups: ["Name", "Contact", "Address", "Delivery", "Billing"] })

  return fullSchema
}



  //subs: [LocationUser] @hasMany(indexName: "byLoc", fields: ["locNick"])
  //standing: [Standing] @hasMany(indexName: "byLoc", fields: ["locNick"])
  //orders: [Order] @hasMany(indexName: "byLoc", fields: ["locNick"])
  //ordersByDate: [Order] @hasMany(indexName: "byLocationByDelivDate", fields: ["locNick"])
  // creditApp: CreditApp @hasOne

  // webpageURL: String
  // picURL: String
  // gMap: String
  // specialInstructions: String
  // delivOrder: Int
  // qbID: String
  // currentBalance: String
  // isActive: Boolean
  // ttl: Int
  // prodsNotAllowed: [ProdsNotAllowed]
  //   @hasMany(indexName: "byLoc", fields: ["locNick"])
  // customProd: [AltPricing] @hasMany(indexName: "byLoc", fields: ["locNick"])
  // templateProd: [TemplateProd]
  //   @hasMany(indexName: "byLoc", fields: ["locNick"])
  // altLeadTimeByProduct: [AltLeadTime] @hasMany(indexName: "byLocByProd", fields: ["locNick"])


// export const Database = () => {
//   // ********
//   // * Data *
//   // ********

//   const { data:routes } = useRouteListFull(true)
//   const { data:zoneRoutes } = useZoneRouteListFull({ shouldFetch: true })
//   const { data:zones } = useZoneListFull(true) // Source for table data -- see tableOptions
//   const { data:locations } = useLocationListFull(true)

//   const joinData = () => {
//     if (!zones || !zoneRoutes || !routes) return []
//     const routeData = routes.map(route => ({
//       ...route,
//       zoneRoutes: zoneRoutes.filter(zr => zr.routeNick === route.routeNick).map(zr => zr.zoneNick)
//     }))

//     return routeData
//   }
//   const routeData = useMemo(joinData, [zones, zoneRoutes]) // Source for table data -- see tableOptions

//   const [selectedOption, setSelectedOption] = useState()
//   const [schema, setSchema] = useState()

//   const [tableBase, setTableBase] = useState()
//   const [table, setTable] = useState()

//   const [znrtBase, setZnrtBase] = useState()
//   const [znrt, setZnrt] = useState()

//   useEffect(() => {
//     if (!!selectedOption) {
//       setSchema(schemaOptions[selectedOption])
//       const _table = [...tableOptions[selectedOption]].map((rowData, baseIdx) => ({
//         ...rowData, 
//         baseIdx: baseIdx, 
//         shouldDelete: false,
//         isCreating: false,
//         action: null
//       }))
//       setTableBase(JSON.parse(JSON.stringify(_table)))
//       setTable(JSON.parse(JSON.stringify(_table)))

//       // zoneNicks get joined to route data at first, but the following
//       // zoneRoute data sits "downstream" from table data.
//       // Updates to table data (specifically for the zoneRoutes field)
//       // are tracked with the following state variables so that we
//       // know what to submit to the ZoneRoute table via AppSync.
//       const _zoneRoutes = [...zoneRoutes].map(item => ({ ...item, action: null }))
//       setZnrtBase(JSON.parse(JSON.stringify(zoneRoutes)))
//       setZnrt(JSON.parse(JSON.stringify(zoneRoutes)))
//       console.log(schemaOptions[selectedOption].describe())
//     }
//   }, [selectedOption])


//   // **********
//   // * Schema *
//   // **********

//   const routeNicks = routes?.map(r => r.routeNick) ?? []
//   const zoneNicks = zones?.map(z => z.zoneNick) ?? []
//   const distributionHubs = ["Prado", "Carlton"]

//   const zoneRouteSchema = yup.object({
//     id: yup.string().meta({ PK:true }), // possible to make required only when updating?
//     routeNick: yup.string().required().oneOf(routeNicks),
//     zoneNick: yup.string().required().oneOf(zoneNicks),
//   }).meta({
//     tableName: "ZoneRoute"
//   })

//   const routeSchema = yup.object({
//     routeNick: yup.string().required()
//       .meta({ PK:true }),
//     routeName: yup.string().required(),
//     routeStart: yup.number().min(0).lessThan(24),
//     routeTime: yup.number().min(0).lessThan(10),
//     RouteDepart: yup.string().oneOf(distributionHubs),
//     RouteArrive: yup.string().oneOf(distributionHubs),
//     RouteSched: yup.array().of(yup.string()
//       .oneOf(["1", "2", "3", "4", "5", "6", "7"]))
//       .meta({ editor: "routeSched" }),
//     printOrder: yup.number().integer(),
//     driver: yup.string().nullable(),
//     zoneRoutes: yup.array().of(yup.string().oneOf(zoneNicks))
//       .meta({ editor: "zoneRoutes"})
//   }).meta({
//     tableName: "Route"
//   })

//   const zoneSchema = yup.object({
//     zoneNick: yup.string().required().meta({ PK:true }),
//     zoneName: yup.string().required(),
//     description: yup.string().nullable(),
//     zoneFee: yup.number().integer()
//   }).meta({
//     tableName: "Zone"
//   })

//   const schemaOptions ={
//     route: routeSchema,
//     //zoneRoute: zoneRouteSchema,
//     zone: zoneSchema,
//   }

//   const tableOptions = { 
//     route: routeData, 
//     //zoneRoute: zoneRoutes, 
//     zone: zones 
//   }

//   // ******************
//   // * Editors/inputs *
//   // ******************

//   const textEditor = (options) => {
//     return <InputText type="text" 
//       value={options.value} 
//       onChange={(e) => options.editorCallback(e.target.value)}
//       style={{width: "10rem"}} 
//     />
//   }

//   const numberEditor = (options) => {
//     return <InputNumber 
//       value={options.value} 
//       onValueChange={(e) => options.editorCallback(e.value)}
//       inputStyle={{width: "6rem"}}
//     />
//   }

//   const dropdownPicker = (options, attDescription) => {
//     // const attName = options.field
//     // const dropdownList = schema.describe().fields[attName].oneOf
//     const dropdownList = attDescription.oneOf
    
//     return <Dropdown 
//       value={options.value}
//       options={dropdownList}
//       onChange={e => options.editorCallback(e.value)}
//     />
//   } 

//   const zoneRoutePicker = (options, attDescription) => {
//     // const attName = options.field
//     // const dropdownList = schema.describe().fields[attName]
//     //   .innerType.fields.zoneNick.oneOf
//     const dropdownList = attDescription.innerType.oneOf

//     return <MultiSelect 
//       value={options.value}
//       options={dropdownList}
//       onChange={e => options.editorCallback(e.value)}
//       // display="chip"
//       filter
//     />
//   }

//   const weekdayMap = {
//     "1": "Sun",
//     "2": "Mon",
//     "3": "Tue",
//     "4": "Wed",
//     "5": "Thu",
//     "6": "Fri",
//     "7": "Sat",
//   }

//   const routeScheditor = (options) => {
//     const boolValues = Object.keys(weekdayMap).map(dayNum => {
//       return options.value.includes(dayNum)
//     })

//     return (<div style={{display: "flex", gap: ".5rem", width: "15rem"}}>
//       {Object.keys(weekdayMap).map((dayNum, cIdx) => <span>
//         <span>{weekdayMap[dayNum]}</span>
//         <Checkbox 
//           value={boolValues[cIdx]}
//           checked={boolValues[cIdx]}
//           onChange={(e) => {
//             let newBoolValues = [...boolValues]
//             newBoolValues[cIdx] = !newBoolValues[cIdx]

//             const newArray = Object.keys(weekdayMap).map((dayNum, idx) => {
//               return newBoolValues[idx] ? dayNum : null
//             }).filter(item => item !== null)

//             options.editorCallback(newArray)
//           }} 
//         />
//       </span>)
//       }
//     </div>)
//   } // end routeScheditor

//   const onRowEditComplete = (e) => {
//     // Update main Table
//     let _table = [...table];
//     let { newData, index } = e;

//     _table[index] = newData;

//     setTable(_table);

//     // Update zoneRoutes
//     const _znrtBase = znrtBase.filter(znrt => znrt.routeNick === newData.routeNick)

//     const zonesCreated = newData.zoneRoutes.filter(zoneNick => 
//       _znrtBase.findIndex(znrt => znrt.zoneNick === zoneNick) === -1
//     )

//     const zonesDeleted = _znrtBase.filter(znrt => 
//       newData.zoneRoutes.findIndex(zoneRoute => zoneRoute === znrt.zoneNick) === -1
//     ).map(znrt => znrt.zoneNick)

//     const _znrt = znrt.map(znrt => znrt.routeNick === newData.routeNick
//       && zonesDeleted.includes(znrt.zoneNick)
//         ? { ...znrt, action: "D" }
//         : { ...znrt, action: null }
//     ).concat(zonesCreated.map(zoneNick => ({
//       routeNick: newData.routeNick,
//       zoneNick,
//       action: "C"
//     })))

//     setZnrt(_znrt)

//     console.log("zonesCreated", zonesCreated)
//     console.log("zonesDeleted", zonesDeleted)
//   };

//   const getEditor = (editorKey, attDescription) => {
//     const editorOptions = {
//       string: (options) => textEditor(options),
//       number: (options) => numberEditor(options),
//       routeSched: (options) => routeScheditor(options),
//       oneOf: (options) => dropdownPicker(options, attDescription),
//       zoneRoutes: (options) => zoneRoutePicker(options, attDescription)
//     }

//     return editorOptions[editorKey]
//   }

//   // ******************
//   // * MAIN COMPONENT *
//   // ******************

//   if (!routes || !zones || !zoneRoutes) return <div>loading...</div>
//   return(
//     <div className="bpb-page-container" style={{padding: "3rem 3rem 15rem 3rem"}}>
//       <div
//         style={{
//           marginBlock: "3rem"
//         }}
//       >
//         <Dropdown 
//           options={[
//             {label: "Zone", value:"zone"},
//             {label: "Route", value:"route"},
//             //{label: "ZoneRoute", value:"zoneRoute"}, 
//           ]}
//           value={selectedOption}
//           onChange={e => setSelectedOption(e.value)}
//         />
//       </div>

//       {selectedOption && schema && table && <>
//         <h1>{schema.describe().meta.tableName}</h1>
//         <DataTable 
//           dataKey="baseIdx"
//           value={table}
//           editMode="row"
//           rowEditValidator={rowData => {
//             //const {baseIdx, shouldDelete, isCreating, action, ...testProps } = rowData
//             try {
//               schema.validateSync(rowData)
//               return true
//             } catch (error) {
//               alert(error)
//             }

//           }}
//           onRowEditComplete={onRowEditComplete}  
//           paginator rows={10}
//           size="small"
//         >
//           <Column 
//             rowEditor 
//             body={(rowData, props) => {
//               const rowEditor = props.rowEditor;
//               const baseRow = tableBase.find(item => item.baseIdx === rowData.baseIdx)
//               const rowChanged = !isEqual(rowData, baseRow)
              
//               if (rowEditor.editing) { 
//                 return (<>
//                   <button type="button" className={rowEditor.saveClassName}
//                     onClick={e => {
//                       // TODO: update separate zoneRoute entries (not part of table data)
//                       const { zoneNick, zoneRoutes } = rowData
//                       console.log(zoneRoutes)
//                       rowEditor.onSaveClick(e)
//                       console.log(e)
//                     }}
//                   >
//                     <span className={rowEditor.saveIconClassName}></span>
//                   </button>
//                   <button type="button" className={rowEditor.cancelClassName}
//                     onClick={rowEditor.onCancelClick} 
//                   >
//                     <span className={rowEditor.cancelIconClassName}></span>
//                   </button>
//                 </>)
//               }
//               else {
//                 return (<>
//                   {/* Delete Row Button*/}
//                   <button type="button" className={rowEditor.initClassName}
//                     style={{backgroundColor: rowData.shouldDelete ? "red" : ""}}
//                     onClick={() => {
//                       const _table = table.map(item => item.baseIdx === rowData.baseIdx 
//                         ? {...item, shouldDelete: !rowData.shouldDelete } : 
//                         item
//                       )
//                       setTable(_table)
//                     }}
//                   >
//                     <span className='p-row-editor-init-icon pi pi-fw pi-trash p-clickable' 
//                       style={{color: rowData.shouldDelete ? "white" : ""}}
//                     />
//                   </button>

//                   {/* Undo-Changes Button */}
//                   <button type="button" className={rowEditor.initClassName}
//                     onClick={() => {
//                       const { baseIdx } = rowData

//                       const _table = table.map(item => item.baseIdx === baseIdx ? {...tableBase[baseIdx]} : item)
//                       setTable(_table)
//                     }} 
//                   >
//                       <span className='p-row-editor-init-icon pi pi-fw pi-replay p-clickable' />
//                   </button>

//                   {/* Edit Row Button */}
//                   <button type="button" className={rowEditor.initClassName}
//                     disabled={rowData.shouldDelete} 
//                     onClick={rowEditor.onInitClick} 
//                     style={{backgroundColor: rowData.shouldDelete ? "" : (rowChanged ? "green" : "")}}
//                   >
//                     <span className='p-row-editor-init-icon pi pi-fw pi-pencil p-clickable' 
//                       style={{color: rowData.shouldDelete ? "darkgray" : (rowChanged ? "white" : "")}}
//                     />
//                   </button>
//                 </>)
//               } // end else
//             }} // end body
//             headerStyle={{ width: '8rem' }} 
//             bodyStyle={{ textAlign: 'center' }} 
            
//           />
//           {/* <Column header="Idx" field="baseIdx"></Column> */}

//           {Object.keys(schema.describe().fields ?? {}).map((attributeName, idx) => {
//             const attDescription = schema.describe().fields[attributeName]
//             const { meta, oneOf, type } = attDescription
            
//             let editorType = meta?.editor 
//               || (oneOf.length ? "oneOf" : null)
//               || type
            
//             let editor = getEditor(editorType, attDescription) || null
//             if (meta?.PK) editor = null

//             return <Column key={idx} 
//               header={attributeName} 
//               field={attributeName}
//               body={rowData => {
//                 const baseRow = tableBase.find(item => item.baseIdx === rowData.baseIdx)
//                 const cellValue = rowData[attributeName]
//                 const baseValue = baseRow ? baseRow[attributeName] : undefined
//                 const cellChanged = !isEqual(cellValue, baseValue)
//                 const style={
//                   fontWeight: cellChanged ? "bold" : "normal",
//                   color: rowData.shouldDelete ? "darkgray" : ""
//                 }

//                 return <div style={style}>{JSON.stringify(cellValue)}</div>

//               }} 
//               sortable={type !== 'array'}
//               editor={editor}              
//             />
//           })}
//         </DataTable>
//       </>}

//     </div>
//   )

// }



