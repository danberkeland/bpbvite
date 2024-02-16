import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { InputText } from "primereact/inputtext"
import React, { useEffect, useRef } from "react"
import { useState } from "react"
import { ProductSelector } from "../../Components/ProductSelector"
import { Data } from "../../../../../utils/dataFns"
import { constructCartItem } from "../../../../../data/cartOrder/cartOrders"
import { Tag } from "primereact/tag"
import { DT, IsoDate } from "../../../../../utils/dateTimeFns"

const infoColor = 'hsl(218, 65%, 50%)'
const warnColor = 'hsl(45, 96%, 35%)'
const dangerColor = 'hsl(0, 96%, 38%)'

const fflOptionMap = {
  deliv: "Delivery",
  slopick: "Pick up in SLO",
  atownpick: "Pick up in Atascadero",
}

const CartItemList = ({
  orderDT,
  selectedDates,
  delivDates,
  cartOrders,
  cartChanges,
  templateOrderItems,
  products,
  productInfo,
  updateCartItemQty,
  appendCartItem,
  location,
  authClass, // the "simulated" authClass

  // Product selector props
  productSelectorProps,
  isMobile,
}) => {

  const { 
    value:selectedProduct,
    setValue: setCProduct,
    setDisplayValue: setCProductDisplay,
  } = productSelectorProps
  
 
  const cartItems = cartChanges?.[0]?.items ?? []
  const visibleTemplateItems = (!!location ? (templateOrderItems ?? []) : [])
    .filter(tmpItem =>
      cartItems.every(cartItem => cartItem.prodNick !== tmpItem.prodNick)
      && (products?.[tmpItem.prodNick]?.defaultInclude === true || authClass === 'bpbfull')
    )
    .reduce(Data._uniqBy(tmp => tmp.prodNick), [])

  const tableData = cartItems
    .concat(visibleTemplateItems)
    .sort(Data.compareBy(item => products?.[item.prodNick]?.meta.reformattedProdName))
    .sort(Data.compareBy(item => 
      item.Type === "Orders" && item.id === '' ? item.meta.idx : -1)
    )



  const productSelectorRef = useRef(null)
  const addProductButtonRef = useRef(null)



  const addProductFooter = () => {

    const {       
      assignedRoute,
      // routeServes,
      availableOnFinishDay, 
      // routeIsValid,      
      // routeError,  
      // orderLeadTime,
      effectiveLeadTime, 
      inProduction,
    } = productInfo?.[selectedProduct?.prodNick]?.[0] ?? {}
  
    // console.log("ASSIGNED ROUTE", assignedRoute)
  
    const inCart = !!selectedProduct?.prodNick && 
      tableData.some(item => item.prodNick === selectedProduct?.prodNick)

    return (<>
      <div style={{flex: "1 1 20rem", paddingBottom: "1rem"}}>
        <ProductSelector 
          inputRef={productSelectorRef}
          addButtonRef={addProductButtonRef}
          {...productSelectorProps} 
        />
      </div>
      <div style={{
        flex:"0 0 100%", 
        display: "flex",  
        justifyContent: "space-between",
        alignItems: "center", 
        gap: "1rem", 
      }}>
        <div style={{paddingInline: ".5rem"}}>
          {!!selectedProduct && (<>
            {assignedRoute?.error === 'cannot fulfill in time'
              ? <div style={{display:"flex", alignItems:"center"}}><i className="pi pi-fw pi-exclamation-triangle" /> {fflOptionMap[cartChanges?.[0].header.route]} not available {selectedDates[0].DT.toFormat('EEEE')}s</div>
              : <>
                <div style={{display: "inline-block"}}>Lead time: {effectiveLeadTime} days</div> {inProduction && !inCart && <div style={{display: "inline-block"}}>{`(Earliest ${orderDT.plus({ days: effectiveLeadTime}).toFormat('EEE, MMM d')})`}</div>}
              </>

            }
             
            {inCart && <div>In Cart</div>}
            {selectedProduct?.defaultInclude === false && authClass === 'bpbfull' && <div>
              <Tag 
                severity='danger' 
                value="Not Allowed" 
                icon="pi pi-fw pi-exclamation-circle"
                style={{background: dangerColor}}
              /> - Special cases only
            </div>}
            
            {/* This is Wrong. need to check the date baked (may not be the deliv date) */}
            {/* {!availableOnFinishDay && <div>Product not available</div>} */}
            {!!assignedRoute?.error && <div>{assignedRoute.error}</div>}
          </>)}
        </div>
        <div>
          <Button 
            ref={addProductButtonRef}
            label="Add"
            // icon="pi pi-plus" 
            style={{width: "3.5rem", paddingInline: ".25rem"}} 
            onClick={() => {
              const orderIdx = 0
              const newRow = constructCartItem(
                  "Orders", 
                  selectedProduct.prodNick, 
                  selectedProduct.wholePrice, 
                  { ...selectedProduct.meta, idx: null, standingQty: null }
                )
              const initialQty = 0
              appendCartItem(orderIdx, newRow, initialQty)
              setCProduct(null)
              setCProductDisplay(null)
              // setShouldScrollTable(true)
              setTimeout(() => {
                document.documentElement.getElementsByClassName('p-datatable-wrapper')[0].scrollTo({
                  top: 300000,
                  behavior: 'smooth',
                })
              }, 0)

              productSelectorRef.current.focus()
            }}
            disabled={
              !selectedProduct 
              || inCart
              || ( 
                authClass !== 'bpbfull' 
                && (
                  inProduction
                  || products?.[selectedProduct.prodNick].defaultInclude === 'false'
                )
              )
            }
          />
        </div>
      </div>
    </>)
  }

  const itemsRef = useRef(new Map());
  function getMap() { 
    return itemsRef.current ?? new Map()
  }
  function getRefByKey(node, key) {
    !!node ? getMap().set(key, node) : getMap().delete(key)
  }



  return (
    <DataTable
      value={tableData}
      responsiveLayout="scroll"
      scrollable={true}
      scrollHeight={isMobile ? "1000rem" : "40rem"}
      footer={addProductFooter}
      className={"cart-order-table"}
    >
      <Column 
        header={() => <div onClick={() => {
          console.log(cartChanges)
          console.log("table data:", tableData)
        }}>
          Products
        </div>}
        body={row => <ProductColumnBody 
          row={row} 
          baseRow={cartOrders?.[0]?.items[row.meta.idx]}
          product={products?.[row.prodNick] ?? {}}
          pInfo={productInfo?.[row.prodNick]?.[0] ?? {}}
          authClass={authClass}
          fflOptionMap={fflOptionMap}
          cartChanges={cartChanges}
          selectedDates={selectedDates}
          orderDT={orderDT}
        />}
        footerStyle={{position: "relative"}}
      />
      <Column header="Qty"
        body={(row, props)=> <QtyColumnBody 
          row={row}
          rowIndex={props.rowIndex}
          itemsRef={itemsRef}
          getRefByKey={getRefByKey}
          nRows={tableData.length}
          product={products?.[row.prodNick]}
          pInfo={productInfo?.[row.prodNick]?.[0] ?? {}}
          baseItems={cartOrders?.[0].items}
          baseItemIdx={row.meta.idx}
          baseRow={cartOrders?.[0]?.items[row.meta.idx]}
          cartOrder={cartOrders?.[0]}
          orderIdx={0}
          packSize={products?.[row.prodNick]?.packSize ?? 1}
          updateCartItemQty={updateCartItemQty}
          appendCartItem={appendCartItem}
          selectedDates={selectedDates}
          orderDT={orderDT}
          authClass={authClass}
        />}
        style={{flex: "0 0 5rem"}}
        bodyStyle={{display:"block"}}
        footerStyle={{position: "relative"}}
      />
    </DataTable>
  )
}

const ProductColumnBody = ({
  row, 
  baseRow,
  orderIdx,
  product,
  pInfo,
  authClass,
  fflOptionMap,
  cartChanges,
  selectedDates,
  orderDT,
}) => {
  const { reformattedProdName } = product.meta ?? {}
  const {       
    assignedRoute,
    effectiveLeadTime, 
    inProduction,
  } = pInfo
  const pastDelivDate = orderDT.toMillis() > selectedDates?.[0].DT.toMillis()
  const delivDateReached = orderDT.toMillis() === selectedDates?.[0].DT.toMillis()
  const sameDayMaxApplies = DT.fromIsoTs(row.qtyUpdatedOn).plus({ hours: 4 }).startOf('day').toMillis() === orderDT.toMillis()
  const maxQty = pastDelivDate ? 0
    : (authClass === 'bpbfull' || assignedRoute?.error === 'cannot fulfill in time') ? 999
    : (!assignedRoute || !!assignedRoute.error || delivDateReached) ? 0
    : (inProduction && sameDayMaxApplies) ? row.sameDayMaxQty 
    : inProduction ? row.qty
    : 999

  const qtyChanged = !!baseRow
    ? row.qty !== baseRow.qty
    : row.qty !== 0 

  const infoIcon = <i className="pi pi-fw pi-info-circle" 
    style={{color: row.qty !== 0 ? infoColor : undefined }} 
  />
  const warnIcon = <i className="pi pi-fw pi-exclamation-triangle" 
    style={{color: row.qty !== 0 ? warnColor : undefined}} 
  />
  const errorIcon = <i className="pi pi-fw pi-times" 
    style={{color: row.qty !== 0 ? dangerColor : undefined }} 
  />

  const infoStyle = {display: "flex"} //, alignItems: "center"}

  return <div style={{fontSize: ".9rem", opacity: row.qty === 0 ? ".8" : "1"}}>
    <div style={{fontSize: "1rem", fontWeight: "bold", fontStyle: qtyChanged ? "italic" : undefined}}>{reformattedProdName ?? ""}</div>
    {/* {(assignedRoute?.error === 'cannot fulfill in time' || assignedRoute?.error === 'route not scheduled') &&
      <div style={{...infoStyle, fontWeight: qtyChanged ? "bold" : undefined}}>{warnIcon} {fflOptionMap[cartChanges?.[0].header.route]} not available {selectedDates[0].DT.toFormat('EEEE')}s</div>
    } */}

    {/* {
      pastDelivDate ? <div style={infoStyle}>{infoIcon}Past delivery date (read only)</div>
      : delivDateReached ? <div style={infoStyle}>{infoIcon}Delivery date reached{authClass !== 'bpbfull' && ` (read only)`}</div>
      : inProduction && maxQty !== 0 ? <div style={infoStyle}>{infoIcon}In Production{maxQty < 999 && ` (max ${maxQty})`}</div>
      : inProduction ? <div style={infoStyle}>{errorIcon}In Production {`(earliest ${orderDT.plus({ days: effectiveLeadTime}).toFormat('EEE, MMM d')})`}</div>
      : null
    } */}

    {product?.defaultInclude === false && ( 
      authClass === 'bpbfull'
        ? <>
            <Tag 
              severity='danger' 
              value="Not Allowed" 
              icon="pi pi-fw pi-exclamation-circle"
              style={{background: dangerColor}}
            /> Special cases only
          </>
        : <><div style={infoStyle}>{infoIcon}Special order (read only)</div></>
    )}
    
    {/* {!!assignedRoute?.error && <div>{assignedRoute.error}</div>} */}
  </div>
}

const QtyColumnBody = ({
  row,
  itemsRef,
  getRefByKey,
  rowIndex,
  nRows,
  product,
  pInfo,
  baseItems,
  baseItemIdx,
  baseRow,
  cartOrder,
  orderIdx,
  packSize,
  updateCartItemQty,
  appendCartItem,
  selectedDates,
  orderDT,
  authClass,
}) => {
  const {       
    assignedRoute,
    effectiveLeadTime, 
    inProduction,
  } = pInfo
  const pastDelivDate = orderDT.toMillis() > selectedDates?.[0].DT.toMillis()
  const delivDateReached = orderDT.toMillis() === selectedDates?.[0].DT.toMillis()
  const sameDayMaxApplies = DT.fromIsoTs(row.qtyUpdatedOn).plus({ hours: 4 }).startOf('day').toMillis() === orderDT.toMillis()
  const maxQty = pastDelivDate ? 0
    : (authClass === 'bpbfull' || assignedRoute?.error === 'cannot fulfill in time' || assignedRoute?.error === 'route not scheduled') ? 999
    : (!assignedRoute || !!assignedRoute.error || delivDateReached) ? 0
    : (inProduction && sameDayMaxApplies) ? row.sameDayMaxQty 
    : inProduction ? row.qty
    : 999

  const minQty = 0
  // const maxQty = 999

  // TODO: lift these state variable up 1 level and combine
  // into array state values
  const [input, setInput] = useState(row.qty)                 // the displayed value
  const [rollbackValue, setRollbackValue] = useState(row.qty) // the last entered value
  useEffect(() => {
    setInput(row?.qty ?? 0)
    setRollbackValue(row?.qty ?? 0)  

    return () => {
      setInput(0)
      setRollbackValue(0)
    }
  }, [cartOrder, row])

  const setNewQty = newValue => { 
    // if (row.Type !== "Template") {
    if (row.meta.idx !== null) {
      updateCartItemQty(orderIdx, row.meta.idx, newValue)
    } else {
      appendCartItem(orderIdx, row, newValue)
    }

    setInput(newValue)
  }
  
  // Note: Number("") evaluates to 0.
  const evaluateInput = () => {
    console.log("current value:", row.qty, "input:", input)
    let newValue
    if (input[0] === '+') {
      const addValue = Number(input.slice(1))
      newValue = Math.min(Math.max(row.qty + addValue, minQty), maxQty)

    } else if (input[0] === '-') {
      const subValue = Number(input.slice(1))
      newValue = Math.min(Math.max(row.qty - subValue, minQty), maxQty)
    } else {
      newValue = Math.min(Math.max(Number(input), minQty), maxQty)
    }

    setNewQty(newValue)
  }


  return <>
    <InputText 
      ref={el => getRefByKey(el, rowIndex.toString())}//itemsRef.current[rowIndex] = el}
      value={input}
      inputMode="numeric"
      autoComplete="name"
      onChange={e => {
        const eValue = e.target.value
        if (/^[+-]?\d{0,3}?$/.test(eValue)) {
          // setInput(eValue)
          setInput(eValue)
        } 
      }}
      onFocus={e => {
        // console.log(e.target)
        e.target.select()
        // setRollbackValue(row.qty)
        setRollbackValue(row.qty)
        console.log(row)
      }}
      onKeyDown={e => {
        // console.log(e.key)
        switch (e.key) { 
          case "Enter": 
            e.target.blur()
            break

          case "Escape":
            e.target.blur()
            if (e.target.value === "") {
              setNewQty(baseRow?.qty ?? 0)
            } else {
              setNewQty(rollbackValue)
            }
            break
          
          case "ArrowUp":
            if (rowIndex > 0) {
              const prevEl = itemsRef.current.get(((rowIndex - 1 + nRows) % nRows).toString())
              setTimeout(() => {prevEl.select()}, 0)
            } else {
              setTimeout(() => itemsRef.current.get((rowIndex).toString()).select(), 0)
            }
            break
          
          case "ArrowDown":
            if (rowIndex < nRows - 1) {
              const nextEl = itemsRef.current.get(((rowIndex + 1 + nRows) % nRows).toString())
              setTimeout(() => {nextEl.select()}, 0)
            } else {
              setTimeout(() => itemsRef.current.get((rowIndex).toString()).select(), 0)
            }
            break

          default: 
            break
        }
      }}
      onBlur={() => {
        evaluateInput()
        // console.log(itemsRef.current)
      }}
      style={{width: "3.5rem"}}  
      readOnly={maxQty === 0}
    />
    {packSize > 1 &&
      <div style={{textAlign: "center", fontSize: ".9rem"}}>
        {row.qty * packSize} ea
      </div>
    }
    {/* <div>{maxQty}</div>
    <div>{authClass}</div> */}
    <div>{assignedRoute?.error}</div>
  </>

}

export {
  CartItemList
}