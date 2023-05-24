import React, { useState } from "react"

import { InputText } from "primereact/inputtext"

export const CartQtyInput = ({ 
  rowData, 
  cartMeta, 
  product, 
  user, 
  cartItems, 
  setCartItems, 
  disableInputs,
}) => {
  const [rollbackQty, setRollbackQty] = useState()
  const { prodNick, baseQty, qty } = rowData
  const { maxQty:userMaxQty, qtyChanged } = cartMeta[prodNick]

  const maxQty = user.authClass === 'bpbfull' ? 999 : userMaxQty
  const disableQtyInput = disableInputs 
    || (maxQty === 0 && user.authClass !== 'bpbfull')
    || (!product.defaultInclude && user.authClass !== 'bpbfull')

  const updateProductQty = (newQty) => {
    const updateQty = newQty === '' 
      ? ''
      : Math.min(maxQty, Number(newQty))
    
    setCartItems(cartItems.map(item => item.prodNick === prodNick
      ? { ...item, qty: updateQty }
      : item
    ))
  }

  return (<>
    <InputText
      value={qty}
      readOnly={disableQtyInput}
      inputMode="numeric"
      keyfilter={/[0-9]/}
      style={{
        width: "62px",
        float: "right",
        fontSize: "1.1rem",
        fontWeight: qtyChanged ? "bold" : "normal",
        opacity: rowData.qty === 0 ? ".85" : "",
        backgroundColor: qtyChanged ? 'hsl(37, 67%, 95%)' :'',
      }}
      tooltip={product.packSize > 1 
        ? `= ${(rowData.qty || 0) * product.packSize} ea`
        : ''
      }
      tooltipOptions={{ 
        event: 'focus', 
        position: 'left', 
        autoZIndex: false, 
        baseZIndex: '75'
      }}
      onClick={() => {
        if (user.authClass === 'bpbfull') console.log(rowData, product)
      }}
      onFocus={e => {
        if (!disableQtyInput) {
          e.target.select()
          setRollbackQty(parseInt(e.target.value) || 0)
        }
      }}
      onChange={(e) => updateProductQty(e.target.value)}
      onKeyDown={(e) => {
        //console.log(e)
        if (e.key === "Enter") { 
          e.target.blur();
          if (e.target.value === '') updateProductQty(0)
        }

        if (e.key === "Escape") {
          if (e.target.value === '') {
            e.target.blur()
            updateProductQty(baseQty)
            setRollbackQty(baseQty)
          } else {
            e.target.blur()
            updateProductQty(rollbackQty)
          }
        }
      }}
      onBlur={() => {
        if (rowData.qty === '') {
          updateProductQty(0)
        }
      }}
    />
    {/* <pre>{JSON.stringify([baseQty, rollbackQty])}</pre> */}
  </>)
}