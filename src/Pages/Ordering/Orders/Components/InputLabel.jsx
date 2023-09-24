import { Dialog } from "primereact/dialog";
import React, { useState } from "react"

export const InputLabel = ({ 
  htmlFor, 
  label, 
  disabled=false,
  hidden=false,
  helpHeader='',
  helpText='',
  children,
}) => {
  const [showDialog, setShowDialog] = useState(false)

  if (hidden) return children
  
  return (<div>
    <label htmlFor={htmlFor}>
      <div style={{
        display: "inline-block",
        marginBottom: "-4px",
        padding: "4px .6rem 5px .6rem",
        color: disabled ? "hsl(37, 30%, 25%)" : "hsl(37, 100%, 10%)",
        background: `hsla(37, 100%, 70%, ${disabled ? ".45" : ".85"})`,
        borderRadius: "4px",
        width: "fit-content",
        fontSize: ".9rem",
        position: "relative",
        zIndex: "0",
        boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
          + " 0 1px 1px 0 rgba(0, 0, 0, 0.14),"
          + " 0 1px 3px 0 rgba(0, 0, 0, 0.12)",
      }}>
        {label}
      </div>

      {(!!helpHeader || !!helpText) && <>
        <i className="pi pi-question-circle" 
          style={{
            color: "hsl(218, 65%, 50%)",
            background: `hsla(37, 100%, 70%, ${disabled ? ".45" : ".85"})`,
            borderRadius: "8px",
            padding: ".25rem",
            marginInline: "0.5rem",
            boxShadow: "0 1px 1px -1px rgba(0, 0, 0, 0.2),"
              + " 0 1px 1px 0 rgba(0, 0, 0, 0.14),"
              + " 0 1px 3px 0 rgba(0, 0, 0, 0.12)",
          }}
          onClick={() => setShowDialog(true)}
        />
        <Dialog visible={showDialog}
          header={helpHeader}
          style={{maxWidth: '25rem'}}
          onHide={() => setShowDialog(false)}
        >
          {helpText}
        </Dialog>
      </>}
    </label>
    <div style={{
      position: "relative", 
      zIndex: "1", borderRadius: "3px",
      backgroundColor: "#c59649", // << kind of a hack to make the label 
                                    //    blend in on the page's standard 
                                    //    background color when disabling 
                                    //    adds transparency.
    }}>
      {children}
    </div>
  </div>
  )


};