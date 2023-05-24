import React, { useState } from "react"

import { InputText } from "primereact/inputtext"

export const AddItemQtyInput = ({ 
  selectedProduct:product,
  selectedQty:qty, 
  setSelectedQty:setQty, 
  maxQty,
  baseQty,
  user,
  disableInputs,
}) => {
  const [rollbackQty, setRollbackQty] = useState()
  const packSize = product?.packSize ?? 1

  const handleQtyChange = newQty => newQty === '' 
    ? setQty('')
    : setQty( Math.min(Number(maxQty), Number(newQty)) )

  return (<>
    <InputText
      value={qty}
      placeholder={"Qty"}
      inputMode="numeric"
      keyfilter={/[0-9]/}
      style={{
        width: "62px",
        float: "right",
        fontSize: "1.1rem",
        //: (qty !== baseQty) ? "bold" : "normal",
        //opacity: qty === 0 ? ".70" : "",
        backgroundColor: (qty !== baseQty && qty !== '') ? 'hsl(37, 67%, 95%)' :'',
      }}
      tooltip={packSize > 1 
        ? `= ${(qty || 0) * packSize} ea`
        : ''
      }
      tooltipOptions={{ 
        event: 'focus', 
        position: 'left', 
        autoZIndex: false, 
        baseZIndex: '75'
      }}
      onClick={() => {
        if (user.authClass === 'bpbfull') {
          console.log("Selected Product:", product)}
        }
      }
      readOnly={disableInputs || (maxQty === 0)}
      onFocus={e => {
        setRollbackQty(parseInt(e.target.value) || 0)
        if (!(disableInputs || (maxQty === 0))) e.target.select()
      }}
      onChange={(e) => handleQtyChange(e.target.value)}
      onKeyDown={(e) => { //console.log(e)
        if (e.key === "Enter") { 
          e.target.blur()
          if (e.target.value === '') handleQtyChange(0)
        }

        if (e.key === "Escape") {
          if (e.target.value === '') {
            e.target.blur()
            handleQtyChange(baseQty)
            setRollbackQty(baseQty)
          } else {
            e.target.blur()
            handleQtyChange(rollbackQty)
          }
        }
      }}
      onBlur={() => { if (!!product && qty === '')  handleQtyChange(0) }}
    />
  </>)
} // end qtyColumnTemplate