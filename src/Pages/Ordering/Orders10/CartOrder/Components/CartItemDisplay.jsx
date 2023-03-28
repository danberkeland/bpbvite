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
import { useLocationDetails } from "../../../../../data/locationData"
import TimeAgo from "timeago-react"
import { InputText } from "primereact/inputtext"
import { testProductAvailability } from "../../_utils/testProductAvailability"
import { reformatProdName } from "../../_utils/reformatProdName"
import { IconInfoMessage } from "../../_components/IconInfoMessage"
import { useSettingsStore } from "../../../../../Contexts/SettingsZustand"

export const CartItemDisplay = ({ itemBase, itemChanges, setItemChanges, locNick, delivDate, fulfillmentOption, calculateRoutes, isMobile }) => {
  const user = {
    name: useSettingsStore(state => state.user),
    sub: useSettingsStore(state => state.username),
    authClass: useSettingsStore(state => state.authClass),
    locNick: useSettingsStore(state => state.currentLoc),
  }
  const dayOfWeek = getWeekday(delivDate)
  const { altLeadTimes } = useLocationDetails(locNick, !!locNick)
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
      const canFulfill = (!!validRoutes.length) && validRoutes[0] !== 'NOT ASSIGNED'
      const isAvailable = testProductAvailability(item.product.prodNick, dayOfWeek)
      const inProduction = delivDate < getWorkingDateTime('NOW').plus({ days: item.product.leadTime })
      
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
        isAvailable: isAvailable,
        inProduction: inProduction,
        lastAction: lastAction,
        sameDayUpdate: sameDayUpdate,
        timingStatus: isPastDeliv ? 'past' : (isDelivDate ? 'deliv' : (inProduction ? 'inprod' : null)),
        baseQty: baseItem?.qty || 0,
        maxQty: maxQty,
        baseItem: baseItem,
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
              {displayProdName}
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
          <IconInfoMessage text={`Pick up only for ${dayOfWeek}`} 
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
    const { baseItem, baseQty, maxQty, qtyChanged } = rowData.info
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
                <span onClick={() => {console.log(itemChanges)}}>Products</span> 
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