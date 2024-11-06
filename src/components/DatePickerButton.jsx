import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { useRef } from "react"

export const DatePickerButton = ({ jsDate, onChange }) => {

  const calendarRef = useRef()
  return (
    <div style={{display: "inline-block", marginLeft: "1rem"}}>
      <Button 
        icon="pi pi-calendar"
        className="p-button-rounded" 
        onClick={() => calendarRef.current.show()}
      />
      <Calendar 
        value={jsDate}
        ref={calendarRef}
        onChange={onChange} 
        inputStyle={{visibility: "hidden", width:"0", height: "0", padding: "0"}}
        panelStyle={{transform: "translate(-.8rem, 0rem)"}}
      />
    </div>
  )
}