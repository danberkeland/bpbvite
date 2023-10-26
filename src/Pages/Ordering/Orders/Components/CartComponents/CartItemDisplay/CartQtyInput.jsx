import React, { useState } from "react"

import { InputText } from "primereact/inputtext"
import { DateTime } from "luxon"

export const CartQtyInput = ({ 
  rowData, 
  cartMeta, 
  product, 
  user, 
  cartItems, 
  setCartItems, 
  disableInputs,
  deactivated,
}) => {
  const { prodNick, baseQty, qty } = rowData
  const { maxQty:userMaxQty, qtyChanged } = cartMeta[prodNick]
  const [rollbackQty, setRollbackQty] = useState()
  //const [inputStr, setInputStr] = useState(qty)
  
  const maxQty = user.authClass === 'bpbfull' ? 999 : userMaxQty
  const disableQtyInput = disableInputs 
    || (maxQty === 0 && user.authClass !== 'bpbfull')
    || (!product.defaultInclude && user.authClass !== 'bpbfull')
    || deactivated

  const updateProductQty = (newQty) => {
    const inputIsValid = /^\d{0,3}$/.test(newQty)
    if (!inputIsValid) return

    const updateQty = newQty === '' 
      ? ''
      : Math.min(maxQty, Number(newQty))
    
    setCartItems(cartItems.map(item => item.prodNick === prodNick
      ? { ...item, qty: updateQty }
      : item
    ))
  }

  // const handleChange = (value) => {
  //   const inputIsValid = /^[+-]?\d{0,3}$/.test(value)
  //   if (!inputIsValid) return

  //   console.log(value, typeof(value))

  //   let newQty = 0
  //   let newInputStr = ''

  //   if (value[0] === '+') {
  //     const addQty = value.slice(1)
  //     newQty = Math.min(maxQty, Number(rollbackQty) + Number(addQty))
  //     newInputStr = addQty === '' 
  //       ? '+' 
  //       : '+' + ((newQty - Number(rollbackQty)) || '')

  //     console.log('addQty', addQty)

  //   } else if (value[0] === '-') {
  //     const subQty = value.slice(1)
  //     newQty = Math.max(0, Number(rollbackQty) - Number(subQty))
  //     newInputStr = value === '-'
  //       ? '-'
  //       : '-' + ((Number(rollbackQty) - newQty) || '')

  //   } else {
  //     newQty = Number(value)
  //     newInputStr = value

  //   }

  //   // console.log('newQty:', newQty)
  //   // console.log('newInputStr:', newInputStr)
  //   setCartItems(cartItems.map(item => item.prodNick === prodNick
  //     ? { ...item, qty: newQty }
  //     : item
  //   ))
  //   setInputStr(newInputStr)

  // }

  const inputStyle = {
    width: "62px",
    float: "right",
    fontSize: "1.1rem",
    fontWeight: qtyChanged ? "bold" : "normal",
    opacity: rowData.qty === 0 ? ".85" : "",
    backgroundColor: qtyChanged ? 'hsl(37, 67%, 95%)' :'',
    marginBlock: "0px",
  }

  //if (!rowData) return <InputText style={inputStyle} readOnly={true} />

  return (<>
    <InputText
      value={qty}
      //value={inputStr}
      readOnly={disableQtyInput}
      inputMode="numeric"
      keyfilter={/[0-9]/}
      //keyfilter={/[0-9+-]/}
      autoComplete="off"
      style={inputStyle}
      // tooltip={product.packSize > 1 
      //   ? `= ${(rowData.qty || 0) * product.packSize} ea`
      //   : ''
      // }
      // tooltipOptions={{ 
      //   event: 'focus', 
      //   position: 'left', 
      //   autoZIndex: false, 
      //   baseZIndex: '75'
      // }}
      onClick={() => {
        if (user.authClass === 'bpbfull') {
          console.log(rowData, product)
          console.log(
            DateTime.fromISO(rowData.updatedOn)
              .setZone('America/Los_Angeles')
              .toFormat('EEE MMM d t')
          )
        }
      }}
      onFocus={e => {
        if (!disableQtyInput) {
          e.target.select()
          setRollbackQty(parseInt(e.target.value) || 0)
        }
      }}
      onChange={(e) => {
        updateProductQty(e.target.value)
        //handleChange(e.target.value)
      }} 
      onKeyDown={(e) => {
        //console.log(e)
        if (e.key === "Enter") { 
          e.target.blur();
          if (e.target.value === '') {
            updateProductQty(0)
            //handleChange(0)
          } 
        }

        if (e.key === "Escape") {
          if (e.target.value === '') {
            e.target.blur()
            updateProductQty(baseQty)
            //handleChange(baseQty) 
            setRollbackQty(baseQty)
          } else {
            e.target.blur()
            updateProductQty(rollbackQty)
            //handleChange(rollbackQty) 
          }
        }
      }}
      onBlur={() => {
        if (rowData.qty === '') {
          updateProductQty(0)
          //handleChange(0) 
        } //else { handleChange(qty) }
      }}
    />
    {/* <pre>{JSON.stringify([baseQty, rollbackQty])}</pre> */}
  </>)
}