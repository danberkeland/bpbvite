import { Dropdown } from "primereact/dropdown"

const weekdaysE = ["Su ", "Mo ", "Tu ", "We ", "Th ", "Fr ", "Sa"]

export const CartFulfillmentDropdown = ({
  options,
  currentOption,
  handleChange,
  delivDT
}) => {

  const itemTemplate = option => 
    <div style={{color: "var(--bpb-text-color)"}}>
      <div>{option.label + (option.isDefault ? " (Default)" : "")}</div>
      {option.validDays.some(flag => flag === false) &&
        <div style={{fontSize: ".8rem", fontFamily: "monospace"}}>
          available: {option.validDays.map((isValid, idx) => 
            <span style={isValid ? { fontWeight: "bold" } : {opacity: "0.5"}}>
              {weekdaysE[idx]}
            </span>
          )}
        </div>
      }
    </div>

  const valueTemplate = option => !!option
    ? <span style={{display: "flex", gap: ".5rem", alignItems: "center" }}>
        {option.label}
        {!option.validDays[delivDT.weekday % 7] && <i className="pi pi-exclamation-triangle" style={{fontSize: "1.25rem"}} />}
      </span>
    : <span style={{color: "transparent"}}>{'loading'}</span>

  return (<>
    <label htmlFor='cart-header-ffl-input' style={{display: "block"}}>
      Fulfillment:
    </label>
    <Dropdown 
      id='cart-header-ffl-input'
      className="cart-header-dropdown"
      value={currentOption}
      options={options}
      itemTemplate={itemTemplate}
      valueTemplate={valueTemplate}
      onChange={e => handleChange(e.value)}
      style={{width: "100%", fontSize: "1.5rem", marginBottom: ".5rem"}}
    />
  </>)

}