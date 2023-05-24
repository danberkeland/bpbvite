import React, { useState } from "react"
import { InputText } from "primereact/inputtext"

export const StandingQtyInput = ({ 
  item, 
  baseItem, 
  product,
  disabled,
  updateStanding, 
  maxQty=999,
  wSize,
}) => {
  const [rollbackQty, setRollbackQty] = useState('')
  
  const itemQty = item?.qty ?? 0
  const baseQty = baseItem?.qty ?? 0
  const qtyChanged = item?.qty !== baseQty

  return (
    <InputText 
      value={itemQty}
      inputMode="numeric"
      keyfilter={/[0-9]/}
      onFocus={e => {
        e.target.select()
        setRollbackQty(parseInt(e.target.value) || 0)
      }}
      tooltip={product?.packSize > 1 
        ? `= ${(item.qty || 0) * product.packSize} ea`
        : ''
      }
      tooltipOptions={{ 
        event: 'focus', 
        position: 'left', 
        autoZIndex: false, 
        baseZIndex: '75'
      }}
      onChange={e => {
        if (e.target.value === '') updateStanding('')
        else updateStanding(Math.min(maxQty, Number(e.target.value)))

      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.target.blur()
          updateStanding(Number(e.target.value))
        }
        else if (e.key === "Escape") {
          e.target.blur()
          if (e.target.value === '') updateStanding(baseQty)
          else updateStanding(rollbackQty)
        }

      }}
      onBlur={e => updateStanding(Number(e.target.value))}
      style={{
        width: wSize === 'lg' ? "3rem" : "62px",
        fontWeight: qtyChanged ? "bold" : "normal",
      }}
      disabled={disabled}
    />
  )


}
