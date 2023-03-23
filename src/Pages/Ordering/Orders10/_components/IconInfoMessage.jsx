import React from "react"

export const IconInfoMessage = ({text, iconClass, position="left"}) => {

  return(
    <div style={{
      display: "flex", 
      alignContent: "center", 
      gap: ".25rem", 
      fontSize: ".9rem"
    }}>
      {!!iconClass && position === "left" && <i className={iconClass || ''} />}
      <span>{text}</span>
      {!!iconClass && position === "right" && <i className={iconClass || ''} />}
    </div>
  ) 
}
