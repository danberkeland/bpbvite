import { sortBy } from "lodash"

export const handleAddItem = (
  products, selectedProduct, selectedQty, cartItems, setCartItems
) => {
  const { prodNick } = selectedProduct
  const cartItem = cartItems.find(i => i.prodNick === prodNick)
  if (cartItem) { 
    setCartItems(cartItems.map(item => 
      item.prodNick === prodNick
        ? { ...item, qty: selectedQty }
        : item
    ))
  } else {
    const newItem = {
      id: null,
      prodNick: selectedProduct.prodNick,
      qty: selectedQty,
      qtyUpdatedOn: null,
      sameDayMaxQty: 0,
      rate: selectedProduct.wholePrice,
      createdOn: null,
      updatedOn: null,
      updatedBy: null,
      orderType: 'C',
      ttl: null,
      baseQty: 0,
    }
    
    // const _cart = sortBy(
    //   cartItems.concat(newItem), 
    //   item => products[item.prodNick].prodName
    // )

    // setCartItems(_cart)
    setCartItems(cartItems.concat(newItem))

  }
} 