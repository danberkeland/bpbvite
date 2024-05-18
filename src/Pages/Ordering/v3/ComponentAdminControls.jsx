import React, { useRef, useState } from "react"
import { Button } from "primereact/button"
import { AutoComplete } from "primereact/autocomplete"
import { Dialog } from "primereact/dialog"
import { rankedSearch } from "../../../utils/textSearch"
import { DBLocation } from "../../../data/types.d.js"
import { compareBy } from "../../../utils/collectionFns.js"

import "./componentAdminControls.css"

const OrderingAdminControls = ({
  authClass, 
  setAuthClass,
  
  location, 
  locations,
  changeLocation,
  disableLocationControl,
}) => {

  const [showLocationDialog, setShowLocationDialog] = useState(false)
  const toggleAuthClass = () => setAuthClass(authClass === 'bpbfull' 
    ? 'customer' 
    : 'bpbfull'
  )

  return (
    <div className="admin-panel">
      <div className="split-header">
        <h2>Admin Controls</h2> 
        <span onClick={() => setAuthClass(authClass === 'bpbfull' 
          ? 'customer' 
          : 'bpbfull'
        )}>
          view as: {authClass === 'bpbfull' ? 'admin' : 'user'}
        </span>
      </div>
      <div className="split-body"> 
        <div className="location-select-container">
          <label htmlFor="location-select">Location</label>
          <LocationSelector 
            location={location}
            onLocationChange={changeLocation}
            locations={locations}
            disabled={disableLocationControl}
          />
        </div>
        <Button label="Info" 
          className="p-button-raised"
          onClick={() => { if (!!location) setShowLocationDialog(true) }}
          disabled={disableLocationControl}
          style={{marginLeft: "auto"}}
        />
      </div>

      <Dialog 
        visible={showLocationDialog}
        onHide={() => setShowLocationDialog(false)}
        header={location?.locName}
        headerStyle={{gap: "2rem"}}
      >
        {locationDialogContent(location)}
      </Dialog>
    </div>
  )
}

export { OrderingAdminControls }


const locationDialogContent = (location) => {

  if (!location) return null
  return (
    <>
      <pre>zone: {location.zoneNick}</pre>
      {!location.zoneNick.includes('pick') && 
        <pre>
          availability: {location.latestFirstDeliv} - {location.latestFinalDeliv}
        </pre>
      }
      <pre>routes:</pre>
      {location?.meta?.servingRoutes?.map((R, idx) => 
        <pre key={`-rt-srv-${idx}`}>
          {R.routeNick} {R.timeBegin} - {R.timeEnd}
        </pre>
      )}
      <pre>{JSON.stringify(location?.meta, null, 2)}</pre>
    </>
  )
  
}


/*
Autocomplete is an interesting component because, unlike a regular dropdown...
1. you can make your own custom filter & sort function
2. you can enter your query in the display field without opening the
   dropdown panel

These two points make Autocomplete feel much nicer to interact with, but the
implementation is kinda quirky, especially when dealing it operates on an
array of object data. I think this has to do with how Autocomplete seems to be
a weird mashup of a combobox and text input.

When selecting an item from the dropdown panel, the onChange event value is
the data object for that item, but when typing a search query, the event value
is your input string. So, we need to be a little more clever than blindly 
hooking onChange up with our value's state setter. If the state value is the
object, and other functionality depends on this object, we dont' want it 
suddenly becoming a string.
*/

/**
 * Generic, in-house version of autocomplete that comes prepackaged
 * with some features considered useful for any scenario -- mostly the
 * custom text search function, plus some eventing to make interaction
 * more natural.
 */
const SearchBar = ({ 
  value,
  setValue,
  onValueChange,
  displayField, 
  displayValue,
  setDisplayValue,
  placeholder="Search (type '?' to show all)",
  data=[], 
  searchFields,
  itemTemplate,
  style,
  inputStyle,
  panelStyle,
  panelClassName,
  dropdown, // controls display of dropdown button on the side
  showDropdownOnClick,
  scrollToRef,
  disabled,
  id,
}) => {

  const [suggestions, setSuggestions] = useState(data)
  const ref = useRef(null)
  const inputRef = useRef(null)
  
  return <AutoComplete
    id={id}
    ref={ref}
    inputRef={inputRef}
    field={displayField}
    value={disabled ? null : (displayValue ?? value)}
    placeholder={placeholder}
    itemTemplate={itemTemplate} 
    delay={150}
    dropdown={dropdown}
    autoHighlight
    forceSelection
    spellCheck={false}
    scrollHeight="16rem"
    style={style}
    inputStyle={inputStyle}
    panelStyle={panelStyle}
    panelClassName={panelClassName}
    suggestions={suggestions}
    onClick={e => {
      if (showDropdownOnClick && scrollToRef) {
        scrollToRef.current.scrollIntoView({ behavior: 'smooth' })
        setTimeout(() => {
          ref.current.search(e, "", "dropdown")
        }, 250);
      }
      else if (showDropdownOnClick) ref.current.search(e, "", "dropdown")
    }}
    completeMethod={e => {
      if (e.query === "?") setSuggestions([...data])
      else setSuggestions(rankedSearch(e.query, data, searchFields))
    }}
    onFocus={e => {
      e.target.select() // auto-hilight query text
      //setRollbackValue(e.value)
    }} 
    onChange={e => { // the underlying combobox's(?) 'onChange'
      // console.log("change", e.value)
      setDisplayValue(e.value)

      // Fun Javascript jank for you to try out: 
      // typeof null evaluates to "object" for some reason...
      if (e.value !== null && typeof e.value === "object") { 
        console.log(e.value)
        onValueChange(e.value)
        //setValue(e.value)
      }
    }}
    onKeyUp={e => {
      if (e.key === "Escape") {
        inputRef.current.select() // hilight text (so that you can overwrite)
      }
    }}
    onBlur={e => {
      // console.log(e, e.target.value)
      setDisplayValue(value)
    }}
    disabled={disabled}
  />
}




const locationSelectorItemTemplate = option => 
  <>
    <div>{option.locName}</div>
    <pre style={{fontSize: ".8rem", margin: "0rem"}}>
      {option.locNick}
    </pre>
  </>


/**
 * @typedef {Object} LocationSelectorProps
 * @property {DBLocation} location
 * @property {Function} onLocationChange
 * @property {DBLocation[]} locations
 * @property {boolean} disabled
 */

/**
 * 
 * @param {LocationSelectorProps} props 
 * @returns 
 */
const LocationSelector = ({
  location,
  locations,
  onLocationChange,
  disabled
}) => {

  const [displayValue, setDisplayValue] = useState(null)

  return (
    <SearchBar
      id="location-select"
      value={location}
      onValueChange={onLocationChange}
      displayValue={displayValue}
      setDisplayValue={setDisplayValue}
      displayField="locName"
      data={locations?.sort(compareBy(L => L.locName)) ?? []}
      searchFields={['locNick', 'locName']}
      itemTemplate={locationSelectorItemTemplate}
      placeholder={disabled ? "" : undefined}
      dropdown={false}
      disabled={disabled}
      inputStyle={{width: "100%", borderColor: "rgba(144, 144, 144, 0.95)", padding: "4px 6px" }}
      style={{display: "block"}}
    />
  )

}