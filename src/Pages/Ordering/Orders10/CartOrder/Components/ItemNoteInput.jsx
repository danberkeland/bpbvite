import React from "react"

import { InputTextarea } from "primereact/inputtextarea"

export const ItemNoteInput = ({ headerChanges, setHeaderChanges }) => {
  return (
    <div className="bpb-inputtext" style={{padding: ".5rem"}}>
      <InputTextarea
        id="input-note"
        style={{width: "100%"}}
        rows={3}
        autoResize
        value={headerChanges?.ItemNote}
        onChange={(e) => setHeaderChanges({ ...headerChanges,ItemNote: e.target.value })}
        placeholder="(Optional) Note:"
        //disabled={readOnly}
      />
    </div>
  )
}
