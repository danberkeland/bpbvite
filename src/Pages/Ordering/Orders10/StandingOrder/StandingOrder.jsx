import React, { useState } from "react"

export const StandingOrder = ({ user, locNick }) => {
  // standing::admin state
  const [isStand, setIsStand] = useState(true)
  const [isWhole, setIsWhole] = useState(true)
  
  // standing::public state
  const [dayOfWeek, setDayOfWeek] = useState(null)  
  
  return(<div>Standing Order</div>)

}