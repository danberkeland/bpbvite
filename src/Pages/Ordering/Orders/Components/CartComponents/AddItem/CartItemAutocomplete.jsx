import React, { useState } from "react"

import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"
import { AutoComplete } from "primereact/autocomplete"
import { Tag } from "primereact/tag"
import { sortBy } from "lodash"
import { reformatProdName } from "../../../../Orders10/_utils/reformatProdName"
import { useListData } from "../../../../../../data/_listData"
// import { getWorkingDateTime } from "../../../../../../functions/dateAndTime"

export const CartItemAutoComplete = ({ 
  products,
  cartHeader, 
  cartItems,
  cartMeta,
  user,
  wSize,
  setSelectedQty,
  selectedProdNick,
  setSelectedProdNick,
  ORDER_DATE_DT,
  qtyInputRef,
  dropdownRef,
}) => {
  //console.log(cartMeta)
  const [selectedProduct, setSelectedProduct] = useState()
  const [suggestions, setSuggestions] = useState([])
  const { 
    submitMutations:submitFavs, 
    updateLocalData:updateFavs
  } = useListData({ tableName: "TemplateProd", shouldFetch: true })
  const [isValidating, setIsValidating] = useState(false)

  if (!products || !cartHeader || !cartItems) return "loading..."

  const locNick = cartHeader?.locNick ?? ''
  const _filteredList = user.authClass === 'bpbfull' 
    ? Object.values(products) || []
    : Object.values(products).filter(P => P.defaultInclude) || []
  const displayProducts = sortBy(
    _filteredList, 
    [
      product => !product.templateProd.items[0],
      'prodName', 
    ]
  )

  const dropdownItemTemplate = (product) => {
    const { prodNick, prodName, packSize, templateProd, defaultInclude} = product
    const { assignedRouteSummary } = product.meta
    const { 
      isValid, 
      // isAvailable, 
      leadTime, 
      inProd 
    } = assignedRouteSummary

    const cartItem = cartItems.find(item => item.prodNick === prodNick)
    const inCart = !!cartItem && cartItem.qty !== 0

    const maxQty = cartMeta?.[prodNick]?.maxQty ?? 0

    const recentlyDeleted = !!cartItem && cartItem.baseQty === 0 
      && cartItem?.meta?.sameDayUpdate


    const prodNameDisplayText =
      wrapText(
        reformatProdName(prodName, packSize), 
        wSize === 'lg' ? 35 : 27
      ).split('\n')
    
    const errorFlag = inProd && maxQty === 0
    const warnFlag = !isValid
    const infoFlag = inProd && maxQty !== 0
    //const severity = errorFlag ? "error" : warnFlag ? "warn" : "info"

    const favItem = templateProd.items[0]
    const isFav = !!favItem
    const favIcon = isFav ? "pi pi-star-fill" : "pi pi-star"
    return(
      <div className='dropdown-item-box'
        style={{
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center"
        }}
      >
        <div className='summary-box'
          style={{
            width: "100%", 
            display: "flex", 
            justifyContent:"space-between", 
            alignItems: "center"
          }}
        >
          <div className="text-summary-left"
            style={{width: "fit-content"}}
          >
            {prodNameDisplayText.map((line, idx) => 
              <div key={`${product.prodNick}-${idx}`}
                style={{fontWeight: isFav ? "bold" : "normal"}} 
              >
                {line}
              </div>
            )}
            {/* {(recentlyDeleted && inProd) && 
              <div style={{fontSize: ".9rem"}}>Recently Deleted</div>
            } */}
            {!warnFlag &&   
              <div style={{fontSize: ".9rem"}}>
                {`${leadTime} day lead${inCart ? "; In cart " : ""}`}
              </div>
            }
            {!defaultInclude && user.authClass === 'bpbfull' &&
              <Tag 
                severity='danger' 
                value="Not Allowed" 
                icon="pi pi-exclamation-circle"
                style={{background: "#BF0404"}}
              />
            }
          </div>
          <i className={errorFlag ? "pi pi-times" 
              : warnFlag ? "pi pi-exclamation-triangle"
              : infoFlag ? "pi pi-info-circle"
              : ""
            } 
            style={{
              fontSize: "1.25rem", 
              marginRight: ".5rem", 
              color: errorFlag ? "#BF0404" 
                : warnFlag ? "hsl(45, 96%, 35%)" 
                : infoFlag ? "hsl(218, 43%, 50%)"
                : "",
            }}
          />
        </div>
        <Button icon={favIcon}
          onClick={async e => {
            e.preventDefault(); e.stopPropagation(); setIsValidating(true)
            if (!!favItem) {
              updateFavs(await submitFavs(
                { deleteInputs: [{ id: favItem.id }]}
              ))
            } else {
              updateFavs(await submitFavs(
                { createInputs: [{ locNick, prodNick }]}
              ))
            }
            setIsValidating(false)
          }} 
          className="p-button-text p-button-rounded"
          disabled={
            isValidating
            // || locNick !== user.locNick 
          }
          style={{width: "2.5rem"}}
        />
      </div>
    )
  }

  const dropdownValueTemplate = (product, props) => {
    if (!product) return <span>{props.placeholder}</span>

    const { prodName, packSize, templateProd } = product
    const isFav = !!templateProd.items[0]
    if (product) return(
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div>{reformatProdName(prodName, packSize) || ''}</div>
        {isFav && <i className="pi pi-star-fill"/>}
      </div>
    )

  }
  
  const search = (event) => {
    const query = event.query.toLowerCase().replace(/\s/g, '')

    if (!query) setSuggestions(displayProducts)
    else {
      let results = displayProducts.filter(P => 
        P.prodNick.includes(query) 
        || P.prodName.replace(/\s/g, '').toLowerCase().includes(query)
      )
      
      if (!results.length) results = displayProducts

      results = results.map(P => {
        let d1 = levenshteinDistance(P.prodNick, query)
        let d2 = levenshteinDistance(P.prodName.toLowerCase(), query)
        let score = Math.min(d1, d2)

        return { ...P, score }
      })

      setSuggestions(sortBy(results, 'score').slice(0,10))

    }

  }

  return (
    <AutoComplete 
      id="product-dropdown"
      value={selectedProduct || null}
      field="prodName"
      suggestions={suggestions || []}
      completeMethod={search}
      dropdown={true}
      itemTemplate={dropdownItemTemplate}
      //selectedItemTemplate={dropdownValueTemplate}
      autoHighlight
      forceSelection
      delay={50}
      spellCheck="false"

      onFocus={e => e.target.select()}
      onChange={e => {
        // console.log(products[e.value])
        setSelectedProduct(e.value)
        setSelectedProdNick(e.value?.prodNick)
        setSelectedQty(cartItems.find(i => i.prodNick === e.value)?.qty || 0)
      }}
      onHide={() => selectedProdNick && qtyInputRef.current.focus()}
      placeholder={displayProducts ? "Select Product" : "Loading..."}
      style={{width: "100%"}}
      scrollHeight="16rem"
      inputRef={dropdownRef}
    />
  )

  // return(<>
  //   <Dropdown
  //     id="dropdown"
  //     options={displayProducts || []} 
  //     autoFocus={wSize !== 'lg'}
  //     //showOnFocus={true}
  //     optionLabel="prodName" 
  //     optionValue="prodNick"
  //     value={selectedProdNick || null}
  //     filter 
  //     filterBy={`prodName${user.locNick === 'backporch' ? ",prodNick" : ""}`} 
  //     showFilterClear 
  //     resetFilterOnHide 
  //     filterInputAutoFocus
  //     itemTemplate={dropdownItemTemplate}
  //     valueTemplate={dropdownValueTemplate}
  //     onChange={e => {
  //       // console.log(products[e.value])
  //       setSelectedProdNick(e.value)
  //       setSelectedQty(cartItems.find(i => i.prodNick === e.value)?.qty || 0)
  //     }}
  //     onHide={() => selectedProdNick && qtyInputRef.current.focus()}
  //     // onKeyUp={e => {
  //     //   if (e.key === 'Enter' && !!selectedProdNick) {
  //     //     qtyInputRef.current.focus()
  //     //   }
  //     // }}
  //     onClick={() => selectedProdNick && qtyInputRef.current.focus()}
  //     placeholder={displayProducts ? "Select Product" : "Loading..."}
  //     style={{width: "100%"}}
  //     scrollHeight="20rem"
  //     ref={dropdownRef}
  //   />
  //   {/* <pre>{JSON.stringify(selectedProduct, null, 2)}</pre> */}
  // </>)
}


/**
 * @param {string} s - Input String 
 * @param {number} w - Column width; Max # of characters per line 
 * @returns String with newlines inserted 
 */
const wrapText = (s, w) => s.replace(
  new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
);


const levenshteinDistance = (s, t) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[t.length][s.length];
};