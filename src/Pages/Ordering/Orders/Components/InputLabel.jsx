import React from "react"

export const InputLabel = ({ 
  htmlFor, 
  label, 
  disabled=false,
  hidden=false,
  children,
}) => {
  if (hidden) return children
  return (<>
    <label htmlFor={htmlFor}>
      <div style={{
        //transform: "translate(-1px, 0px)",
        marginBottom: "-4px",
        padding: "4px .6rem 5px .6rem",
        color: disabled ? "hsl(37, 30%, 25%)" : "hsl(37, 100%, 10%)",
        background: `hsla(37, 100%, 70%, ${disabled ? ".45" : ".85"})`,
        //border: "1px solid hsl(37, 67%, 50%)",
        borderRadius: "4px",
        width: "fit-content",
        fontSize: ".9rem",
        position: "relative",
        zIndex: "1",
        boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
         + " 0 1px 1px 0 rgba(0, 0, 0, 0.14),"
         + " 0 1px 3px 0 rgba(0, 0, 0, 0.12)",
      }}>
        {label}
      </div>
    </label>
    <div style={{
      backgroundColor: "#c59649", 
      position: "relative", 
      zIndex: "2", borderRadius: "3px"
    }}>
      {children}
    </div>
  </>
  )


};