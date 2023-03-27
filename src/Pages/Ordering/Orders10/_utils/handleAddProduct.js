// Originally used in add item sidebar, but now used in cli

export const handleAddCartProduct = (product, qty, cartItemChanges, setCartItemChanges) => {
  let _cartItemChanges = [...cartItemChanges]
  let oldItem = cartItemChanges.find(item => 
    item.product.prodNick === product.prodNick
  )
  let newItem
  
  if (oldItem) {
    // case: update qty on an existing cart order
    _cartItemChanges = cartItemChanges.map(item => 
      item.product.prodNick === product.prodNick
        ? { ...item, qty: qty}
        : { ...item }  
    )
  } else {
    // case: create a new cart item
    newItem = { 
      id: null,
      product: {
        prodNick: product.prodNick,
        prodName: product.prodName,
        leadTime: product.leadTime,
        packSize: product.packSize
      },
      qty: qty,
      orderType: "C",
      rate: product.wholePrice,
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

export const handleAddCartProducts = (items, cartItemChanges, setCartItemChanges) => {
  let _cartItemChanges = [...cartItemChanges]

  for (let item of items) {
    let { product, qty } = item
    console.log(product, qty)
    
    let oldItem = _cartItemChanges.find(item => 
      item.product.prodNick === product.prodNick
    )
    let newItem
    
    if (oldItem) {
      // case: update qty on an existing cart order
      _cartItemChanges = _cartItemChanges.map(item => 
        item.product.prodNick === product.prodNick
          ? { ...item, qty: qty}
          : { ...item }  
      )
    } else {
      // case: create a new cart item
      newItem = { 
        id: null,
        product: {
          prodNick: product.prodNick,
          prodName: product.prodName,
          leadTime: product.leadTime,
          packSize: product.packSize
        },
        qty: qty,
        orderType: "C",
        rate: product.wholePrice,
        action: "CREATE"
      }
      _cartItemChanges = [ ..._cartItemChanges].concat(newItem)

    }
    console.log("CIC", _cartItemChanges)

  } // end for item of items...

  _cartItemChanges.sort((a, b) => {
    if (a.product.prodName < b.product.prodName) return -1
    if (a.product.prodName > b.product.prodName) return 1
    return 0
  })

  setCartItemChanges(_cartItemChanges)

}