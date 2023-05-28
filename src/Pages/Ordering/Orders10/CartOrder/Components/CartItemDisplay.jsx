import React, {useState} from "react"

import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
// import { InputNumber } from "primereact/inputnumber"
// import { Tag } from "primereact/tag"
// import { Sidebar } from "primereact/sidebar"
// import { Tooltip } from "primereact/tooltip"

import { AddItemSidebar } from "./AddItemSidebar"

import { getWeekday, getWorkingDate, getWorkingDateTime } from "../../../../../functions/dateAndTime"
//import { useLocationDetails } from "../../../../../data/locationData"
import TimeAgo from "timeago-react"
import { InputText } from "primereact/inputtext"
import { testProductAvailability } from "../../_utils/testProductAvailability"
import { reformatProdName } from "../../_utils/reformatProdName"
import { IconInfoMessage } from "../../_components/IconInfoMessage"
import { useSettingsStore } from "../../../../../Contexts/SettingsZustand"

export const CartItemDisplay = ({ headerChanges, itemBase, itemChanges, setItemChanges, locNick, delivDate, fulfillmentOption, calculateRoutes, isMobile }) => {
  const user = {
    name: useSettingsStore(state => state.user),
    sub: useSettingsStore(state => state.username),
    authClass: useSettingsStore(state => state.authClass),
    locNick: useSettingsStore(state => state.currentLoc),
  }
  const dayOfWeek = getWeekday(delivDate)
  // const { altLeadTimes } = useLocationDetails(locNick, !!locNick)
  const [rollbackQty, setRollbackQty] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const isDelivDate = delivDate.getTime() === getWorkingDateTime('NOW').toMillis()
  const isPastDeliv = delivDate < getWorkingDateTime('NOW')
  const disableInputs = isPastDeliv || (isDelivDate && user.authClass !== 'bpbfull')

  const tableDisplayData = (!!itemBase && !!itemChanges) 
    ? itemChanges.map(item => {
      const baseItem = itemBase.find(i => i.product.prodNick === item.product.prodNick)
      
      const validRoutes = calculateRoutes(item.product.prodNick, getWeekday(delivDate), fulfillmentOption)
      const canFulfill = (!!validRoutes.length) && validRoutes[0]?.routeNick !== 'NOT ASSIGNED'
      const adjustedLeadTime = validRoutes[0]?.adjustedLeadTime ?? item.product.leadTime
      const delay = adjustedLeadTime - item.product.leadTime
      
      const defaultDaysAvailable = item.product.daysAvailable ?? [1, 1, 1, 1, 1, 1, 1]
      const daysAvailable = defaultDaysAvailable.slice(7 - delay)
        .concat(defaultDaysAvailable.slice(0, 7 - delay))
      const isAvailable = !!daysAvailable[delivDate.getDay()]
      // const isAvailable = testProductAvailability(item.product.prodNick, dayOfWeek)
      const inProduction = delivDate < getWorkingDateTime('NOW').plus({ days: adjustedLeadTime })
      
      const lastAction = (baseItem?.orderType) === 'C' ? (
        baseItem.createdOn === baseItem.updatedOn ? "Created" 
          : (baseItem.qty === 0 ? "Deleted" : "Updated")
      ) : null
      const sameDayUpdate = !!baseItem && getWorkingDate('NOW') === getWorkingDate(baseItem.qtyUpdatedOn)
      
      //const maxQty = (!inProduction && isAvailable) ? 999
      const maxQty = (!inProduction && isAvailable) || user.authClass === 'bpbfull' ? 999
        : !baseItem ? 0        
        : !sameDayUpdate ? (baseItem.qty)
        : (baseItem.sameDayMaxQty || 0)

      // console.log("last action", lastAction)
      // console.log("same day update", sameDayUpdate)
      const info = {
        validRoutes: validRoutes,
        canFulfill: canFulfill,
        delay,
        daysAvailable,
        isAvailable: isAvailable,
        inProduction: inProduction,
        lastAction: lastAction,
        sameDayUpdate: sameDayUpdate,
        timingStatus: isPastDeliv ? 'past' : (isDelivDate ? 'deliv' : (inProduction ? 'inprod' : null)),
        baseQty: baseItem?.qty || 0,
        maxQty: maxQty,
        baseItem: baseItem,
        adjustedLeadTime: adjustedLeadTime,
        delay,
      }
  
      return ({ 
        ...item,
        info: info
      })
    }).filter(item => {
      const baseItem = itemBase.find(i => i.product.prodNick === item.product.prodNick)

      return (!baseItem)
        || (baseItem.qty !== item.qty)
        || (item.qty > 0)
        || (item.action === 'CREATE')
        || (item.orderType === 'C' && item.sameDayMaxQty > 0 && getWorkingDate(item.qtyUpdatedOn) === getWorkingDate('NOW'))

    })
    : []

  const productColumnTemplate = (rowData) => {
    const { timingStatus, lastAction, sameDayUpdate, canFulfill, isAvailable, baseQty, maxQty } = rowData.info
    const recentlyDeleted = (lastAction === "Deleted") && sameDayUpdate
    const qtyChanged = baseQty !== rowData.qty
    const displayProdName = reformatProdName(rowData.product.prodName, rowData.product.packSize)

    return (
      <div style={rowData.qty === 0 ? {opacity: ".70"} : null}>
        <div style={{ display: "flex", justifyContent: "space-between", alignContent: "center", gap: ".25rem"}}>
          <span style={{
            fontStyle: qtyChanged && rowData.qty > 0 ? "italic" : "normal", 
            fontWeight: "bold"
          }}>
              {user.authClass === 'bpbfull' && <span style={{fontSize: "2rem", marginRight: ".25rem"}}>{getEmoji(rowData.product.prodName)}</span>}<span>{displayProdName}</span>
          </span>
        </div>
        {/* {rowData.action === 'CREATE' && rowData.qty === 0 && !rowData.isTemplate && 
          <IconInfoMessage text="Will not be added" 
            iconClass="pi pi-fw pi-info-circle" iconColor="hsl(218, 43%, 50%)"
          />
        } */}
        {recentlyDeleted && rowData.qty === 0 &&
          <IconInfoMessage text="recently deleted" 
            iconClass="pi pi-fw pi-info-circle" iconColor="hsl(218, 43%, 50%)" 
          />
        }
        {/* {!!timingStatus && 
          <IconInfoMessage { ...timingMessageModel[timingStatus] } />
        } */}
        {timingStatus === 'inprod' && 0 < maxQty && 
            <IconInfoMessage text={`In production${maxQty < 999 ? ` (max ${maxQty})` : ''}`} 
            // iconClass="pi pi-fw pi-exclamation-triangle" 
            // iconColor="hsl(45, 96%, 35%)" 
            iconClass="pi pi-fw pi-info-circle"
            iconColor={!!rowData.qty ? "hsl(218, 43%, 50%)" : ""}
          />
        }        
        {timingStatus === 'inprod' && maxQty === 0 &&
          <IconInfoMessage text={`In production`} iconClass="pi pi-fw pi-times" />
        }
        {timingStatus === 'deliv' &&
          <IconInfoMessage text={`Delivery date reached`} 
            iconClass="pi pi-fw pi-info-circle"
            iconColor={!!rowData.qty ? "hsl(218, 43%, 50%)" : ""}
          />
        }
        {timingStatus === 'past' &&
          <IconInfoMessage text={`Past delivery date`} 
            iconClass="pi pi-fw pi-info-circle"
            iconColor={!!rowData.qty ? "hsl(218, 43%, 50%)" : ""}
          />
        }
        {(fulfillmentOption === 'deliv' && !canFulfill) &&
          <IconInfoMessage text={`Delivery not available for ${dayOfWeek}`} 
            textStyle={{fontWeight: !!rowData.qty ? "bold" : ""}}
            iconClass={"pi pi-fw pi-exclamation-triangle"} 
            iconColor={!!rowData.qty ? "hsl(45, 96%, 35%)"  : ""}
          />
        }
        {(fulfillmentOption === 'slopick' && !canFulfill) &&
          <IconInfoMessage text={`SLO Pickup not available for ${dayOfWeek}`} 
            textStyle={{fontWeight: !!rowData.qty ? "bold" : ""}}
            iconClass={"pi pi-fw pi-exclamation-triangle"} 
            iconColor={!!rowData.qty ? "hsl(45, 96%, 35%)"  : ""}
          />
        }
        {(fulfillmentOption === 'atownpick' && !canFulfill) &&
          <IconInfoMessage text={`Carlton Pickup not available for ${dayOfWeek}`} 
            textStyle={{fontWeight: !!rowData.qty ? "bold" : ""}}
            iconClass={"pi pi-fw pi-exclamation-triangle"} 
            iconColor={!!rowData.qty ? "hsl(45, 96%, 35%)"  : ""}
          />
        }
        {!isAvailable &&
          <IconInfoMessage text={`Not available ${dayOfWeek}`} 
            textStyle={{fontWeight: !!rowData.qty ? "bold" : ""}}
            iconClass={"pi pi-fw pi-times"}
            iconColor={!!rowData.qty ? "#BF0404" : ""}
          />
        }
        {showDetails && 
          <>
            {rowData.qtyUpdatedOn && (
              <div style={{paddingTop: ".5rem", fontSize:".9rem"}}>{`${lastAction} `}<TimeAgo datetime={rowData.qtyUpdatedOn}/></div>
              )}
            {rowData.updatedBy && <div style={{fontSize:".9rem"}}>{`by ${rowData.updatedBy}`}</div>}
            {rowData.orderType === 'S' &&
              <div style={{fontSize:".9rem"}}>-- standing order</div>
            }
          </>
        }
      </div>
    )
  } // end productColumnTemplate



  const qtyColumnTemplate = (rowData) => {
   
    const prodNick = rowData.product.prodNick
    const { baseQty, maxQty, qtyChanged } = rowData.info
    const disableInput = (user.authClass === 'bpbfull' && delivDate < getWorkingDateTime('NOW'))
      || (maxQty === 0 || (user.authClass !== 'bpbfull' && delivDate <= getWorkingDateTime('NOW')))

    const updateProductQty = (newQty, prodNick) => {
      const _itemChanges = itemChanges.map((item) => {
        if (item.product.prodNick === prodNick) {
          return ({ 
            ...item, 
            qty: newQty > maxQty ? maxQty : (newQty === '' ? newQty : Number(newQty)) 
          })

        } 
        return item
      })
      setItemChanges(_itemChanges);
    }

    return (
      <div className="p-fluid" style={{width: "62px"}}>
        <InputText
          //className={`qty-input-${rowData.product.prodNick}`}
          value={rowData.qty}
          inputMode="numeric"
          keyfilter={/[0-9]/}
          style={{
            fontWeight : qtyChanged ? "bold" : "normal",
            opacity: rowData.qty === 0 ? ".70" : "",
            backgroundColor: qtyChanged ? 'hsl(37, 67%, 95%)' :'',
          }}
          tooltip={rowData.product.packSize > 1 
            ? `= ${(rowData.qty || 0) * rowData.product.packSize} ea` //${rowData.qty || 0} pk 
            : ''
          }
          tooltipOptions={{ event: 'focus', position: 'left', autoZIndex: false, baseZIndex: "75" }}
          onClick={() => console.log(rowData)}
          readOnly={disableInput}
          //disabled={disableInput}
          onFocus={(e) => {
            setRollbackQty(parseInt(e.target.value) || 0);
            if (!disableInput) e.target.select();
          }}
          onChange={(e) => updateProductQty(e.target.value, prodNick)}
          onKeyDown={(e) => {
            console.log(e)
            if (e.key === "Enter") { 
              e.target.blur();
              if (e.target.value === "") updateProductQty(0, prodNick);
            }

            if (e.key === "Escape") {
              if (e.target.value === '') {
                e.target.blur()
                let resetQty = baseQty
                updateProductQty(resetQty, prodNick);
                setRollbackQty(resetQty)
              } else {
                e.target.blur()
                updateProductQty(rollbackQty, prodNick);
              }
            }
          }}
          onBlur={() => {
            if (rowData.qty === '') {
              updateProductQty(0, prodNick)
            }
          }}
        />
        {showDetails &&
          <>
            <div style={{paddingTop: ".5rem", fontSize:".9rem"}}>{`$${rowData.rate.toFixed(2)}/${rowData.product.packSize > 1 ? "pk" :"ea"}.`}</div>
            <div style={{paddingTop: ".5rem", fontSize:".9rem"}}>Subtotal:</div>
            <div style={{fontSize:".9rem"}}>{`$${(rowData.rate * rowData.qty).toFixed(2)}`}</div>
          </>
        }
        {/* <pre>{"bq " + baseItem?.qty}</pre>
        <pre>{"rb: " + rollbackQty}</pre>
        <pre>{"max " + maxQty}</pre> */}
      </div>
    )
  } // end qtyColumnTemplate

  const footerTemplate = () => {
    const total = itemChanges ? itemChanges.reduce((acc, item) => {
      return acc + item.rate * item.qty
    }, 0).toFixed(2) : 0

    return (
      <div style={{textAlign: 'right'}}>{`Total: $${total}`}</div>
    )
  }

  return (
    <>
      <DataTable
        value={tableDisplayData} 
        //value={itemChanges}
        responsiveLayout="scroll"
        footer={footerTemplate}
        scrollable={!isMobile}
        scrollHeight={!isMobile ? "50rem" : undefined}
        // style={{maxWidth: "400px"}}
      >
        <Column 
          headerClassName="header-split-content"
          header={() => {
            return (
              <div style={{
                fontSize: "1.2rem",
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center"
              }}>
                <span onClick={() => {console.log(headerChanges); console.log(itemChanges)}}>Products</span> 
                <Button 
                  icon={showDetails ? "pi pi-search-minus" : "pi pi-search-plus"}
                  className="p-button-rounded p-button-text" 
                  onClick={() => setShowDetails(!showDetails)}
                />
              </div>

            )
          }}
          field="product.prodName" 
          body={productColumnTemplate}  
        />
        <Column header={() => <Button onClick={() => setShowSidebar(true)} disabled={disableInputs} style={{width: "62px"}}>Add</Button>}
          field="qty" 
          body={qtyColumnTemplate}
          style={{width: "90px", flex: "0 0 90px"}}
        />
      </DataTable>

      <AddItemSidebar 
        locNick={locNick}
        delivDate={delivDate}
        visible={showSidebar}
        setVisible={setShowSidebar}
        cartItems={itemBase}
        cartItemChanges={itemChanges}
        setCartItemChanges={setItemChanges}
        user={user}
        fulfillmentOption={fulfillmentOption}
        calculateRoutes={calculateRoutes}
      />
    </>
  )
}



// holding incase needed for later...

// const leadTimeOverride = altLeadTimes?.find(
//   (alt) => alt.prodNick === item.product.prodNick
//   )
// const leadTime = leadTimeOverride 
//   ? leadTimeOverride.altLeadTime 
//   : item.product.leadTime

// const timingMessageModel = {
//   inprod: { text: "In production", iconClass: "pi pi-times", iconColor:"#BF0404" },
//   deliv: { text: "Delivery date reached", iconClass: "pi pi-times", iconColor:"#BF0404" },
//   past: { text: "Past delivery date", iconClass: "pi pi-times", iconColor:"#BF0404" }
// }

const getEmoji = (prodName) => {
  const text = prodName.toLowerCase()
  let emoji = ''
  if (text.includes('croissant') || text.includes('morning bun')) emoji = '🥐'
  else if (text.includes('loaf')) emoji = '🍞'
  else if (text.includes('stick') || text === 'baguette' || text === 'baguette (retail)') emoji = '🥖'
  else if (text.includes('hot dog')) emoji = '🌭'
  else if (text.includes('torp')) emoji = '🥪'
  else if (text.includes('pretzel')) emoji = '🥨'
  else if (text.includes('bun')) emoji = '🍔'
  else if (text.includes('muffin') || text.includes('brownie')) emoji = '🧁'

  if (text.includes('frozen')) {
    emoji = emoji + '🧊'
  }

  return emoji
}

{/* <div style={{position: "relative", height: "3rem", width: "3rem"}}>
<div style={{position: "absolute", top: "0.00rem", left: "0.00rem", fontSize:"1.5rem"}}>🥖</div>
<div style={{position: "absolute", top: "0.66rem", left: "0.00rem", fontSize:"1.5rem"}}>🥖</div>
<div style={{position: "absolute", top: "1.33rem", left: "0.00rem", fontSize:"1.5rem"}}>🥖</div>
<div style={{position: "absolute", top: "0.00rem", left: "1.00rem", fontSize:"1.5rem"}}>🥖</div>
<div style={{position: "absolute", top: "0.66rem", left: "1.00rem", fontSize:"1.5rem"}}>🥖</div>
<div style={{position: "absolute", top: "1.33rem", left: "1.00rem", fontSize:"1.5rem"}}>🥖</div>
</div>

<div style={{position: "relative", height: "3rem", width: "3rem", margin: ".25rem", borderRadius: "1.5rem", backgroundColor: "lightblue"}}>
<div style={{position: "absolute", top: ".25rem", left: ".25rem", fontSize:"2.0rem"}}>🥐</div>
</div>

<div style={{position: "relative", height: "3rem", width: "3rem"}}>
<div style={{position: "absolute", fontSize:"1.75rem"}}>🥐</div>
</div>

<div style={{position: "relative", height: "3rem", width: "3rem"}}>
<div style={{position: "absolute", fontSize:"2rem"}}>🥐</div>
<div style={{position: "absolute", top: ".75rem", left: "1.5rem", fontSize:"1.25rem"}}>🍫</div>
</div>

<div style={{position: "relative", height: "3rem", width: "3rem"}}>
<div style={{position: "absolute", fontSize:"2rem"}}>🥐</div>
<div style={{position: "absolute", top: ".75rem", left: "1.5rem", fontSize:"1.25rem"}}>🥬</div>
</div>

<div style={{position: "relative", height: "3rem", width: "3rem"}}>
<div style={{position: "absolute", fontSize:"2rem"}}>🥐</div>
<div style={{position: "absolute", top: ".75rem", left: "1.5rem", fontSize:"1.25rem"}}>🥩</div>
</div>

<div style={{position: "relative", height: "3rem", width: "3rem"}}>
<div style={{position: "absolute", fontSize:"2rem"}}>🥐</div>
<div style={{position: "absolute", top: ".75rem", left: "1.5rem", fontSize:"1.25rem"}}></div>
</div>
</div>) // end return */}