import React, { useEffect, useMemo, useState } from "react"

import { Button } from "primereact/button"
import { SelectButton } from "primereact/selectbutton"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Sidebar } from "primereact/sidebar"
import { Dropdown } from "primereact/dropdown"
//import { InputNumber } from "primereact/inputnumber"
import { ListBox } from "primereact/listbox"

import { createStanding, deleteStanding, updateStanding, useStandingByLocation } from "../../../../data/standingData"
import { createOrder, fetchTransitionOrders, useOrdersByLocationByDateV2 } from "../../../../data/orderData"
import { useLocationDetails } from "../../../../data/locationData"
import { useProductDataWithLocationCustomization } from "../../../../data/productData"

//import { mutate } from "swr"


import dynamicSort from "../../../../functions/dynamicSort"
import { getTransitionDates, getTtl, getWeekday, getWorkingDate, getWorkingDateJS, getWorkingDateTime } from "../../../../functions/dateAndTime"
import { DateTime } from "luxon"
// import { listOrdersByLocationByDate } from "../../../../customGraphQL/queries/orderQueries"
import { APIGatewayFetcher } from "../../../../data/_fetchers"
import { InputText } from "primereact/inputtext"
import { useSettingsStore } from "../../../../Contexts/SettingsZustand"
import { useRouteListFull } from "../../../../data/routeData"
import { testProductAvailability } from "../_utils/testProductAvailability"
import { IconInfoMessage } from "../_components/IconInfoMessage"
import { reformatProdName } from "../_utils/reformatProdName"
import { wrapText } from "../_utils/wrapText"
import { toggleFav } from "../_utils/toggleFavorite"
import { getDuplicates } from "../../../../functions/detectDuplicates"

const standOptions = [
  {label: "Standing", value: true},
  {label: "Holding", value: false}
]
const wholeOptions = [
  {label: "Wholesale", value: true},
  {label: "Retail", value: false, disabled: true}
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

const routeSchedToWeekdayMap = {
  '1': 'Sun',
  '2': 'Mon',
  '3': 'Tue',
  '4': 'Wed',
  '5': 'Thu',
  '6': 'Fri',
  '7': 'Sat'
}

export const StandingOrder = ({ user, locNick }) => {
  const isLoading = useSettingsStore((state) => state.isLoading)
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  // standing::admin state
  const [isStand, setIsStand] = useState(true)
  const [isWhole, setIsWhole] = useState(true)
  
  // standing::public state
  const [viewMode, setViewMode] = useState('DAY')
  const [dayOfWeek, setDayOfWeek] = useState(getWeekday(getWorkingDateJS('NOW')))

  const { data:productData } = useProductDataWithLocationCustomization(locNick)
  const [product, setProduct] = useState(null)
  //const [showTableDetails, setShowTableDetails] = useState(false)
  const [showAddItem, setShowAddItem] = useState(false)
  
  const { data:locationDetails, mutate:mutateLocation, locationIsValidating } = useLocationDetails(locNick, !!locNick)
  const { data:routeData } = useRouteListFull(true)
  const { data:standingData, mutate:mutateStanding } = useStandingByLocation(locNick, !!locNick)
  const { mutate:mutateCart } = useOrdersByLocationByDateV2(locNick, null, true)

  const availableRouteScheds = (!!locationDetails && !!routeData) 
    ? locationDetails.zone.zoneRoute.items.map(zr => zr.routeNick)
      .map(routeNick => routeData.find(r => r.routeNick === routeNick).RouteSched)
    : []
  const fulfillmentAvailabilityDays = [...new Set(availableRouteScheds.flat())]
    .map(dayNumString => routeSchedToWeekdayMap[dayNumString])

  // console.log("fulfillmentDays:", fulfillmentAvailabilityDays)
  // console.log(locationDetails?.zone.zoneRoute.items || [])
  // console.log(availableRouteScheds)
  // console.log(routeData)

  const [standingBase, setStandingBase] = useState(null)
  const [standingChanges, setStandingChanges] = useState(null)

  const effectDateParts = getWorkingDateTime('NOW').plus({days: 4}).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY).split(',')
  const effectDate = `${effectDateParts[0]}, ${effectDateParts[1]}`

  // console.log(standingBase)
  // console.log(standingChanges)

  const isMobile = useIsMobile()

  useEffect(() => {
    if (!!standingData && !!productData) {
      // check incoming data for duplicates
      const dupes = getDuplicates(standingData, ['product.prodNick', 'dayOfWeek', 'isStand', 'isWhole'])
      if (dupes.length) {
        console.log("Warning: duplicate items found:", dupes)
        if (user.authClass === "bpbfull") {alert("Duplicate standing orders found (see console logs)")}
        // Then handle duplicates by deciding which to keep and deleting the rest...
        // Then revalidate standing data.
      }

      const baseItems = makeStandingBase(standingData, productData, locNick)

      setStandingBase(JSON.parse(JSON.stringify(baseItems)))
      setStandingChanges(JSON.parse(JSON.stringify(baseItems)))
      //console.log(baseItems)
    }
  }, [standingData, productData, locNick, user.authClass])

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

  const tableData = makeTableData(standingChanges, viewMode, dayOfWeek, product, isStand, isWhole, isMobile)
  //console.log(tableData)
  return(
    <div style={{maxWidth: "50rem", margin: "auto"}}>
      {/* <h1 style={{padding: ".5rem"}}>Standing Order</h1> */}
      {user.authClass === 'bpbfull' &&
        <div style={{margin: ".5rem", padding: ".5rem", border: "1px solid", borderRadius: "3px", backgroundColor: "#ffc466", borderColor: "hsl(37, 67%, 60%)"}}>
          <h2>Admin Settings</h2>
          <div style={{display: "flex", gap: "2rem"}}>
            <div style={{padding: ".5rem", flex: "50%"}}>
              <ListBox 
                options={standOptions}
                value={isStand}
                onChange={e => {if (e.value !== null) setIsStand(e.value)}}
              />
            </div>
            <div style={{padding: ".5rem", flex: "50%"}}>
              <ListBox 
                options={wholeOptions}
                value={isWhole}
                onChange={e => {if (e.value !== null) setIsWhole(e.value)}}
              />
            </div>
          </div>
        </div>
      }

      {isMobile && 
      <>
      <div style={{padding: ".5rem"}}>
        <SelectButton
          value={viewMode}
          onChange={e => {
            if (e.value !== null) setViewMode(e.value)
            if (product === null && e.value === 'PRODUCT' && productOptions.length) {
              // setProdNick(productOptions[0].prodNick)
              setProduct(productOptions[0])
            }
          }}
          options={viewOptions}
        />
      </div>

      <div style={{padding: ".5rem"}}>
        {viewMode === 'DAY' &&
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <div className="p-fluid" style={{flex: "0 0 9rem"}}>
              <Dropdown 
                options={weekdayOptions}
                value={dayOfWeek}
                onChange={e => setDayOfWeek(e.value)}
              />
            </div>
            <div style={{display: "flex", flex: "100%", justifyContent: "right", gap: "2rem"}}>
              <div style={{flex: "0 0 4rem"}}>
                <Button icon="pi pi-chevron-left"
                  style={{width: "4rem"}}
                  onClick={() => {
                    let matchIdx = weekdayOptions.findIndex(item =>
                      item.value === dayOfWeek
                    )
                    setDayOfWeek(weekdayOptions[(matchIdx - 1 + 7) % 7].value)
                  }}
                />
              </div>
              <div style={{flex: "0 0 4rem"}}>
                <Button icon="pi pi-chevron-right"
                  style={{width: "4rem"}}
                  onClick={() => {
                    let matchIdx = weekdayOptions.findIndex(item =>
                      item.value === dayOfWeek
                    )
                    setDayOfWeek(weekdayOptions[(matchIdx + 1) % 7].value)
                  }}
                />
              </div>
            </div>
          </div>
        }
        {viewMode === 'PRODUCT' &&
          <div className="p-fluid">
            <Dropdown
              options={productOptions}
              optionLabel="prodName"
              optionValue="prodNick"
              value={product?.prodNick}
              onChange={(e) => {
                // setProdNick(e.value)
                setProduct(productOptions.find(i => i.prodNick === e.value))
              }}
            />
          </div>
        }
      </div>

      <div style={{margin: ".5rem"}} className="bpb-datatable-rounded-header bpb-datatable-rounded-last-row">
        <DataTable 
          value={tableData}
          responsiveLayout
        >
          <Column 
            header={viewMode === 'DAY' ? "Product" : "Weekday"}
            // header={() => {
            //   return (
            //     <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            //       <span onClick={() => {console.log(standingChanges)}}>{viewMode === 'DAY' ? "Product" : "Weekday"}</span> 
            //       <Button 
            //         icon={showTableDetails ? "pi pi-search-minus" : "pi pi-search-plus"}
            //         className="p-button-rounded p-button-text" 
            //         onClick={() => setShowTableDetails(!showTableDetails)}
            //       />
            //     </div>
  
            //   )
            // }}
            // headerClassName="header-split-content"
            field={viewMode === 'DAY' 
              ? "product.prodName" 
              : "dayOfWeek"}
            body={rowData => {
              const baseItem = standingBase.find(i =>
                i.product.prodNick === rowData.product.prodNick
                && i.dayOfWeek === rowData.dayOfWeek  
                && i.isWhole === rowData.isWhole
                && i.isStand === rowData.isStand
              )
              const qtyChanged = baseItem ? (baseItem.qty !== rowData.qty) : (rowData.qty > 0)
              const displayText = viewMode === 'DAY' ? reformatProdName(rowData.product.prodName, rowData.product.packSize) : rowData.dayOfWeek
              const style = {fontWeight: "bold", fontStyle: qtyChanged ? "italic" : "normal"}
              
              return (
                <>
                  <div style={style}>{displayText}</div>
                  {testProductAvailability(rowData.product.prodNick, rowData.dayOfWeek) === false &&
                    <IconInfoMessage text={`Product not available`} iconClass="pi pi-times" />
                  }
                  {fulfillmentAvailabilityDays.includes(rowData.dayOfWeek) === false &&
                    <IconInfoMessage text={`Delivery not available`} iconClass="pi pi-times" />
                  }
                </>
              )
            }}
            />
          <Column 
            header={() => <Button label="Add" onClick={() => setShowAddItem(true)} style={{width: "62px"}}/>}
            style={{width: "80px"}}
            field="qty" 
            body={rowData => {
              const disableInput = !(testProductAvailability(rowData.product.prodNick, rowData.dayOfWeek)) 
                || !fulfillmentAvailabilityDays.includes(rowData.dayOfWeek) 
              
                return(
                <div className="p-fluid">
                  <CustomInputNumber 
                    rowData={rowData}
                    qtyAtt="qty"
                    dayOfWeek={rowData.dayOfWeek}
                    standingBase={standingBase}
                    standingChanges={standingChanges}
                    setStandingChanges={setStandingChanges}
                    disabled={disableInput}
                  />
                  {/* {showTableDetails &&
                    <>
                      <div style={{paddingTop: ".5rem", fontSize:".9rem"}}>{`$${rowData.rate.toFixed(2)}/${rowData.product.packSize > 1 ? "pk" :"ea"}.`}</div>
                      <div style={{paddingTop: ".5rem", fontSize:".9rem"}}>Subtotal:</div>
                      <div style={{fontSize:".9rem"}}>{`$${(rowData.rate * rowData.qty).toFixed(2)}`}</div>
                    </>
                  } */}
                </div>
              )
            }}  
          />
        </DataTable>
      </div>
      </>
      }
      {!isMobile && 
      <DataTable
        style={{padding: ".5rem"}}
        className="bpb-datatable-rounded-header bpb-datatable-rounded-last-row"
        value={tableData}
        responsiveLayout
        showGridlines
      >
        <Column 
          headerStyle={{maxWidth: "15rem"}}
          headerClassName="header-split-content"
          header={(rowData) => {
            return (
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <span>Product</span>
                <Button style={{width: "62px"}} label="Add" onClick={() => setShowAddItem(true)}/>
              </div>
            )
          }}
          body={rowData => {
            return(<div style={{fontWeight: "bold"}}>{reformatProdName(rowData.product.prodName, rowData.product.packSize)}</div>)
          }}
        />
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(weekday => {
          return(
            <Column
              key={weekday}
              header={weekday}
              //field={weekday}
              body={rowData => {

                const disableInput = !(testProductAvailability(rowData.product.prodNick, weekday)) 
                || !fulfillmentAvailabilityDays.includes(weekday) 

                return(
                  <div className="p-fluid" style={{width: "45px"}}>
                    <CustomInputNumber 
                      rowData={rowData}
                      qtyAtt={weekday}
                      dayOfWeek={weekday}
                      standingBase={standingBase}
                      standingChanges={standingChanges}
                      setStandingChanges={setStandingChanges}
                      disabled={disableInput}
                    />
                  </div>
                )
              }}  
            />
          )  
        })}

      </DataTable>
      }

      <div style={{padding: ".5rem"}}>
        <Button label="Submit Changes" 
          className="p-button-lg" 
          onClick={() => handleSubmit(locNick, isWhole, isStand, standingBase, standingChanges, mutateStanding, mutateCart, user.name, locationDetails, productData, setIsLoading, true, true)}
        />

        <div style={{color: "hsl(37, 100%, 5%)", margin: ".5rem"}}>Changes will not take effect until <b>{effectDate}</b>. Orders can still be edited from the Cart Order screen in the meantime.</div>
      </div>

      {user.authClass === 'bpbfull' && 
        <div style={{
          padding: "3rem",
          maxWidth: "20rem"
        }}>
          <Button label="Submit Changes (New system only, No placeholders)" 
            className="p-button-lg" 
            style={{
              backgroundColor: "#282a39",
              color: "hsl(37, 100%, 70%)"
            }}
            onClick={() => handleSubmit(
              locNick, 
              isWhole, 
              isStand, 
              standingBase, 
              standingChanges, 
              mutateStanding, 
              mutateCart, 
              user.name, 
              locationDetails, 
              productData, 
              setIsLoading, 
              false, 
              false
            )}
          />
          <div style={{color: "hsl(37, 100%, 5%)", margin: ".5rem"}}>
            For fixing out-of-sync Standing Orders.
          </div>
        </div>
      }

      <AddItemSidebar
        showAddItem={showAddItem}
        setShowAddItem={setShowAddItem}
        locNick={locNick}
        standingChanges={standingChanges}
        setStandingChanges={setStandingChanges}
        productData={productData}
        setProduct={setProduct}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isStand={isStand}
        isWhole={isWhole}
        user={user}
        mutateLocation={mutateLocation}
        locationIsValidating={locationIsValidating}
      />


      {/* <pre>{JSON.stringify(isStand)}</pre> */}
      {/* <pre>{JSON.stringify(isWhole)}</pre> */}
      {/* <pre>{JSON.stringify(viewMode)}</pre> */}
      {/* <pre>{JSON.stringify(dayOfWeek)}</pre> */}
      {/* <pre>{JSON.stringify(productOptions, null, 2)}</pre> */}

    </div>
  )

}


/**
 * Transforms standingChanges for DataTable presentation.
 * 
 * Filters down to the selected isStand/isWhole category.
 * 
 * For 'PRODUCT' and 'DAY' view, data is just filtered to the
 * applicable product or weekday, respectively.
 */
const makeTableData = (standingChanges, viewMode, dayOfWeek, product, isStand, isWhole, isMobile) => {
  if (!standingChanges) return []
  
  let _standingChanges = standingChanges
    .filter(item => item.isStand === isStand && item.isWhole === isWhole)
  let tableData

  if (isMobile) {
    if (viewMode === 'PRODUCT' && !product) return []

    if (viewMode === 'DAY') {
      tableData = _standingChanges
        .filter(item => item.dayOfWeek === dayOfWeek)
    }

    else if (viewMode === 'PRODUCT') {
      tableData = _standingChanges
        .filter(item => item.product.prodNick === product.prodNick)
    }
  } else {
    let products = [...new Set(_standingChanges.map(i => i.product.prodNick))]
    let productGroups = products
      .map(pn => _standingChanges.filter(i => i.product.prodNick === pn))

    tableData = productGroups.map(grp => ({
      product: grp[0].product,
      isStand: isStand,
      isWhole: isWhole,
      Sun: grp.find(i => i.dayOfWeek === "Sun").qty,
      Mon: grp.find(i => i.dayOfWeek === "Mon").qty,
      Tue: grp.find(i => i.dayOfWeek === "Tue").qty,
      Wed: grp.find(i => i.dayOfWeek === "Wed").qty,
      Thu: grp.find(i => i.dayOfWeek === "Thu").qty,
      Fri: grp.find(i => i.dayOfWeek === "Fri").qty,
      Sat: grp.find(i => i.dayOfWeek === "Sat").qty
    }))
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
const makeStandingBase = (standingData, productData, locNick) => {

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
      // productData has location-specific overrides applied to prices/leadtime.
      // Use values from productData if possible; fall-back to default values fetched
      // with standing data otherwise. There's probably a better place to apply overrides
      // than here...
      let pLoc = productData.find(item => item.prodNick === p.prodNick)

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
              prodName: p.prodName,
              retailPrice: pLoc ? pLoc.retailPrice : p.retailPrice,
              wholePrice: pLoc ? pLoc.wholePrice : p.wholePrice,
              leadTime: pLoc ? pLoc.leadTime : p.leadTime
            }
          }
          placeholders.push(newItem)

        }
      }
    }
  }

  //console.log("placeholders", placeholders)
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

  //console.log("baseItems", baseItems)

  return baseItems

}

const AddItemSidebar = ({showAddItem, setShowAddItem, locNick, standingChanges, setStandingChanges, productData, setProduct, viewMode, setViewMode, isStand, isWhole, user, mutateLocation, locationIsValidating}) => {
  const [selectedProdNick, setSelectedProdNick] = useState(null)

  const handleAddItem = () => {
    let inCart = standingChanges.findIndex(i => i.product.prodNick === selectedProdNick) > -1

    if (inCart) {
      //console.log("in Cart")
      setShowAddItem(false)
      setSelectedProdNick(null)
      return
    }

    const weekdays = weekdayOptions.map(i => i.value)
    const prod = productData.find(i => i.prodNick === selectedProdNick)

    const placeholders = weekdays.map(day => {
      let newItem = {
        locNick: locNick,
        isStand: isStand,
        isWhole: isWhole,
        route: 'deliv',
        ItemNote: null,
        dayOfWeek: day,
        qty: 0,
        startDate: null, // assign value on submit
        updatedBy: null, // assign value on submit
        product: {
          prodNick: prod.prodNick,
          prodName: prod.prodName,
          leadTime: prod.leadTime,
          retailPrice: prod.retailPrice,
          wholePrice: prod.wholePrice
        }
      }

      return newItem
    })

    console.log(placeholders)
    const newData = [...standingChanges].concat(placeholders)
    
    newData.sort((a, b) => {
        let _a = weekdayOptions.findIndex(i => i.value === a.dayOfWeek)
        let _b = weekdayOptions.findIndex(i => i.value === b.dayOfWeek)
        return _a - _b
      })
    newData.sort((a, b) => {
      if (a.product.prodName < b.product.prodName) return -1
      if (a.product.prodName > b.product.prodName) return 1
      return 0
      })

    setStandingChanges(newData)

    if (viewMode === 'PRODUCT') setProduct({
      prodNick: prod.prodNick,
      prodName: prod.prodName,
      leadTime: prod.leadTime,
      retailPrice: prod.retailPrice,
      wholePrice: prod.wholePrice
    })
    setSelectedProdNick(null)
    setShowAddItem(false)

  }

  const DropdownItemTemplate = (option) => {
    const prodNameDisplayText = wrapText(reformatProdName(option.prodName, option.packSize), 25).split('\n')
    const icon = !!option.templateProd ? "pi pi-star-fill" : "pi pi-star"

    return(
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{width: "fit-content"}}>
          {prodNameDisplayText.map((line, idx) => <div style={{fontWeight: !!option.templateProd ? "bold" : "normal"}} key={idx}>{line}</div>)}
        </div>
        <Button icon={icon}
          onClick={e => {
            e.preventDefault() 
            e.stopPropagation()
            //if (locNick === user.locNick) {
              console.log(locNick, option.prodNick, option.templateProd)
              toggleFav(locNick, option.prodNick, option.templateProd, mutateLocation)
              //setIsFav(() => !isFav)
           // }
            
          }} 
          className="p-button-text p-button-rounded"
          disabled={
            //locNick !== user.locNick || 
            locationIsValidating
          }
        />
      </div>
    )
  }

  const dropdownValueTemplate = (option, props) => {
    if (option) return(
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div>{reformatProdName(option.prodName, option.packSize) || ''}</div>{!!option.templateProd && <i className="pi pi-star-fill"/>}
      </div>
    )

    return <span>{props.placeholder}</span>;
  }

  return (
    <Sidebar
      //className="p-sidebar-lg"
      style={{height: "225px"}}
      visible={showAddItem}
      position="top"
      blockScroll={true}
      icons={() => <div>Add a product</div>}
      onHide={() => {
        setShowAddItem(false)
        setSelectedProdNick(null)
      }}
    >
      <span className="p-float-label p-fluid" style={{marginTop: "25px"}}>
        <Dropdown 
          id="productDropdown"
          value={selectedProdNick}
          options={productData || []}
          disabled={!productData}
          onChange={e => setSelectedProdNick(e.value)}
          optionLabel="prodName"
          optionValue="prodNick"
          itemTemplate={DropdownItemTemplate}
          valueTemplate={dropdownValueTemplate}
          filter 
          showClear 
          filterBy={`prodName${user.locNick === 'backporch' ? ",prodNick" : ""}`}
          placeholder={productData ? "Select Product" : "Loading..."}
          scrollHeight="350px"
          //itemTemplate={dropdownItemTemplate}
        />
        <label htmlFor="productDropdown">{productData ? "Select Product" : "Loading..."}</label>
      </span>

      <Button label="Add Item"
        style={{flex: "35%", marginTop: "28px"}}
        onClick={handleAddItem}
        disabled={!productData || !selectedProdNick}
      />
    </Sidebar>

  )

}


// filter base/change items to category
// detect which action is to be taken,
// associate these directives with each submisison candidate

const handleSubmit = async (
  locNick, 
  isWhole, 
  isStand, 
  standingBase, 
  standingChanges, 
  mutateStanding, 
  mutateCart, 
  userName, 
  locationDetails, 
  productData, 
  setIsLoading, 
  shouldSubmitPlaceholders, 
  shouldSubmitLegacy
) => {
  setIsLoading(true)
  // Submission only handles the current category 
  // of standing order (according to isStand, isWhole values).
  const baseItems = standingBase.filter(item => (item.isWhole === isWhole && item.isStand === isStand))
  const submissionCandidates = standingChanges.filter(item => (item.isWhole === isWhole && item.isStand === isStand))

  // Submit items are standing items that have a change requiring
  // some database action ('CREATE', 'UPDATE', or 'DELETE'/'DELETE_NO_OVERRIDE')
  const submitItems = getSubmitItems(baseItems, submissionCandidates, userName)
  
  if (!submitItems.length) {
    setIsLoading(false)
    return
  }

  // *******************************
  // * DETERMINE CART PLACEHOLDERS *
  // *******************************

  // For standing/wholesale and standing/retail order items
  // being submitted, we may need to create "placeholder"
  // cart items during the transition period (T+0 to T+3)
  // to preserve the state of those orders.  
  //
  // If the existing cart orders have custom header values 
  // (i.e. route or ItemNote), we want to use those values 
  // for the placeholder items, or fall back to defaults.

  const _cartOrders = shouldSubmitPlaceholders ? await fetchTransitionOrders(locNick) : []
  const cartOrders = shouldSubmitPlaceholders ? _cartOrders.filter(item => item.isWhole === isWhole) : []
  const cartHeaders = shouldSubmitPlaceholders ? getCartHeaders(cartOrders, locationDetails) : {}

  // console.log(transitionDates)
  // console.log("cart headers", cartHeaders)

  let placeholderCandidates = submitItems.filter(item =>
    item.isStand === true
    && (item.action === 'CREATE' || item.action === 'UPDATE' || item.action === 'DELETE')
  )

  let cartPlaceHolderItems = []

  if (shouldSubmitPlaceholders) {
    for (let header of cartHeaders) {

      let placeholderCandidatesByDate = placeholderCandidates.filter(item =>
        item.dayOfWeek === header.dayOfWeek
      )

      for (let subItem of placeholderCandidatesByDate) {
        let cartMatchItem = cartOrders.find(cartItem =>
          cartItem.prodNick === subItem.product.prodNick
          && cartItem.delivDate === header.delivDateISO  
        )

        if (!cartMatchItem) {
          let standingBaseItem = baseItems.find(b => 
            b.product.prodNick === subItem.product.prodNick
            && b.dayOfWeek === subItem.dayOfWeek  
          )
          let placeholderQty = subItem.action === 'CREATE' ? 0 : standingBaseItem.qty

          let placeholderItem = {
            locNick: locNick,
            isWhole: subItem.isWhole,
            route: header.route,
            delivDate: header.delivDateISO,
            prodNick: subItem.product.prodNick,
            qty: placeholderQty,
            qtyUpdatedOn: new Date().toISOString(),
            sameDayMaxQty: placeholderQty,
            rate: subItem.isWhole ? subItem.product.wholePrice : subItem.product.retailPrice,
            ItemNote: header.ItemNote,
            isLate: 0,
            updatedBy: 'standing_order',
            ttl: header.ttl
          }

          cartPlaceHolderItems.push(placeholderItem)
        }
      }
    }
  }
  // **************************************
  // * SUBMIT CART PLACEHOLDERS TO LEGACY *
  // **************************************

  if (shouldSubmitPlaceholders && shouldSubmitLegacy) {
    console.log("Cart placeholders:", cartPlaceHolderItems)
    
    const legacyCartSubmitBody = cartHeaders.map(header => {
      const dateParts = header.delivDateISO.split('-')
      const mmddyyyyDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`

      const headerByDate = {
        isWhole: isWhole,
        custName: locationDetails.locName,
        delivDate: mmddyyyyDate,
        route: header.route,
        PONote: header.ItemNote,
      }
      const itemsByDate = cartPlaceHolderItems.filter(item => 
        item.delivDate === header.delivDateISO
      ).map(item => ({
        prodName: productData.find(p => p.prodNick === item.prodNick).prodName,
        qty: item.qty,
        rate: item.rate
      }))

      return ({
        header: headerByDate,
        items: itemsByDate
      })

    }).filter(order => order.items.length > 0)

    console.log("Submitting cart placeholders to legacy system:", legacyCartSubmitBody)
    let legacyCartResponse
    if (legacyCartSubmitBody.length) {
      legacyCartResponse = await APIGatewayFetcher('/orders/submitLegacyCart', {body: legacyCartSubmitBody})
      console.log("Legacy cart response:", legacyCartResponse)
    }
  }

  // *****************************
  // * SUBMIT STANDING TO LEGACY *
  // *****************************
  
  // The new system attempts to handle more features by handling
  // different categories of standing order simultaneously.
  // To prevent unexpected behavior in the old system we will only
  // make changes to the legacy system when submitting 
  // standing/wholesale type orders

  // Although code execution gets terminated earlier if there are
  // no submitItems, we will take this chance to assert the full
  // standing order from the new system onto the old system, 

  if (shouldSubmitLegacy) {
    console.log("Submit for new system: ", submitItems)

    let legacyStandingResponse
    if (isStand === true && isWhole === true) {
      const legacyStandingSubmitBody = getLegacyStandingSubmitBody(submitItems, locationDetails, productData, submissionCandidates, isStand)
      console.log("Submit for legacy system:", legacyStandingSubmitBody)

      legacyStandingResponse = await APIGatewayFetcher('/orders/submitLegacyStanding', {body: legacyStandingSubmitBody})
      console.log("Legacy standing response:", legacyStandingResponse)
    }
  }

  // ***********************
  // * SUBMIT PLACEHOLDERS *
  // ***********************

  if (shouldSubmitPlaceholders) {
    for (let placeholder of cartPlaceHolderItems) {
      console.log("creating cart placeholder:")
      createOrder(placeholder)
    }
  }
  
  // ***************************
  // * SUBMIT STANDING CHANGES *
  // ***************************

  for (let subItem of submitItems) {
    let { action, ...item } = subItem
    //console.log(action, item)
    if (action === "CREATE") {
      const { product, ..._createItem} = item
      const createItem = {
        ..._createItem,
        prodNick: product.prodNick
      }
      await createStanding(createItem)

    }
    if (action === "UPDATE") {
      const updateItem = {
        id: subItem.id,
        qty: subItem.qty,
        startDate: subItem.startDate,
        updatedBy: subItem.updatedBy
      }
      await updateStanding(updateItem)
    }
    if (action === "DELETE" || action === "DELETE_NO_OVERRIDE") {
      const deleteItem = {
        id: subItem.id
      }
      await deleteStanding(deleteItem)
    }
  }

  // revailidate SWR data

  if (cartPlaceHolderItems.length) {
    // for (let header of cartHeaders) {
    //   let variables = {
    //     locNick: locNick,
    //     delivDate: header.delivDateISO
    //   }
    //   //let key = [listOrdersByLocationByDate, variables]
    //   // mutate(key, undefined, {revalidate: true})
    // }
    mutateCart()
  }

  console.log("start mutate")
  mutateStanding()
  console.log("finished mutate")
  setIsLoading(false)

}

/**
 * Checks all submission items and returns those that require
 * a database action. The action type is attached to each item
 * under the 'action' attribute. Also fills in startDate and
 * updatedBy values to prep items for submission.
 */
const getSubmitItems = (baseItems, submissionCandidates, userName) => {
  for (let subItem of submissionCandidates) {
    let baseItem = baseItems.find(b => 
      b.product.prodNick === subItem.product.prodNick 
      && b.dayOfWeek === subItem.dayOfWeek
    )
  
    let action = decideAction(baseItem, subItem)
    subItem.action = action
  }
  
  const submitItems = submissionCandidates
    .filter(item => item.action !== 'NONE')
    .map(item => ({
      ...item,
      startDate: getWorkingDateTime('NOW').plus({ days: 4}).toISODate(),
      updatedBy: userName
    }))

  return submitItems

}

/**
 * Compares submission item values to its original values
 * from the database (if the database entry exists).
 * Returns a string indicating whether a database action
 * is required, and if so indicates which kind.
 */
const decideAction = (baseItem, subItem) => {
  let action = 'NONE'

  if (subItem.hasOwnProperty('id')) {
    if (subItem.qty === 0 && baseItem.qty === 0) action = 'DELETE_NO_OVERRIDE' // mostly for catching 0 qty items from remap
    else if (subItem.qty === 0) action = 'DELETE'
    else if (subItem.qty !== baseItem.qty) action = 'UPDATE'
  } else {
    if (subItem.qty > 0) action = 'CREATE'
  }

  return action
}

/**
 * Returns an array of cart header objects, each representing
 * the header for a different transition date (T+0 to T+3). 
 */
const getCartHeaders = (cartOrders, locationDetails) => {
  const transitionDates = getTransitionDates('UTCString')
  //console.log(locationDetails)
  console.log("reading cart orders for transition dates: ", cartOrders)
  const defaultRoute = (locationDetails.zoneNick === 'atownpick' || locationDetails.zoneNick === 'slopick')
    ? locationDetails.zoneNick
    : 'deliv'

  // array of header-value objects for each transition delivery date.
  // if cart order doesn't exist for a given date, fall back to default values
  const cartHeaders = transitionDates.map(utcDate => {
    let header = {
      delivDateISO: utcDate.split('T')[0],
      dayOfWeek: getWeekday(new Date(utcDate)),
      ttl: getTtl(new Date(utcDate)),
      route: defaultRoute,
      ItemNote: ''
    }

    let ordersByDate = cartOrders.filter(order => 
      order.delivDate === header.delivDateISO
    )
    if (ordersByDate.length) { 
      header.route = ordersByDate[0].route
      header.ItemNote = ordersByDate[0].ItemNote || ''
    }

    return header
  })

  return cartHeaders

}



const CustomInputNumber = ({ rowData, qtyAtt, dayOfWeek, standingBase, standingChanges, setStandingChanges, disabled }) => {
  const [rollbackQty, setRollbackQty] = useState()

  const baseItem = standingBase.find(i =>
    i.product.prodNick === rowData.product.prodNick
    && i.dayOfWeek === dayOfWeek  
    && i.isWhole === rowData.isWhole
    && i.isStand === rowData.isStand
  )

  const qtyChanged = (baseItem && baseItem.qty !== rowData[qtyAtt]) || (!baseItem && rowData[qtyAtt] > 0)
  
  const matchIndex = standingChanges.findIndex(i =>
    i.product.prodNick === rowData.product.prodNick
    && i.dayOfWeek === dayOfWeek  
    && i.isWhole === rowData.isWhole
    && i.isStand === rowData.isStand
  )
  
  const updateQty = (value) => {    
    let newQty = Number(value) >= 999 ? 999 : (value === '' ? value : Number(value))

    //console.log(e, e.value, typeof(e.value), newQty)
    if (matchIndex > -1) {
      let _update = [...standingChanges]
      let _updateItem = {
        ..._update[matchIndex],
        qty: newQty
      }
      _update[matchIndex] = _updateItem
      setStandingChanges(_update)
    } else {
      console.log("error: standing data could not be updated.")
    }
  }

  return (
    <InputText
      value={rowData[qtyAtt]}
      inputMode="numeric"
      keyfilter={/[0-9]/}
      style={{
        fontWeight : qtyChanged ? "bold" : "normal",
        color: rowData[qtyAtt] === 0 ? "gray" : '',
        backgroundColor: qtyChanged ? 'hsl(37, 67%, 95%)' :'',
      }}
      disabled={disabled}
      tooltip={rowData.product.packSize > 1 ? `${rowData[qtyAtt] || 0} pk = ${(rowData[qtyAtt] || 0) * rowData.product.packSize} ea` : ''}
      tooltipOptions={{ event: 'focus', position: 'left' }}
      onClick={() => console.log(rowData)}
      onFocus={e => {
        e.target.select()
        setRollbackQty(rowData[qtyAtt])
      }}
      // onKeyDown={e => console.log(e)}
      onChange={e => {updateQty(e.target.value)}}
      onKeyDown={(e) => {
        console.log(e)
        if (e.key === "Enter") { 
          e.target.blur();
          if (e.target.value === "") updateQty(0);
        }

        if (e.key === "Escape") {
          if (e.target.value === "") {
            e.target.blur()
            let resetQty = baseItem.qty || 0
            updateQty(resetQty);
            setRollbackQty(resetQty)
          } else {
            e.target.blur()
            updateQty(rollbackQty);
          }
        }
      }}
      onBlur={() => {
        if (rowData[qtyAtt] === '') {
          updateQty(0)
        }
      }}
    />
  )

}


//need to add itemChanges to arguments so that we can copy that info into qties.
const getLegacyStandingSubmitBody = (submitItems, locationDetails, productData, submissionCandidates, isStand) => {
  
  const prodNicks = [...new Set(submitItems.map(i => i.product.prodNick))]

  const standingHeader = {
    custName: locationDetails.locName,
    isStand: isStand
  }
  
  const standingItems = prodNicks.map(pn => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const qtys = Object.fromEntries(
      weekdays.map(day => 
        [
          day, 
          submissionCandidates.find(item => 
            item.product.prodNick === pn && item.dayOfWeek === day
          )?.qty || 0
        ]
      )
    )

    return ({
      prodName: (productData.find(item => item.prodNick === pn)).prodName,
      ...qtys
    })
  })
  
  return ({
    header: standingHeader,
    items: standingItems
  })
}


// legacy standing item shape

// id: auto uuid
// __typename: str = "Standing"
// custName: str
// isStand: boolean
// prodName: str
// Sun: int
// Mon: int
// Tue: int
// Wed: int
// Thu: int
// Fri: int 
// Sat: int
// timeStamp: AWSDateTime
// createdAt: AWSDateTime
// updatedAt: AWSDateTime


const getIsMobile = () => window.innerWidth <= 768;
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(getIsMobile());

    useEffect(() => {
        const onResize = () => {
            setIsMobile(getIsMobile());
        }

        window.addEventListener("resize", onResize);
    
        return () => {
            window.removeEventListener("resize", onResize);
        }
    }, []);
    
    return isMobile;
}



