import React, { useMemo, useState } from "react"

import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"
import { Sidebar } from "primereact/sidebar"
import { InputNumber } from "primereact/inputnumber"

import { useProductDataWithLocationCustomization } from "../../../../../data/productData"

import { getWeekday, getWorkingDate, getWorkingDateTime } from "../../../../../functions/dateAndTime"
//import dynamicSort from "../../../../../functions/dynamicSort"
import { DateTime } from "luxon"

import gqlFetcher from "../../../../../data/fetchers"
import { createTemplateProd, deleteTemplateProd } from "../../../../../customGraphQL/mutations/locationMutations"
import { useLocationDetails } from "../../../../../data/locationData"
import { testProductAvailability } from "../../_utils/testProductAvailability"

export const AddItemSidebar = ({ locNick, delivDate, visible, setVisible, cartItems, cartItemChanges, setCartItemChanges, user, fulfillmentOption, calculateRoutes}) => {
  const dayOfWeek = getWeekday(delivDate)
  const delivDateDT = DateTime.fromJSDate(delivDate, {zone: 'America/Los_Angeles'})
  const delivDateString = delivDateDT.toLocaleString({ weekday: 'long', month: 'short', day: 'numeric' })  
  const orderSubmitDate = getWorkingDateTime('NOW')
  const timeDeltaDays = delivDateDT.diff(orderSubmitDate, 'days').toObject().days

  const [selectedQty, setSelectedQty] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const errorFlag = !!selectedProduct && (selectedProduct.info.inProduction || !selectedProduct.info.isAvailable || !selectedProduct.info.canFulFill)

  const { data:customProductData } = useProductDataWithLocationCustomization(locNick)
  const { mutate:mutateLocation, isValidating:locationIsValidating } = useLocationDetails(locNick, !!locNick)
  
  const addInfoToProducts = () => {
    if (!customProductData || !cartItems || !cartItemChanges) return undefined

    const enhancedData = customProductData.map(product => {
      const validRoutes = calculateRoutes(product.prodNick, dayOfWeek, fulfillmentOption)
      const cartMatchItem = cartItemChanges.find(i => i.product.prodNick === product.prodNick)
      const earliestDate = orderSubmitDate.plus({ days: product.leadTime })
        .toLocaleString({ weekday: 'short', month: 'short', day: 'numeric' })  

      const info = { 
        inProduction: delivDate < orderSubmitDate.plus({ days: product.leadTime }),
        isAvailable: testProductAvailability(product.prodNick, dayOfWeek),
        earliestDateString: earliestDate,
        maxQty: getMaxQty(user, product, delivDate, cartItems),
        canFulfill: validRoutes[0] !== null && validRoutes[0] !== 'NOT ASSIGNED',
        validRoutes: validRoutes,
        inCart: !!cartMatchItem && (cartMatchItem.qty > 0 || cartMatchItem.action === 'CREATE'),
        recentlyDeleted: cartMatchItem && getWorkingDate('NOW') === getWorkingDate(cartMatchItem.qtyUpdatedOn) && cartMatchItem.qty === 0,
      }

      return({ ...product, info: info })

    }) // end customProductData.map

    return enhancedData

  } // end addInfoToProducts

  const productDataWithInfo = useMemo(
    addInfoToProducts, 
    [customProductData, delivDate, dayOfWeek, fulfillmentOption, orderSubmitDate, user, cartItems, cartItemChanges]
  )
  
  const handleAddProduct = () => {
    let _cartItemChanges = [...cartItemChanges]
    let oldItem = cartItemChanges.find(item => 
      item.product.prodNick === selectedProduct.prodNick
    )
    let newItem
    
    if (oldItem) {
      // case: update qty on an existing cart order
      _cartItemChanges = cartItemChanges.map(item => 
        item.product.prodNick === selectedProduct.prodNick
          ? { ...item, qty: selectedQty}
          : { ...item }  
      )
    } else {
      // case: create a new cart item
      newItem = { 
        id: null,
        product: {
          prodNick: selectedProduct.prodNick,
          prodName: selectedProduct.prodName,
          leadTime: selectedProduct.leadTime,
          packSize: selectedProduct.packSize
        },
        qty: selectedQty,
        orderType: "C",
        rate: selectedProduct.wholePrice,
        action: "CREATE"
      }
      _cartItemChanges = [ ..._cartItemChanges, newItem]
        .sort((a, b) => {
          if (a.product.prodName < b.product.prodName) return -1
          if (a.product.prodName > b.product.prodName) return 1
          return 0
        })
    }
    setCartItemChanges(_cartItemChanges)

  }
  
  
  
  const DropdownItemTemplate = (option) => {
    const { inProduction, inCart, recentlyDeleted, canFulfill, isAvailable } = option.info
    const prodNameDisplayText = wrap(option.prodName, 25).split('\n')
    const icon = !!option.templateProd ? "pi pi-star-fill" : "pi pi-star"

    const errorFlag = (inProduction && !inCart) || !isAvailable || !canFulfill

    return(
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{width: "100%", display: "flex", justifyContent:"space-between", alignItems: "center"}}>
          <div style={{width: "fit-content", fontWeight: (recentlyDeleted && inProduction) ? "bold" : "normal"}}>
            {prodNameDisplayText.map((line, idx) => <div style={{fontWeight: !!option.templateProd ? "bold" : "normal"}} key={idx}>{line}</div>)}
            {(recentlyDeleted && inProduction) && <div style={{fontSize: ".9rem"}}>Recently Deleted</div>}
            <div style={{fontSize: ".9rem"}}>{`${inCart ? "In cart; " : ""}${option.leadTime} day lead`}</div>
          </div>
          <i className={errorFlag ? "pi pi-exclamation-triangle" : ""} style={{fontSize: "1.25rem", marginRight: "1rem"}}/>
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
        <div>{option.prodName || ''}</div>{!!option.templateProd && <i className="pi pi-star-fill"/>}
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
        setSelectedQty(null)
      }}  
      blockScroll={true}
      icons={() => <div>{`Adding for ${delivDateString} (T +${timeDeltaDays})`}</div>}
      position="top"
      style={{height: "16rem"}}
    >
      <div className="p-fluid" style={{margin: ".5rem"}}>
        <Dropdown options={productDataWithInfo || []} 
          //showOnFocus={true}
          optionLabel="prodName" optionValue="prodNick"
          value={selectedProduct ? selectedProduct.prodNick : null}
          filter filterBy={`prodName${user.locNick === 'backporch' ? ",prodNick" : ""}`} showFilterClear resetFilterOnHide
          itemTemplate={DropdownItemTemplate}
          valueTemplate={dropdownValueTemplate}
          onChange={e => {
            console.log("selectedProduct:", customProductData?.find(item => item.prodNick === e.value))
            setSelectedProduct(productDataWithInfo?.find(item => item.prodNick === e.value))
            setSelectedQty(cartItemChanges.find(i => i.product.prodNick === e.value)?.qty || 0)
          }}
          placeholder={customProductData ? "Select Product" : "Loading..."}
        />
      </div>
      {selectedProduct && errorFlag && 
        <div style={{maxWidth: "20rem", display: "flex", justifyContent:"space-between", alignItems: "center"}}>
          {selectedProduct && 
            <div style={{width: "fit-content", margin: ".5rem", fontSize: ".9rem"}}>
              {!selectedProduct.info.isAvailable && 
                <IconInfoMsg infoMessage={`Product not available on ${dayOfWeek}`} iconClassName="pi pi-fw pi-times" />
              }
              {fulfillmentOption === 'deliv' && !selectedProduct.info.canFulfill && 
                <IconInfoMsg infoMessage={`Pick up only for ${dayOfWeek}`} iconClassName="pi pi-fw pi-exclamation-triangle" />
              }
              {selectedProduct.info.inProduction && !selectedProduct.info.inCart && 
                <IconInfoMsg infoMessage={`In production: available ${selectedProduct.info.earliestDateString}`} iconClassName="pi pi-times" />
              }
            </div>
          }
        </div>
      }
      <div style={{display: "flex", justifyContent: "flex-end", gap: "1rem", padding: ".5rem"}}>
        <div className="p-fluid" style={{flex: "0 0 80px", maxWidth: "80px"}}>
          <InputNumber 
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
          />
        </div>

        <Button label={selectedProduct?.info.inCart ? "UPDATE" : "ADD"}
          // className="p-button-outlined p-button-rounded"
          onClick={()=>{
            console.log("product added")
            handleAddProduct()
            setVisible(false)
            setSelectedProduct(null)
            setSelectedQty(null)
          }}
          disabled={
            !selectedProduct || 
            selectedProduct?.info.maxQty === 0 ||
            selectedQty === 0 ||
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




const getMaxQty = (user, selectedProduct, delivDate, cartItems) => {
  if (!selectedProduct || !cartItems || !delivDate) return null

  // we only look through cart items returned from the DB; i.e. items already entered.
  // items just added in the app dont count as part of the order if the product is in production.
  // probably need to review all cases more closely in the future.
  const cartMatchItem = cartItems.find(
    item => item.product.prodNick === selectedProduct.prodNick
  )
  const inProduction = delivDate < getWorkingDateTime('NOW').plus({ days: selectedProduct.leadTime })
  const inCartItems = !!cartMatchItem
  const qtyUpdatedToday = inCartItems && getWorkingDate('NOW') === getWorkingDate(cartMatchItem.qtyUpdatedOn) 

  let selectedProductMax

  if (!inProduction || user.authClass === 'bpbfull') {
    selectedProductMax = 999

  } else if (!inCartItems) { 
    // implied inProduction === true
    selectedProductMax = 0

  } else if (!qtyUpdatedToday) { 
    // implied inProduction === true && inCartItems === true
    selectedProductMax = cartMatchItem.qty

  } else { 
    // implied all true
    selectedProductMax = cartMatchItem.sameDayMaxQty

  }

  return selectedProductMax

}



const wrap = (s, w) => s.replace(
  new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
);



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

const IconInfoMsg = ({ infoMessage, iconClassName }) => {

  return(
    <div style={{
      display: "flex", 
      alignContent: "center", 
      gap: ".25rem", 
      fontSize: ".9rem"
    }}>
      <i className={iconClassName || ''} />
      <span>{infoMessage}</span>
    </div>
  ) 

}