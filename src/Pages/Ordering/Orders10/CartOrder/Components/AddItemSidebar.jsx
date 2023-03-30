import React, { useMemo, useRef, useState } from "react"

import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"
import { Sidebar } from "primereact/sidebar"

import { useProductDataWithLocationCustomization } from "../../../../../data/productData"

import { getWeekday, getWorkingDate, getWorkingDateTime } from "../../../../../functions/dateAndTime"
//import dynamicSort from "../../../../../functions/dynamicSort"
import { DateTime } from "luxon"

import gqlFetcher from "../../../../../data/fetchers"
import { createTemplateProd, deleteTemplateProd } from "../../../../../customGraphQL/mutations/locationMutations"
import { useLocationDetails } from "../../../../../data/locationData"
import { testProductAvailability } from "../../_utils/testProductAvailability"
import { reformatProdName } from "../../_utils/reformatProdName"
import { IconInfoMessage } from "../../_components/IconInfoMessage"
import { wrapText } from "../../_utils/wrapText"
import { InputText } from "primereact/inputtext"
import { handleAddCartProduct } from "../../_utils/handleAddProduct"

export const AddItemSidebar = ({ locNick, delivDate, visible, setVisible, cartItems, cartItemChanges, setCartItemChanges, user, fulfillmentOption, calculateRoutes}) => {
  const dayOfWeek = getWeekday(delivDate)
  const delivDateDT = DateTime.fromJSDate(delivDate, {zone: 'America/Los_Angeles'})
  const delivDateString = delivDateDT.toLocaleString({ weekday: 'long', month: 'short', day: 'numeric' })  
  const orderSubmitDate = getWorkingDateTime('NOW')
  const timeDeltaDays = delivDateDT.diff(orderSubmitDate, 'days').toObject().days

  const [selectedQty, setSelectedQty] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const errorFlag = !!selectedProduct && (selectedProduct.info.inProduction || !selectedProduct.info.isAvailable || !selectedProduct.info.canFulFill)

  const { data:customProductData } = useProductDataWithLocationCustomization(locNick)
  const { mutate:mutateLocation, isValidating:locationIsValidating } = useLocationDetails(locNick, !!locNick)

  const inputNumberRef = useRef(null)
  
  const addInfoToProducts = () => {
    if (!customProductData || !cartItems || !cartItemChanges) return undefined
    // console.log(cartItems)
    // console.log(cartItemChanges)

    const enhancedData = customProductData.map(product => {
      const cartMatchItem = cartItemChanges.find(i => i.product.prodNick === product.prodNick)
      const baseMatchItem = cartItems.find(i => i.product.prodNick === product.prodNick)

      const inProduction = delivDate < orderSubmitDate.plus({ days: product.leadTime })
      const isAvailable = testProductAvailability(product.prodNick, dayOfWeek)
      const earliestDate = orderSubmitDate.plus({ days: product.leadTime })
        .toLocaleString({ weekday: 'short', month: 'short', day: 'numeric' })  
      const validRoutes = calculateRoutes(product.prodNick, dayOfWeek, fulfillmentOption)
      const inCart = !!baseMatchItem && (baseMatchItem.qty > 0 
        || (cartMatchItem?.action === 'CREATE' && (!cartMatchItem.isTemplate || !!cartMatchItem.qty)))
      const sameDayUpdate = !!baseMatchItem && getWorkingDate('NOW') === getWorkingDate(baseMatchItem.qtyUpdatedOn)

      const maxQty = (!inProduction && isAvailable) || user.authClass === 'bpbfull' ? 999
      //const maxQty = (!inProduction && isAvailable) ? 999  
        : !baseMatchItem ? 0        
        : !sameDayUpdate ? (baseMatchItem.qty)
        : (baseMatchItem.sameDayMaxQty || 0)

      // console.log("BMI", baseMatchItem)
      // console.log("CMI", cartMatchItem)
      const info = { 
        inProduction: inProduction,
        isAvailable: isAvailable,
        earliestDateString: earliestDate,
        validRoutes: validRoutes,
        canFulfill: validRoutes[0] !== null && validRoutes[0] !== 'NOT ASSIGNED',
        inCart: inCart,
        //maxQty: getMaxQty(user, selectedProduct, delivDate, cartMatchItem, isAvailable),
        maxQty: maxQty,
        recentlyDeleted: (!!baseMatchItem && !!cartMatchItem) && sameDayUpdate && baseMatchItem.qty === 0 && cartMatchItem.qty === 0,
      }

      return({ ...product, info: info })

    }) // end customProductData.map

    return enhancedData

  } // end addInfoToProducts

  const productDataWithInfo = useMemo(
    addInfoToProducts, 
    [customProductData, delivDate, dayOfWeek, fulfillmentOption, orderSubmitDate, user, cartItems, cartItemChanges]
  )
  
  
  
  
  
  const DropdownItemTemplate = (option) => {
    const { inProduction, inCart, recentlyDeleted, canFulfill, isAvailable } = option.info
    const prodNameDisplayText = wrapText(reformatProdName(option.prodName, option.packSize), 25).split('\n')
    const icon = !!option.templateProd ? "pi pi-star-fill" : "pi pi-star"

    const warnFlag = !canFulfill
    const errorFlag = (inProduction && !inCart) || !isAvailable
    const severity = errorFlag ? "error" : warnFlag ? "warn" : "info"

    return(
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{width: "100%", display: "flex", justifyContent:"space-between", alignItems: "center"}}>
          <div style={{width: "fit-content"}}>
            {prodNameDisplayText.map((line, idx) => <div style={{fontWeight: !!option.templateProd ? "bold" : "normal"}} key={idx}>{line}</div>)}
            {(recentlyDeleted && inProduction) && <div style={{fontSize: ".9rem"}}>Recently Deleted</div>}
            {/* <div style={{fontSize: ".9rem", marginTop: ".1rem" }}>{`${option.leadTime} day lead`}</div> */}
            {/* {inCart && <IconInfoMessage text="In cart" iconClass="pi pi-fw pi-shopping-cart" />} */}
            <div style={{fontSize: ".9rem"}}>{`${inCart ? "In cart; " : ""}${option.leadTime} day lead`}</div>
          </div>
          <i className={errorFlag ? "pi pi-times" : (warnFlag ? "pi pi-exclamation-triangle" : "")} 
            style={{
              fontSize: "1.25rem", 
              marginRight: "1rem", 
              color: errorFlag ? "#BF0404" : warnFlag? "hsl(45, 96%, 35%)" : "",
            }}
          />
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
      visible={visible} 
      onHide={() => {
        setVisible(false)
        setSelectedProduct(null)
        setSelectedQty('')
      }}  
      blockScroll={true}
      icons={() => <div>{`Adding for ${delivDateString} (T +${timeDeltaDays})`}</div>}
      position="top"
      style={{height: "16rem"}}
    >
      <div className="p-fluid" style={{margin: ".5rem"}}>
        <Dropdown options={productDataWithInfo || []} 
          autoFocus={true}
          //showOnFocus={true}
          optionLabel="prodName" optionValue="prodNick"
          value={selectedProduct ? selectedProduct.prodNick : null}
          filter filterBy={`prodName${user.locNick === 'backporch' ? ",prodNick" : ""}`} showFilterClear resetFilterOnHide filterInputAutoFocus
          itemTemplate={DropdownItemTemplate}
          valueTemplate={dropdownValueTemplate}
          onChange={e => {
            console.log("selectedProduct:", customProductData?.find(item => item.prodNick === e.value))
            setSelectedQty(cartItemChanges.find(i => i.product.prodNick === e.value)?.qty || 0)
            setSelectedProduct(productDataWithInfo?.find(item => item.prodNick === e.value))
          }}
          onHide={() => selectedProduct && inputNumberRef.current.focus()}
          placeholder={customProductData ? "Select Product" : "Loading..."}
        />
      </div>
      {selectedProduct && errorFlag && 
        <div style={{maxWidth: "20rem", display: "flex", justifyContent:"space-between", alignItems: "center"}}>
          {selectedProduct && 
            <div style={{width: "fit-content", margin: ".5rem", fontSize: ".9rem"}}>
              {!selectedProduct.info.isAvailable && 
                <IconInfoMessage text={`Product not available on ${dayOfWeek}`} 
                  iconClass="pi pi-fw pi-times" iconColor="#BF0404"
                />
              }
              {fulfillmentOption === 'deliv' && !selectedProduct.info.canFulfill && 
                <IconInfoMessage text={`Pick up only for ${dayOfWeek}`} 
                  iconClass="pi pi-fw pi-exclamation-triangle" iconColor="hsl(45, 96%, 35%)"
                />
              }
              {selectedProduct.info.inProduction && !selectedProduct.info.inCart && 
                <IconInfoMessage text={`In production: earliest ${selectedProduct.info.earliestDateString}`} 
                  iconClass="pi pi-fw pi-times" iconColor="#BF0404"
                />
              }
              {selectedProduct.info.inProduction && !!selectedProduct.info.inCart && selectedProduct.info.maxQty > 0 &&
                <IconInfoMessage text={`In cart; In production${selectedProduct.info.maxQty < 999 ? `(max ${selectedProduct.info.maxQty})` : ""}`} 
                  iconClass="pi pi-fw pi-info-circle" iconColor="hsl(218, 43%, 50%)"
                />
              }
            </div>
          }
        </div>
      }
      <div style={{display: "flex", justifyContent: "flex-end", gap: "1rem", padding: ".5rem"}}>
        <div className="p-fluid" style={{flex: "0 0 80px", maxWidth: "80px"}}>
          {/* <InputNumber 
            inputRef={inputNumberRef}
            value={selectedQty}
            min={0}
            max={selectedProduct?.info.maxQty}
            placeholder="Qty"
            disabled={
              !selectedProduct || 
              selectedProduct?.info.maxQty === 0
            }
            onFocus={(e) => {
              e.target.select();
            }}
            onChange={e => setSelectedQty(e.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") {
                if (e.target.value === "") setSelectedQty(0);
                e.target.blur();
              }

            }}
            onBlur={() => {
              if (selectedQty === null) {
                setSelectedQty(0)
              }
            }}
          /> */}
          <InputText
            //inputRef={inputNumberRef}
            ref={inputNumberRef}
            value={String(selectedQty)}
            placeholder="Qty"
            inputMode="numeric"
            keyfilter={/[0-9]/}
            style={{
              // fontWeight : qtyChanged ? "bold" : "normal",
              color: selectedQty === 0 ? "gray" : '',
              backgroundColor: selectedQty > 0 ? 'hsl(37, 67%, 95%)' :'',
            }}
            disabled={
              !selectedProduct || 
              selectedProduct?.info.maxQty === 0
            }
            // tooltip={rowData.product.packSize > 1 ? `${rowData[qtyAtt] || 0} pk = ${(rowData[qtyAtt] || 0) * rowData.product.packSize} ea` : ''}
            // tooltipOptions={{ event: 'focus', position: 'left' }}
            // onClick={() => console.log(rowData)}
            onFocus={e => {
              e.target.select()
              // setRollbackQty(rowData[qtyAtt])
            }}
            // onKeyDown={e => console.log(e)}
            onChange={e => {
              setSelectedQty(Math.min(Number(e.target.value), selectedProduct.info.maxQty))
              // setSelectedQty(Number(e.target.value))
            }}
            onKeyDown={(e) => {
              console.log(e)
              if (e.key === "Enter") { 
                e.target.blur();
                if (e.target.value === "") setSelectedQty(0);
              }

              if (e.key === "Escape") {
                if (e.target.value === "") {
                  e.target.blur()
                  // let resetQty = baseItem.qty || 0
                  // updateQty(resetQty);
                  // setRollbackQty(resetQty)
                } else {
                  e.target.blur()
                  // updateQty(rollbackQty);
                }
              }
            }}
            onBlur={() => {
              if (selectedQty === '') {
                setSelectedQty(0)
              }
            }}
          /> 
        </div>

        <Button label={selectedProduct?.info.inCart ? "UPDATE" : "ADD"}
          // className="p-button-outlined p-button-rounded"
          onClick={()=>{
            console.log("product added")
            handleAddCartProduct(selectedProduct, selectedQty, cartItemChanges, setCartItemChanges)
            setVisible(false)
            setSelectedProduct(null)
            setSelectedQty(0)
          }}
          disabled={
            !selectedProduct || 
            selectedProduct?.info.maxQty === 0 ||
            (user.authClass === 'bpbfull' && delivDate < getWorkingDateTime('NOW')) ||
            (user.authClass !== 'bpbfull' && delivDate <= getWorkingDateTime('NOW')) ||
            (user.authClass !== 'bpbfull' && !selectedProduct?.info.isAvailable) ||
            (user.authClass !== 'bpbfull' && selectedProduct?.info.inProduction && !selectedProduct?.info.inCart)
          }
          style={{flex: "0 0 100px"}}
        />
      </div>

    </Sidebar>
  )

}



const toggleFav = async (locNick, prodNick, id, mutateLocation) => {
  console.log(id)

  if (!!id) await deleteFav(id)
  else await createFav(locNick, prodNick)

  mutateLocation()
}

const createFav = async (locNick, prodNick) => {
  let query = createTemplateProd
  let variables = { 
    input: {
      locNick: locNick,
      prodNick: prodNick
    }
  }

  let response = await gqlFetcher(query, variables)
  console.log("createFav", response)
}

const deleteFav = async (id) => {
  let query = deleteTemplateProd
  let variables = { 
    input: {
      id: id
    }
  }

  let response = await gqlFetcher(query, variables)
  console.log("deleteFav", response)
}


      
// const CustomInputNumber = ({ rowData, qtyAtt, dayOfWeek, standingBase, standingChanges, setStandingChanges, disabled }) => {
//   const [rollbackQty, setRollbackQty] = useState()

//   const baseItem = standingBase.find(i =>
//     i.product.prodNick === rowData.product.prodNick
//     && i.dayOfWeek === dayOfWeek  
//     && i.isWhole === rowData.isWhole
//     && i.isStand === rowData.isStand
//   )

//   const qtyChanged = (baseItem && baseItem.qty !== rowData[qtyAtt]) || (!baseItem && rowData[qtyAtt] > 0)
  
//   const matchIndex = standingChanges.findIndex(i =>
//     i.product.prodNick === rowData.product.prodNick
//     && i.dayOfWeek === dayOfWeek  
//     && i.isWhole === rowData.isWhole
//     && i.isStand === rowData.isStand
//   )
  
//   const updateQty = (value) => {    
//     let newQty = Number(value) >= 999 ? 999 : (value === '' ? value : Number(value))

//     //console.log(e, e.value, typeof(e.value), newQty)
//     if (matchIndex > -1) {
//       let _update = [...standingChanges]
//       let _updateItem = {
//         ..._update[matchIndex],
//         qty: newQty
//       }
//       _update[matchIndex] = _updateItem
//       setStandingChanges(_update)
//     } else {
//       console.log("error: standing data could not be updated.")
//     }
//   }

//   return (
//     <InputText
//       value={rowData[qtyAtt]}
//       placeholder="Qty"
//       inputMode="numeric"
//       keyfilter={/[0-9]/}
//       style={{
//         fontWeight : qtyChanged ? "bold" : "normal",
//         color: rowData[qtyAtt] === 0 ? "gray" : '',
//         backgroundColor: qtyChanged ? 'hsl(37, 67%, 95%)' :'',
//       }}
//       disabled={disabled}
//       tooltip={rowData.product.packSize > 1 ? `${rowData[qtyAtt] || 0} pk = ${(rowData[qtyAtt] || 0) * rowData.product.packSize} ea` : ''}
//       tooltipOptions={{ event: 'focus', position: 'left' }}
//       onClick={() => console.log(rowData)}
//       onFocus={e => {
//         e.target.select()
//         setRollbackQty(rowData[qtyAtt])
//       }}
//       // onKeyDown={e => console.log(e)}
//       onChange={e => {updateQty(e.target.value)}}
//       onKeyDown={(e) => {
//         console.log(e)
//         if (e.key === "Enter") { 
//           e.target.blur();
//           if (e.target.value === "") updateQty(0);
//         }

//         if (e.key === "Escape") {
//           if (e.target.value === "") {
//             e.target.blur()
//             let resetQty = baseItem.qty || 0
//             updateQty(resetQty);
//             setRollbackQty(resetQty)
//           } else {
//             e.target.blur()
//             updateQty(rollbackQty);
//           }
//         }
//       }}
//       onBlur={() => {
//         if (rowData[qtyAtt] === '') {
//           updateQty(0)
//         }
//       }}
//     />
//   )

// }

