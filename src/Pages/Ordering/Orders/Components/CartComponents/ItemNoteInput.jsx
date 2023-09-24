import React from "react"

import { InputTextarea } from "primereact/inputtextarea"
import { InputLabel } from "../InputLabel"

export const ItemNoteInput = ({ 
  cartHeader, setCartHeader, disabled 
}) => {
  return (<>
      <InputLabel label="Delivery Note" 
        htmlFor="input-note"
        disabled={disabled}
        helpHeader="Delivery Note"
        helpText={<>
          <p>
            Delivery notes will be printed on our paper invoices and are 
            meant to assist with your own record keeping.
          </p>
          <p>
            For now, we're better equipped to handle special requests for your order
            through the hotline.
          </p>
        </>}
      >
        {/* <div id="with-box-shadow"> */}
          <InputTextarea
            style={{
              width: "100%",
              border: "none",
              boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
                + " 0 1px 1px 0 rgba(0, 0, 0, 0.14),"
                + " 0 1px 3px 0 rgba(0, 0, 0, 0.12)",
            }}
            id="input-note"
            rows={2}
            maxLength={127}
            autoResize
            value={cartHeader?.ItemNote}
            onChange={e => setCartHeader({ 
              ...cartHeader, 
              ItemNote: e.target.value 
            })}
            placeholder="(Optional; for your own records)"
            //disabled={disabled}
            readOnly={disabled}
          />
        {/* </div> */}
      </InputLabel>
  </>)
}
