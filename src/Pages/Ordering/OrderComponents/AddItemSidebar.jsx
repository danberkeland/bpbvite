import React, { useState, useEffect } from "react"

import { Sidebar } from "primereact/sidebar"
import { Dropdown } from "primereact/dropdown"
import { InputNumber } from "primereact/inputnumber"
import { Button } from "primereact/button"
import { Card } from "primereact/card"

import { fetchProdsForLocation } from "../DataFetching/fetcher"

import { DateTime } from "luxon"
import { getOrderSubmitDate } from "../Functions/dateAndTime"

export const AddItemSidebar = ({data, sidebarProps, location, delivDate}) => {
  const {orderData, setOrderData} = data
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
            let _orderData = [
              { 
                orderID: null,
                prodName: selectedProduct.prodName,
                prodNick: selectedProduct.prodNick,
                locNick: location,
                originalQty: 0,
                newQty: selectedQty,
                type: "C",
                route: 'TBD',
                ItemNote: "",
                rate: selectedProduct.rate,
                total: (selectedQty * selectedProduct.rate).toFixed(2)
              },
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
  let itemsInCart = orderData.map(item => item.prodNick)

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