import React, { useState, useEffect } from "react"

import { useProductData } from "../Data/productData"

import { Sidebar } from "primereact/sidebar"
import { Dropdown } from "primereact/dropdown"
import { InputNumber } from "primereact/inputnumber"
import { Button } from "primereact/button"
import { Card } from "primereact/card"

import { fetchProdsForLocation } from "../Archive/DataFetching/fetcher"

import { DateTime } from "luxon"
import { getOrderSubmitDate } from "../Functions/dateAndTime"


export const AddItemSidebar = ({orderState, locationDetails, selection, sidebarProps}) => {
  const { orderHeader, orderItems, setOrderItems } = orderState
  const { showAddItem, setShowAddItem } = sidebarProps
  const { delivDate } = selection 

  const { data:productData } = useProductData()
  const [productDisplay, setProductDisplay] = useState()

  const [selectedProdNick, setSelectedProdNick] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedQty, setSelectedQty] = useState(null)

  useEffect(() => {
    if (!!productData && !!locationDetails) setProductDisplay(
      makeProductDisplay(productData, locationDetails, delivDate)
    )
  }, [productData, locationDetails, delivDate])

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
          options={productDisplay}
          optionLabel="prodName"
          optionValue="prodNick"
          value={selectedProdNick}
          onChange={e => {
            setSelectedQty(null)
            setSelectedProdNick(e.value)
            for (let i = 0; i < productDisplay.length; i++) {
              if (productDisplay[i].prodNick === e.value) {
                setSelectedProduct(productDisplay[i])
              }
            }
            for (let i = 0; i < orderItems.length; i++) {
              if (orderItems[i].prodNick === e.value) {
                setSelectedQty(orderItems[i]._qty)
              }
            }
            console.log("Selected Product:\n", JSON.stringify(selectedProduct, null, 2))
            
          }}
          itemTemplate={option => {
            const orderSubmitDate = getOrderSubmitDate()
            const availableDate = orderSubmitDate.plus({ days: option.leadTime }).toLocaleString()

            return(
              <div>
                <div>{option.prodName}</div>
                <div>{option.inCart ? "In cart" : (option.leadTime + " day lead; " + (option.isLate ? "earliest " + availableDate : 'available'))}</div>
              </div>
            )
          }}

        />
        <label htmlFor="productDropdown">{productData ? "Select Product" : "Loading..."}</label>
      </span>

      <div style={{display: "flex"}}>
        <span className="p-float-label p-fluid" style={{flex: "65%", marginTop: "28px", paddingRight: "30%"}}>
          <InputNumber id="product-qty"
            value={selectedQty}
            onChange={e => setSelectedQty(e.value)}
            disabled={selectedProduct ? selectedProduct.isLate : false}
          />
          <label htmlFor="product-qty">Quantity</label>
        </span>
      

        <Button label="Add Item"
          disabled={!selectedProdNick || !selectedQty || selectedProduct.isLate || selectedProduct.inCart}
          style={{flex: "35%", marginTop: "28px"}}
          onClick={() => {
            let newItem = { 
              orderID: null,
              type: "C",
              prodName: selectedProduct.prodName,
              prodNick: selectedProduct.prodNick,
              qty: 0,
              _qty: selectedQty,
              rate: selectedProduct.rate,
              action: 'CREATE'
            }

            let _orderItems = [...orderItems]
            const oldItem = orderItems.find(item => item.prodNick === selectedProdNick)
            if (oldItem) {
              newItem.orderID = oldItem.orderID
              _orderItems = _orderItems.filter(item => item.prodNick !== selectedProdNick)
            }
            _orderItems = [
              newItem,
              ...orderItems,
            ]
            setOrderItems(_orderItems)
            setShowAddItem(false)
            setSelectedProdNick(null)
            setSelectedProduct(null)
            setSelectedQty(null)
            console.log("added item")
          }}
        />
      </div>

    </Sidebar>
  )
}

/**
 * Apply location-specific customizations to products:
 * - Filter out disallowed products
 * - apply alternate pricing
 */
function makeProductDisplay(productData, locationDetails, delivDate) {
  const altPrices = locationDetails.customProd.items
  const prodsNotAllowed = locationDetails.prodsNotAllowed.items

  const orderSubmitDate = getOrderSubmitDate()
  const selectedDelivDate = delivDate? DateTime.fromISO(delivDate.toISOString()) : null

  let displayItems = productData.map(item => {
    const isLate = delivDate < orderSubmitDate.plus({ days: item.leadTime })

    return({
      ...item,
      isLate: isLate,
      disabled: isLate
    })
  })

  return displayItems
}






// let prodDisplay = productData.map(item => {
//   return({
//     ...item,
//     inCart: itemsInCart.includes(item.prodNick),
//     isLate: selectedDelivDate < orderSubmitDate.plus({ days: item.leadTime }),
//     availableDate: orderSubmitDate.plus({ days: item.leadTime }).toLocaleString(),
//   })
// })








const AddItemSidebarDEPRECIATED = ({data, sidebarProps, location, delivDate}) => {
  const {orderHeader, orderData, setOrderData} = data
  const {showAddItem, setShowAddItem} = sidebarProps

  // depreciate SWR fetching; product list gets mutated on front end a lot
  // const { productData, productDataErrors } = useProductData(location, delivDate)

  // product data augmented for the selected location
  const [productData, setProductData] = useState(null) 
  
  // Product data augmented for rendering; 
  // depends on delivery date, items in cart
  const [productDisplay, setProductDisplay] = useState(null)

  // data for Added item
  const [selectedProdNick, setSelectedProdNick] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedQty, setSelectedQty] = useState(null)

  useEffect(() => {
    fetchProdsForLocation(location, setProductData)
  }, [location])

  useEffect(() => {
    if (productData) {
      updateProductDisplay(delivDate, orderData, productData, setProductDisplay)
    }
  }, [productData, delivDate, orderData])

  return (
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
          options={productDisplay}
          optionLabel="prodName"
          optionValue="prodNick"
          value={selectedProdNick}
          onChange={e => {
            setSelectedQty(null)
            setSelectedProdNick(e.value)
            for (let i = 0; i < productDisplay.length; i++) {
              if (productDisplay[i].prodNick === e.value) {
                setSelectedProduct(productDisplay[i])
              }
            }
            for (let i = 0; i < orderData.length; i++) {
              if (orderData[i].prodNick === e.value) {
                setSelectedQty(orderData[i].newQty)
              }
            }
            console.log("Selected Product:\n", JSON.stringify(selectedProduct, null, 2))
            
          }}
          itemTemplate={option => {
            return(
              <div>
                <div>{option.prodName}</div>
                <div>{option.inCart ? "In cart" : (option.leadTime + " day lead; " + (option.isLate ? "earliest " + option.availableDate : 'available'))}</div>
              </div>
            )
          }}

        />
        <label htmlFor="productDropdown">{productData ? "Select Product" : "Loading..."}</label>
      </span>
        
      <div style={{display: "flex"}}>
        <span className="p-float-label p-fluid" style={{flex: "65%", marginTop: "28px", paddingRight: "30%"}}>
          <InputNumber id="product-qty"
            value={selectedQty}
            onChange={e => setSelectedQty(e.value)}
            disabled={selectedProduct ? selectedProduct.isLate : false}
          />
          <label htmlFor="product-qty">Quantity</label>
        </span>
      

        <Button label="Add Item"
          disabled={!selectedProdNick || !selectedQty || selectedProduct.isLate || selectedProduct.inCart}
          style={{flex: "35%", marginTop: "28px"}}
          onClick={() => {
            let newItem = { 
              orderID: null,
              prodName: selectedProduct.prodName,
              prodNick: selectedProduct.prodNick,
              locNick: location,
              originalQty: 0,
              newQty: selectedQty,
              type: "C",
              route: orderHeader.newRoute,
              ItemNote: orderHeader.newItemNote,
              rate: selectedProduct.rate,
              total: (selectedQty * selectedProduct.rate).toFixed(2)
            }

            let _orderData = [...orderData]
            const oldItem = orderData.find(item => item.prodNick === selectedProdNick)
            if (oldItem) {
              newItem.orderID = oldItem.orderID
              _orderData = _orderData.filter(item => item.prodNick !== selectedProdNick)
            }
            _orderData = [
              newItem,
              ...orderData,
            ]
            setOrderData(_orderData)
            setShowAddItem(false)
            setSelectedProdNick(null)
            setSelectedProduct(null)
            setSelectedQty(null)
            console.log("added item")
          }}
        />
      </div>

      {selectedProduct &&
      <Card 
        style={{marginTop: "10px"}}
      >
        <p>{selectedProduct.isLate ? "earliest " + selectedProduct.availableDate : 'available'}</p>
        <p>{"rate: " + selectedProduct.wholePrice}</p>
        <p>{"total: " + (selectedProduct.wholePrice * selectedQty).toFixed(2)}</p>        
      </Card>
      }

    </Sidebar>
  )
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