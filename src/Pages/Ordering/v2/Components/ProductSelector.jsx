import React, { useRef, useState } from "react"
import { AutoComplete } from "primereact/autocomplete"
import { rankedSearch } from "../../../../utils/textSearch"
import { Button } from "primereact/button"
import { useTemplateProdsByLocNick } from "../../../../data/templateProd/useTemplateProd.js"
import { compareBy } from "../../../../utils/collectionFns.js"


const ProductSelector = ({ 
  inputRef,
  addButtonRef,
  products = [], // will get processed into options list at the component
  value,
  setValue,
  displayValue,
  setDisplayValue,
  location,
  authClass,
  disabled,
  cartChanges,
  bottomRef,
}) => {

  const { 
    data:TMP=[],
    submitMutations, 
    updateLocalData, 
    isValidating 
  } = useTemplateProdsByLocNick({ 
    shouldFetch: !!location, 
    locNick: location?.locNick 
  })

  const showDropdownOnClick = true
  const scrollToRef = true
  const searchFields = authClass === 'bpbfull' 
    ? ['prodName', 'prodNick']
    : ['prodName']

  const dropdownOptions = authClass === 'bpbfull'
    ? Object.values(products ?? {})
        .sort(compareBy(P => P.meta.reformattedProdName))
        .sort(compareBy(P => !TMP.some(tmp => tmp.prodNick === P.prodNick)))
    : Object.values(products ?? {})
        .filter(P => P.defaultInclude === true)
        .sort(compareBy(P => P.meta.reformattedProdName))
        .sort(compareBy(P => !TMP.some(tmp => tmp.prodNick === P.prodNick)))
  
  const [suggestions, setSuggestions] = useState(dropdownOptions)
    const ref = useRef(null)

  const productItemTemplate = P => {
    const inCart = 
      cartChanges?.[0]?.items?.some(item => item.prodNick === P.prodNick)

    const fav = TMP?.find(tmp => tmp.prodNick === P.prodNick) ?? null
    
    return (
      <div style={{display: "flex", justifyContent:"space-between", alignItems: "center"}}>
        <span style={{
          fontWeight: !!fav ? "Bold" : "",
          fontStyle: !!fav || !inCart ? "" : "italic",
          opacity: !!fav || !inCart ? "" : ".6",
          whiteSpace: "normal",
        }}>
          {P.meta.reformattedProdName}
        </span>
        <Button 
          icon={!!fav ? "pi pi-star-fill" : "pi pi-star"} 
          className="p-button-rounded p-button-text"  
          onClick={async e => {
            console.log(fav, P.prodNick)
            if (fav === null) {
              updateLocalData(
                await submitMutations({ createInputs: [{
                  locNick: location.locNick,
                  prodNick: P.prodNick,
                }]})
              )
            } else {
              updateLocalData(
                await submitMutations({ deleteInputs: [{ id: fav.id }]})
              )
            }
          }}
          disabled={!location || isValidating}
        />

      </div>
    )
  }
  
  return <AutoComplete
    ref={ref}
    inputRef={inputRef}
    value={disabled ? null : (displayValue ?? value)}
    field="prodName"
    placeholder={'Search for a Product'}
    itemTemplate={productItemTemplate} 
    delay={180}
    autoHighlight
    forceSelection
    spellCheck={false}
    scrollHeight="16rem"
    style={{width: "100%"}}
    inputStyle={{width: "100%"}}
    panelStyle={{maxWidth: "15rem", whiteSpace: "normal"}}
    suggestions={suggestions}
    onClick={e => {
      if (showDropdownOnClick && scrollToRef) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' })
        setTimeout(() => {
          ref.current.search(e, "", "dropdown")
        }, 250);
      }
      else if (showDropdownOnClick) ref.current.search(e, "", "dropdown")
    }}
    completeMethod={e => {
      if (e.query === "?") setSuggestions([...dropdownOptions])
      else setSuggestions(rankedSearch(e.query, dropdownOptions, searchFields))
    }}
    onFocus={e => {
      e.target.select() // auto-hilight query text
      //setRollbackValue(e.value)
    }} 
    onChange={e => {
      setDisplayValue(e.value)

      // 'typeof null' evaluates to "object"
      if (e.value !== null && typeof e.value === "object") { 
        console.log(e.value)
        setValue(e.value)
      }
    }}
    onKeyUp={e => {
      if (e.key === "Escape") {
        inputRef.current.select() // hilight text (so that you can overwrite)
      }
    }}
    onBlur={e => setDisplayValue(value)}
    onHide={() => !!value && addButtonRef.current.focus()}
    disabled={disabled}
  />

}

export {
  ProductSelector,
}
