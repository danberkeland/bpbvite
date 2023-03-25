import React from "react"

export const IconInfoMessage = ({text, textStyle, iconClass, iconColor=null, position="left"}) => {
  const iconStyle = {
    color: iconColor
  }

  return(
    <div style={{
      marginTop: ".1rem",
      display: "flex", 
      alignContent: "center", 
      gap: ".25rem", 
      fontSize: ".9rem"
    }}>
      {!!iconClass && position === "left" && <i style={iconStyle} className={iconClass || ''} />}
      <span style={textStyle}>{text}</span>
      {!!iconClass && position === "right" && <i style={iconStyle} className={iconClass || ''} />}
    </div>
  ) 
}
