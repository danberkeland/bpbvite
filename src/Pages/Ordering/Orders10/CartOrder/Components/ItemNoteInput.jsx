import React from "react"

import { InputTextarea } from "primereact/inputtextarea"

export const ItemNoteInput = ({ headerChanges, setHeaderChanges, disabled }) => {
  return (
      <InputTextarea
        id="input-note"
        style={{width: "100%"}}
        rows={3}
        autoResize
        value={headerChanges?.ItemNote}
        onChange={(e) => setHeaderChanges({ ...headerChanges,ItemNote: e.target.value })}
        placeholder="(Optional) Note:"
        disabled={disabled}
        //disabled={readOnly}
      />
  )
}
