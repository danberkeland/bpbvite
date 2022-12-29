import React, { useState, useEffect } from "react"

import { useProductData } from "../Data/productData"

import { Sidebar } from "primereact/sidebar"
import { Dropdown } from "primereact/dropdown"
import { InputNumber } from "primereact/inputnumber"
import { Button } from "primereact/button"
import { Card } from "primereact/card"

import { fetchProdsForLocation } from "../Archive/DataFetching/fetcher" // to be deleted

import { DateTime } from "luxon"
import { getOrderSubmitDate } from "../Functions/dateAndTime"
import { useLocationDetails } from "../Data/locationData"
import dynamicSort from "../Functions/dynamicSort"


export const AddItemSidebar = ({ orderItemsState, sidebarProps, location, delivDate}) => {
  const { orderItems, orderItemChanges, setOrderItemChanges } = orderItemsState
  const { showAddItem, setShowAddItem } = sidebarProps
  
  const [selectedProdNick, setSelectedProdNick] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [selectedQty, setSelectedQty] = useState(null)
  
  const { data:locationDetails } = useLocationDetails(location)
  const { data:productData } = useProductData()
  const [productDisplay, setProductDisplay] = useState()

  // relatively infrequent changes
  useEffect(() => {
    console.log("(LD, PD):", locationDetails?1:0, productData?1:0)
    if (!!productData && !!locationDetails) {
      // might make sense to preserve this transformation because accurate display
      // requires both objects to be loaded. Can work around it but we need 
      // a defensive clause everywhere we use it (might not be that many places).
      let _products = applyLocationOverridesToProducts(locationDetails, productData)
      // _products = applyDateLogicToProducts(delivDate, _products)
      // _products = applyOrderLogicToProducts(orderItemChanges, _products)
      setProductDisplay(_products)
      console.log("PRODUCT DATA: ", productData)
      console.log("PRODUCT DISPLAY: ", _products)
    }
  }, [
    productData, 
    locationDetails, 
    // orderItemChanges, 
    // delivDate
  ])

  const dropdownItemTemplate = (option) => {
    // moved derived state out of data objects and into templates
    const orderSubmitDate = getOrderSubmitDate()
    const isLate = delivDate < orderSubmitDate.plus({ days: option.leadTime })
    const availableDate = orderSubmitDate.plus({ days: option.leadTime }).toLocaleString()

    const orderMatch = orderItemChanges.find(i => i.prodNick === option.prodNick)
    const inCart = orderMatch ? orderMatch.qty > 0 : false

    return(
      <div>
        <div>{option.prodName}</div>
        <div>{inCart ? "In cart" : (option.leadTime + " day lead; " + (isLate ? "earliest " + availableDate : 'available'))}</div>
      </div>
    )
  }

  const handleDropdownSelection = (e) => {
    // moved derived state out of data objects
    setSelectedProdNick(e.value)
    const _selectedProduct = productDisplay.find(item => item.prodNick === e.value)
    setSelectedProduct(_selectedProduct)

    const matchedOrderItem = orderItemChanges.find(item => item.prodNick === e.value)
    const qty = matchedOrderItem ? matchedOrderItem.qty : null
    setSelectedQty(qty)

    console.log("Selected Product:\n", JSON.stringify(_selectedProduct, null, 2))
    
  }

  const handleAddItem = () => {
    // define new item
    let newItem = { 
      id: null,
      prodNick: selectedProduct.prodNick,
      prodName: selectedProduct.prodName,
      qty: selectedQty,
      type: "C",
      rate: selectedProduct.rate ? selectedProduct.rate : selectedProduct.wholePrice,

    }

    // check for old item

    let _orderItemChanges = [...orderItemChanges]
    let oldItem = _orderItemChanges.find(item => item.prodNick === selectedProduct.prodNick)

    if (oldItem) {
      newItem.id = oldItem.type === "C" ? oldItem.id : null // just to be extra sure it's a cart item
      _orderItemChanges = _orderItemChanges
        .map(item => item.prodNick === selectedProduct.prodNick ? newItem : item)
        .sort(dynamicSort("prodName"))
      
      setOrderItemChanges(_orderItemChanges)

    } else {
      _orderItemChanges = [ ..._orderItemChanges, newItem].sort(dynamicSort("prodName"))
      setOrderItemChanges(_orderItemChanges)

    }

    setOrderItemChanges(_orderItemChanges)
    setShowAddItem(false)
    setSelectedProdNick(null)
    setSelectedProduct(null)
    setSelectedQty(null)
    console.log("added item")
  }

  return(
    <Sidebar
      className="p-sidebar-lg"
      visible={showAddItem}
      position="bottom"
      blockScroll={true}
      onHide={() => {
        setShowAddItem(false)
        setSelectedProdNick(null)
        setSelectedProduct(null)
        setSelectedQty(null)
      }}
    >
      <span className="p-float-label p-fluid" style={{marginTop: "25px"}}>
        <Dropdown 
          id="productDropdown"
          value={selectedProdNick}
          options={productDisplay}
          onChange={handleDropdownSelection}
          optionLabel="prodName"
          optionValue="prodNick"
          filter 
          showClear 
          filterBy="prodName" 
          itemTemplate={dropdownItemTemplate}
        />
        <label htmlFor="productDropdown">{productData ? "Select Product" : "Loading..."}</label>
      </span>

      <div style={{display: "flex"}}>
        <span className="p-float-label p-fluid" style={{flex: "65%", marginTop: "28px", paddingRight: "30%"}}>
          <InputNumber id="product-qty"
            value={selectedQty}
            onChange={e => setSelectedQty(e.value)}
            disabled={selectedProduct ? 
              delivDate < getOrderSubmitDate().plus({ days: selectedProduct.leadTime }) : 
              false
            }
          />
          <label htmlFor="product-qty">Quantity</label>
        </span>
    
        <Button label="Add Item"
          disabled={!selectedProdNick || !selectedQty || selectedProduct.isLate || selectedProduct.inCart}
          style={{flex: "35%", marginTop: "28px"}}
          onClick={handleAddItem}
        />
      </div>

      

    </Sidebar>
  )
}



/**
 * Include/exclude products according to overrides.
 * 
 * Apply alternate wholePrice according to overrides.
 */
function applyLocationOverridesToProducts(locationDetails, productData) {
  const prodsNotAllowed = locationDetails.prodsNotAllowed.items
  const altPrices = locationDetails.customProd.items

  let _products = productData.filter(item => {
    let override = prodsNotAllowed.find(i => i.prodNick === item.prodNick)
    return override ? 
      override.isAllowed : 
      item.defaultInclude
  })
    
  _products = _products.map(item => {
    let override = altPrices.find(i => i.prodNick === item.prodNick)
    return override ?
      { ...item, wholePrice: override.wholePrice } : 
      { ...item }
  })

  return _products
}

/**
 * Add isLate flag to product data derived from delivDate and leadTime.
 * 
 * Add availableDate string derived from order submission date and leadTime.
 */
function applyDateLogicToProducts(delivDate, productData) {
    // Apply lead-time rules to delivDate for each product
    const _products = productData.map(item => {
      const orderSubmitDate = getOrderSubmitDate()
      const selectedDelivDate = delivDate? DateTime.fromISO(delivDate.toISOString()) : null
  
      const isLate = selectedDelivDate < orderSubmitDate.plus({ days: item.leadTime })
      const availableDate = orderSubmitDate.plus({ days: item.leadTime }).toLocaleString()
  
      return({
        ...item,
        isLate: isLate,
        availableDate: availableDate,
      })
    })

    return _products
}

/**
 * Add inCart property to product data, detecting if the product is already part of the order.
 */
function applyOrderLogicToProducts(orderItemChanges, productData) {
  // which order items count as in the cart?
  // Any time we can see the item in the cart, we should have inCart = true.
  // This includes times when we render 0 qty with gray text and strikethrough.
  //
  // So, on which occasions do we have a product in our item list that should be hidden?
  //  - For a 'deleted' product: original qty 0, current qty 0, has a uuid (not just created)

  const _products = productData.map(item => {
    const matchItem = orderItemChanges.find(orderItem => orderItem.prodNick === item.prodNick)


    return ({
      ...item,
      inCart: matchItem ? matchItem.qty > 0 : false
    })
  })

  return _products
}


function updateProductDisplay(delivDate, orderData, productData, setData) {
  let itemsInCart = orderData.filter(item => item.originalQty > 0)
  itemsInCart = itemsInCart.map(item => item.prodNick)

  const orderSubmitDate = getOrderSubmitDate()
  const selectedDelivDate = delivDate? DateTime.fromISO(delivDate.toISOString()) : null
  
  let prodDisplay = productData.map(item => {
    return({
      ...item,
      inCart: itemsInCart.includes(item.prodNick),
      isLate: selectedDelivDate < orderSubmitDate.plus({ days: item.leadTime }),
      availableDate: orderSubmitDate.plus({ days: item.leadTime }).toLocaleString(),
    })
  })

  setData(prodDisplay)
}





// let prodDisplay = productData.map(item => {
//   return({
//     ...item,
//     inCart: itemsInCart.includes(item.prodNick),
//     isLate: selectedDelivDate < orderSubmitDate.plus({ days: item.leadTime }),
//     availableDate: orderSubmitDate.plus({ days: item.leadTime }).toLocaleString(),
//   })
// })








// const AddItemSidebarDEPRECIATED = ({data, sidebarProps, location, delivDate}) => {
//   const {orderHeader, orderData, setOrderData} = data
//   const {showAddItem, setShowAddItem} = sidebarProps

//   // depreciate SWR fetching; product list gets mutated on front end a lot
//   // const { productData, productDataErrors } = useProductData(location, delivDate)

//   // product data augmented for the selected location
//   const [productData, setProductData] = useState(null) 
  
//   // Product data augmented for rendering; 
//   // depends on delivery date, items in cart
//   const [productDisplay, setProductDisplay] = useState(null)

//   // data for Added item
//   const [selectedProdNick, setSelectedProdNick] = useState(null)
//   const [selectedProduct, setSelectedProduct] = useState(null)
//   const [selectedQty, setSelectedQty] = useState(null)

//   useEffect(() => {
//     fetchProdsForLocation(location, setProductData)
//   }, [location])

//   useEffect(() => {
//     if (productData) {
//       updateProductDisplay(delivDate, orderData, productData, setProductDisplay)
//     }
//   }, [productData, delivDate, orderData])

//   return (
//     <Sidebar 
//       className="p-sidebar-lg"
//       visible={showAddItem}
//       position="bottom"
//       blockScroll={true}
//       onHide={() => {
//         setShowAddItem(false)
//         setSelectedProdNick(null)
//         setSelectedProduct(null)
//         setSelectedQty(null)
//       }}
//     >
//       <span className="p-float-label p-fluid" style={{marginTop: "25px"}}>
//         <Dropdown 
//           id="productDropdown"
//           options={productDisplay}
//           optionLabel="prodName"
//           optionValue="prodNick"
//           value={selectedProdNick}
//           onChange={e => {
//             setSelectedQty(null)
//             setSelectedProdNick(e.value)
//             for (let i = 0; i < productDisplay.length; i++) {
//               if (productDisplay[i].prodNick === e.value) {
//                 setSelectedProduct(productDisplay[i])
//               }
//             }
//             for (let i = 0; i < orderData.length; i++) {
//               if (orderData[i].prodNick === e.value) {
//                 setSelectedQty(orderData[i].newQty)
//               }
//             }
//             console.log("Selected Product:\n", JSON.stringify(selectedProduct, null, 2))
            
//           }}
//           itemTemplate={option => {
//             return(
//               <div>
//                 <div>{option.prodName}</div>
//                 <div>{option.inCart ? "In cart" : (option.leadTime + " day lead; " + (option.isLate ? "earliest " + option.availableDate : 'available'))}</div>
//               </div>
//             )
//           }}

//         />
//         <label htmlFor="productDropdown">{productData ? "Select Product" : "Loading..."}</label>
//       </span>
        
//       <div style={{display: "flex"}}>
//         <span className="p-float-label p-fluid" style={{flex: "65%", marginTop: "28px", paddingRight: "30%"}}>
//           <InputNumber id="product-qty"
//             value={selectedQty}
//             onChange={e => setSelectedQty(e.value)}
//             disabled={selectedProduct ? selectedProduct.isLate : false}
//           />
//           <label htmlFor="product-qty">Quantity</label>
//         </span>
      

//         <Button label="Add Item"
//           disabled={!selectedProdNick || !selectedQty || selectedProduct.isLate || selectedProduct.inCart}
//           style={{flex: "35%", marginTop: "28px"}}
//           onClick={() => {
//             let newItem = { 
//               orderID: null,
//               prodName: selectedProduct.prodName,
//               prodNick: selectedProduct.prodNick,
//               locNick: location,
//               originalQty: 0,
//               newQty: selectedQty,
//               type: "C",
//               route: orderHeader.newRoute,
//               ItemNote: orderHeader.newItemNote,
//               rate: selectedProduct.rate,
//               total: (selectedQty * selectedProduct.rate).toFixed(2)
//             }

//             let _orderData = [...orderData]
//             const oldItem = orderData.find(item => item.prodNick === selectedProdNick)
//             if (oldItem) {
//               newItem.orderID = oldItem.orderID
//               _orderData = _orderData.filter(item => item.prodNick !== selectedProdNick)
//             }
//             _orderData = [
//               newItem,
//               ...orderData,
//             ]
//             setOrderData(_orderData)
//             setShowAddItem(false)
//             setSelectedProdNick(null)
//             setSelectedProduct(null)
//             setSelectedQty(null)
//             console.log("added item")
//           }}
//         />
//       </div>

//       {selectedProduct &&
//       <Card 
//         style={{marginTop: "10px"}}
//       >
//         <p>{selectedProduct.isLate ? "earliest " + selectedProduct.availableDate : 'available'}</p>
//         <p>{"rate: " + selectedProduct.wholePrice}</p>
//         <p>{"total: " + (selectedProduct.wholePrice * selectedQty).toFixed(2)}</p>        
//       </Card>
//       }

//     </Sidebar>
//   )
// } 