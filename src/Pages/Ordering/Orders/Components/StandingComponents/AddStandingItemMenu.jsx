import React, { useState } from "react"

import { cloneDeep, sortBy } from "lodash"
import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"
import { Card } from "primereact/card"
import { wrapText } from "../../../utils/wrapText"
import { reformatProdName } from "../../functions/reformatProdName"
import { Tag } from "primereact/tag"
import { useListData } from "../../../../../data/_listData"
import { Sidebar } from "primereact/sidebar"

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const AddStandingItemMenu = ({ 
  standingItems, setStandingItems, 
  products,
  wSize, 
  locNick, 
  user,
  disabled,
  showStandingSidebar,
  setShowStandingSidebar,
  //selectedDisplayProdNick,
  setSelectedDisplayProdNick,
  cardStyle,
}) => {
  const [selectedAddProdNick, setSelectedAddProdNick] = useState()
  const selectedAddProduct = products?.[selectedAddProdNick] ?? {}

  const { 
    submitMutations:submitFavs, 
    updateLocalData:updateFavs
  } = useListData({ tableName: "TemplateProd", shouldFetch: true })
  


  const toggleFav = async (favItem, prodNick) => {
    !!favItem
      ? updateFavs(await submitFavs({ deleteInputs: [{ id: favItem.id }] }))
      : updateFavs(await submitFavs({ createInputs: [{ locNick, prodNick }] }))
  }

  const dropdownProps = {
    products,
    selectedAddProdNick, 
    setSelectedAddProdNick,
    // setShowStandingSidebar,
    toggleFav,
    wSize,
    user,
    disabled,
  }

  const handleAddStandingProduct = () => {
    const newItems = Object.fromEntries(
      weekdays.map(dayOfWeek => {
        const key = `${selectedAddProdNick}#${dayOfWeek}`
        const item = { 
          prodNick:selectedAddProdNick, 
          dayOfWeek, 
          qty: 0,
        }
        return [key, item]
      })
    )
    console.log("newItems", newItems)
    setStandingItems({ ...newItems, ...cloneDeep(standingItems) })

    setSelectedDisplayProdNick(selectedAddProdNick)

  }

  

  const sidebarHeaderTemplate = () => {
    return (
      <div style={{fontSize: "1.25rem", color: "hsl(37, 100%, 10%)" }}>
        Add to Standing Order
      </div>
    )
  }


  const footerTemplate = (
    <div style={{display: "flex", justifyContent: "flex-end", gap: "2rem"}}>
            
      <Button label={"Add"} 
        style={{
          width: "5.5rem", 
          fontSize: "1.1rem"
        }}
        disabled={!selectedAddProdNick || disabled}
        onClick={() => {
          handleAddStandingProduct()
          setSelectedAddProdNick('')
          setShowStandingSidebar(false)
        }}

      />
    </div>
  )

  return (<div>
    {wSize === 'lg' &&
      <Card
        title={() => 
          <span style={{fontSize: "1.25rem"}}>Add a Product</span>
        }
        //footer={footerTemplate}
        style={cardStyle}
        footer={footerTemplate}
      >
        <StandingProductDropdown 
          {...dropdownProps}
        />
      </Card>
    }
    {wSize !== 'lg' &&
      <Sidebar
        visible={showStandingSidebar || selectedAddProdNick}
        onHide={() => {
          setShowStandingSidebar(false)
          setSelectedAddProdNick('')
        }}  
        blockScroll={true}
        icons={sidebarHeaderTemplate}
        position="top"
        style={{height: "15.75rem"}}    
        //footer={footerTemplate}
      >
        <div style={{marginTop: ".25rem"}}>
          <StandingProductDropdown 
            {...dropdownProps}
          />
        </div>
        <div className="info-message-box" 
          style={{ minHeight: "3rem", margin: "1rem .5rem", fontSize: ".9rem"}}
        >
          
        </div>
        <div style={{marginInline: "1rem"}}>
          {footerTemplate}  
        </div>
      </Sidebar>
    }
  </div>)

}



const StandingProductDropdown = ({
  products,
  selectedAddProdNick, 
  setSelectedAddProdNick,
  // setShowStandingSidebar,
  toggleFav,
  wSize,
  user,
  disabled,
}) => {
  const [isValidating, setIsValidating] = useState()

  const displayProducts = user.authClass === 'bpbfull'
    ? Object.values(products ?? {})
    : Object.values(products ?? {}).filter(product => product.defaultInclude)

  const dropdownItemTemplate = (product) => {
    if (!product) return 

    const { prodNick, prodName, packSize, templateProd, defaultInclude } = product
    const { assignedRouteSummary } = product.meta
    const { isValid, isAvailable, leadTime, inProd } = assignedRouteSummary


    const prodNameDisplayText = wrapText(
      reformatProdName(prodName, packSize), 
      wSize === 'lg' ? 35 : 27
    ).split('\n')
    
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
            {!defaultInclude && user.authClass === 'bpbfull' &&
              <Tag
                value="Disabled Item" 
                severity='danger' 
                icon="pi pi-exclamation-circle"
                style={{background: "#BF0404"}}
              />
            }
          </div>

        </div>
        <Button icon={favIcon}
          onClick={async e => {
            e.preventDefault(); e.stopPropagation()
            setIsValidating(true)
            toggleFav(favItem, prodNick)
            setIsValidating(false)
          }} 
          className="p-button-text p-button-rounded"
          disabled={isValidating || disabled}
          style={{width: "2.5rem"}}
        />
      </div>
    )
  }

  return(
    <Dropdown 
      options={sortBy(
        displayProducts,
        [product => !product.templateProd.items[0], 'prodName']
      )} 
      autoFocus={wSize !== 'lg'}
      //showOnFocus={true}
      optionLabel="prodName" 
      optionValue="prodNick"
      value={selectedAddProdNick || null}
      filter 
      filterBy={`prodName${user.locNick === 'backporch' ? ",prodNick" : ""}`} 
      showFilterClear 
      resetFilterOnHide 
      filterInputAutoFocus
      itemTemplate={dropdownItemTemplate}
      //valueTemplate={dropdownValueTemplate}
      onChange={e => {
        console.log(products[e.value])
        setSelectedAddProdNick(e.value)
        // setShowStandingSidebar(true)
      }}
      //onHide={() => selectedProduct && inputNumberRef.current.focus()}
      //placeholder={displayProducts ? "Select Product" : "Loading..."}
      style={{width: "100%"}}
      scrollHeight="20rem"
      disabled={disabled}
    />
  )

}