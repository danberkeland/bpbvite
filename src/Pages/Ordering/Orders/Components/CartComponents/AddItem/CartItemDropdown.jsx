import React, { useState } from "react"

import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"
import { Tag } from "primereact/tag"
import { sortBy } from "lodash"
import { reformatProdName } from "../../../../Orders10/_utils/reformatProdName"
import { useListData } from "../../../../../../data/_listData"
// import { getWorkingDateTime } from "../../../../../../functions/dateAndTime"

export const CartItemDropdown = ({ 
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
}) => {
  //console.log(cartMeta)
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
    // const sameDayMaxQty = cartItem?.sameDayMaxQty 
    // const baseQty = cartItem?.baseQty
    // const qtyUpdatedOn = cartItem?.qtyUpdatedOn

    // const sameDayUpdate = 
    //   getWorkingDateTime(qtyUpdatedOn).toMillis() === ORDER_DATE_DT.toMillis()
    // const maxQty = !!cartItem 
    //   ? inProd 
    //       ? (sameDayUpdate ? sameDayMaxQty : baseQty)
    //       : 999
    //   : inProd 
    //       ? 0
    //       : 999

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

    // if (prodNick === 'brn') {
    //   console.log(inProd, inCart, maxQty === 0)
    //   console.log(errorFlag)
    // }
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
            {(recentlyDeleted && inProd) && 
              <div style={{fontSize: ".9rem"}}>Recently Deleted</div>
            }
            <div style={{fontSize: ".9rem"}}>
              {`${leadTime} day lead${inCart ? "; In cart " : ""}`}
            </div>
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

  return(<>
    <Dropdown options={displayProducts || []} 
      autoFocus={wSize !== 'lg'}
      //showOnFocus={true}
      optionLabel="prodName" 
      optionValue="prodNick"
      value={selectedProdNick || null}
      filter 
      filterBy={`prodName${user.locNick === 'backporch' ? ",prodNick" : ""}`} 
      showFilterClear 
      resetFilterOnHide 
      filterInputAutoFocus
      itemTemplate={dropdownItemTemplate}
      valueTemplate={dropdownValueTemplate}
      onChange={e => {
        console.log(products[e.value])
        setSelectedProdNick(e.value)
        setSelectedQty(cartItems.find(i => i.prodNick === e.value)?.qty || 0)
      }}
      //onHide={() => selectedProduct && inputNumberRef.current.focus()}
      placeholder={displayProducts ? "Select Product" : "Loading..."}
      style={{width: "100%"}}
      scrollHeight="20rem"
    />
    {/* <pre>{JSON.stringify(selectedProduct, null, 2)}</pre> */}
  </>)
}


/**
 * 
 * @param {String} s - Input String 
 * @param {Int} w - Column width; Max # of characters per line 
 * @returns String with newlines inserted 
 */
const wrapText = (s, w) => s.replace(
  new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
);
