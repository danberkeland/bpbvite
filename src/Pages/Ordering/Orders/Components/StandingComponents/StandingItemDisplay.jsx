import React, { useState, useEffect } from "react"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { cloneDeep, groupBy, set, sortBy, uniqBy } from "lodash"
import { Dropdown } from "primereact/dropdown"
import { Button } from "primereact/button"
import { StandingQtyInput } from "./StandingQtyInput"
import { InputLabel } from "../InputLabel"
import { reformatProdName } from "../../functions/reformatProdName"
import { InputText } from "primereact/inputtext"
import { StandingSubmitButton } from "./StandingSubmitButton"

const weekdayOptions = [
  { value: "Sun", label: "Sunday"},
  { value: "Mon", label: "Monday"},
  { value: "Tue", label: "Tuesday"},
  { value: "Wed", label: "Wednesday"},
  { value: "Thu", label: "Thursday"},
  { value: "Fri", label: "Friday"},
  { value: "Sat", label: "Saturday"},

]

const weekdayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const weekdayNumberMap = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

// The DataTable used for this component has unusual display requirements.
// In addition to displaying columns dynamically, we need to be able
// to transpose the table (flipping the role of row & column), which is a
// bit tricky using Objects instead of arrays.
//
// Moreover, we choose to keep DB items intact (as much as possible) under
// the display transformation, and want to be able look up a base record
// to detect changes.
//
// For all these reasons, we will not supply the datatable with the usual
// array of objects. Instead we will turn our data into a nested object
// with keys of the form <prodNick>#<dayOfWeek>. This gives a relatively
// clean, uniform way of accessing both the base/edited version of the same
// item. Our table will be supplied with row options and column options that
// each contain one part of this key (depending on whether the table
// is transposed or not). Each column body template will have access to 
// the appropriate prodNick/dayOfWeek value to look up the actual data item.
//
// In the compact format, qty column will be limited to the selected weekday
// (if viewmode is by weekday) or to the selected product (if viewmode is
// by product). We control displaying one or many columns by manipulating the 
// Column component's 'hidden' prop. 

export const StandingItemDisplay = ({
  user,
  standingData,                        // standingProps
  standingHeader, // setStandingHeader,
  standingItems, setStandingItems,
  standingView, setStandingView,
  delivDateDT,                         // dateProps
  ORDER_DATE_DT,
  wSize,
  location,
  products,
  setShowStandingSidebar,
  selectedProdNick,
  setSelectedProdNick,
}) => {

  //const [selectedProdNick, setSelectedProdNick] = useState()
  const [selectedDayOfWeek, setSelectedDayOfWeek] = 
    useState(ORDER_DATE_DT.toFormat('EEE'))

  const productOptions = sortBy(
    uniqBy(
      Object.values(standingItems), 
      item => item.prodNick
      ).map(item => { 
        const product = products?.[item.prodNick]
        const label = product
          ? reformatProdName(product.prodName, product.packSize)
          : item.prodNick
        return { label, value: item.prodNick }  
      }
    ),
    ['label']
  )


  useEffect(() => {
    if (!selectedProdNick && productOptions.length) {
      setSelectedProdNick(productOptions[0].value)

    }
  }, [standingItems, productOptions, selectedProdNick])


  // control transposing rows & columns 
  const [rowOptions, colOptions] = 
    !productOptions.length && wSize !== 'lg'
      ? [[], []]
      : wSize === 'lg' || standingView === 'byWeekday'
        ? [productOptions, weekdayOptions]
        : [weekdayOptions, productOptions]

  const compactSelectionProps = {
    standingView, setStandingView,
    selectedProdNick, setSelectedProdNick,
    selectedDayOfWeek, setSelectedDayOfWeek,
    productOptions,
    weekdayOptions,
  }

  const submitButtonProps = {
    standingData,
    standingHeader,
    standingItems,
    location,
    products,
    ORDER_DATE_DT,
    user,
  }

  const labelColumnHeaderTemplate = () => {
    return (
      <div onClick={() => {
        if (user.authClass === 'bpbfull') {
          console.log("Base data", standingData)
          console.log(standingHeader, standingItems)
        }
      }}>
        {
          wSize === 'lg' || standingView === 'byWeekday' 
            ? "Product" 
            : "Weekday"
        }
      </div>
    )
  }

  const qtyColumnHeaderTemplate = (cOpt) => {
    if (wSize === 'lg') return cOpt.value
    else return (
      <Button label="Add"
        style={{fontSize: "1.1rem", width: "62px"}}
        onClick={() => setShowStandingSidebar(true)}
      />
    )
  }

  const qtyColumnTemplate = (rOpt, cOpt) => {
    const [prodNick, dayOfWeek] = wSize === 'lg' || standingView === 'byWeekday'
      ? [rOpt.value, cOpt.value]
      : [cOpt.value, rOpt.value] 
    
    const weekdayNum = weekdayNumberMap[dayOfWeek]
    const key = `${prodNick}#${dayOfWeek}`
    const product = products?.[prodNick]
    const defaultInclude = product?.defaultInclude
    
    const routeOption = !!product
      ? product.meta.routeOptions[standingHeader.route][weekdayNum][0]
      : {}
    
    const shouldDisable = !routeOption.isValid
      || (!defaultInclude && user.authClass !== 'bpbfull')
  
    return (
      <div onClick={() => {
        if (user.authClass === 'bpbfull') {
          console.log(standingItems[key])
          console.log(routeOption)
          console.log("product", product)
          //console.log("defaultInclude", defaultInclude)
        }
      }}>
        <StandingQtyInput 
          item={standingItems[key]}
          baseItem={standingData?.items[key]}
          product={product}
          disabled={shouldDisable}
          updateStanding={(newQty) => {
            let _standingItems = cloneDeep(standingItems)
            _standingItems[key].qty = newQty
            setStandingItems(_standingItems)
          }}
          wSize={wSize}
        />
      </div>
    )

  }

  return (<>
    {wSize !== 'lg' && 
      <CompactViewSelectors {...compactSelectionProps} />
    }

    <DataTable
      value={sortBy(rowOptions, opt => products?.[opt.value]?.prodName || '')}
      responsiveLayout="scroll"
      style={{maxWidth: wSize === 'lg' ? "50rem" : "25.5rem", margin: "auto"}}
      scrollable={wSize === 'lg'}
      scrollHeight={wSize === 'lg' ? "50rem" : ""}
      footer={()=>{
        return (<div style={{
          width: "100%", 
          display: "flex", 
          justifyContent: "flex-end"
        }}>
          <StandingSubmitButton {...submitButtonProps} />
        </div>)
      }}
    >
      <Column 
        header={labelColumnHeaderTemplate}
        headerStyle={{
          fontSize: "1.25rem",
          color: "var(--bpb-text-color)",
        }}
        field="label" // product labels already have packSize reformatting
      />
      {colOptions.map((cOpt, idx) => {
        return(
          <Column 
            key={`standing-col-${idx}`} 
            hidden={wSize === 'lg' ? false 
              : standingView === "byProduct" 
                ? cOpt.value !== selectedProdNick 
                : cOpt.value !== selectedDayOfWeek 
            }
            // header={wSize === 'lg' ? cOpt.value : "Qty"}
            header={() => qtyColumnHeaderTemplate(cOpt)}
            headerStyle={{
              fontSize: "1.25rem", 
              color: "var(--bpb-text-color)",
              width: "4rem",
            }}
            body={rOpt => qtyColumnTemplate(rOpt, cOpt)}
            bodyStyle={{
              paddingInline: wSize === "lg" ? ".75rem" : ""
            }}
            style={
              wSize === 'lg' 
                ? {flex: "0 0 4.5rem"}
                : {width: "4.5rem"}
            }
            //style={{width: "90px", flex: "0 0 90px"}}
          />
        )
      })}
      {!colOptions.length &&
        // dummy column for when user has no standing products
        // and viewing in compact mode
        <Column 
          header={() => qtyColumnHeaderTemplate({ value: "Err" })}
          body={rOpt => <InputText style={{width: "62px"}} readOnly />}
          style={{width: "4.5rem"}}
        />
      }
    </DataTable>
  </>)
}




const CompactViewSelectors = ({
  standingView, setStandingView,
  selectedProdNick, setSelectedProdNick,
  selectedDayOfWeek, setSelectedDayOfWeek,
  productOptions,
  weekdayOptions,
}) => {

  return (<>
    <InputLabel htmlFor="viewButton" label="Display">
      <Button id="view-button"
        label={standingView === 'byProduct' ? "By Product" : "By Weekday"} 
        onClick={() => setStandingView(
          standingView === 'byProduct' ? 'byWeekday' : 'byProduct'  
        )}
      />
    </InputLabel>

    {standingView === 'byProduct' &&
      <div style={{
        //maxWidth: "25.5rem", 
        //margin: "auto", 
        paddingBlock: "1rem",
      }}>
        <InputLabel htmlFor="standing-dropdown" label={"Your Products"}>
          <Dropdown
            id="standing-dropdown"
            value={selectedProdNick}
            options={productOptions}
            onChange={e => setSelectedProdNick(e.value)}
            style={{
              width: "100%", 
              marginBottom: "1rem",
              border: "none",
              boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2), "
                + "0 1px 1px 0 rgba(0, 0, 0, 0.14), "
                + "0 1px 3px 0 rgba(0, 0, 0, 0.12)",
            }}
          />
        </InputLabel>
      </div>
    }

    {standingView === 'byWeekday' &&
      <div style={{
        maxWidth: "25.5rem", 
        margin: "auto", 
        padding: "1rem 0rem",
      }}>
        <InputLabel htmlFor="standing-dropdown" 
          label={weekdayOptions.find(w => w.value === selectedDayOfWeek).label}
        >
          <div style={{
              width: "100%",
              background: "var(--bpb-surface-input)",
              borderRadius: "3px",
              // padding: ".5rem .33rem",
              padding: ".25rem",
              boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2), "
                + "0 1px 1px 0 rgba(0, 0, 0, 0.14), "
                + "0 1px 3px 0 rgba(0, 0, 0, 0.12)",
              margin: "0"
            }}
            className="grid"
          >
            {weekdayOptions.map(opt => {
              return (
                <Button 
                  key={`weekday-selector-${opt.value}`}
                  label={opt.value.slice(0,2)} 
                  className={"col p-button-outlined"}
                  onClick={() => setSelectedDayOfWeek(opt.value)}
                  style={{
                    color: "var(--bpb-text-color)",
                    fontSize: "1.1rem",
                    border: "solid 1px",
                    borderColor: selectedDayOfWeek === opt.value 
                      ? "var(--bpb-contrast-color)" 
                      : "transparent",
                  }}
                />
              )
            })}
          </div>
        </InputLabel>
      </div>
    }

  </>)

}








