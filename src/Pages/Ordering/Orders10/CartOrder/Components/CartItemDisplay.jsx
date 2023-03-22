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

export const CartItemDisplay = ({ itemBase, itemChanges, setItemChanges, locNick, delivDate, user, fulfillmentOption, calculateRoutes }) => {
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
      const leadTimeOverride = altLeadTimes?.find(
        (alt) => alt.prodNick === item.product.prodNick
        )
      const leadTime = leadTimeOverride 
        ? leadTimeOverride.altLeadTime 
        : item.product.leadTime

      const lastAction = (baseItem?.orderType) === 'C' ? (
        baseItem.createdOn === baseItem.updatedOn ? "Created" 
          : (baseItem.qty === 0 ? "Deleted" : "Updated")
      ) : null
      const inProduction = delivDate < getWorkingDateTime('NOW').plus({ days: item.leadTime })
      
      
      const sameDayUpdate = !!baseItem && getWorkingDate('NOW') === getWorkingDate(baseItem.qtyUpdatedOn)
      const maxQty = !inProduction || user.authClass === 'bpbfull' ? 999
        : !baseItem ? 0        
        : !sameDayUpdate ? baseItem.qty
        : baseItem.sameDayMaxQty
      const qtyChanged = baseItem ? baseItem.qty !== item.qty : item.qty > 0

      const info = {
        validRoutes: validRoutes,
        canFulfill: (!!validRoutes.length) && validRoutes[0] !== 'NOT ASSIGNED',
        isAvailable: testProductAvailability(item.product.prodNick, dayOfWeek),
        leadTimeForLocation: leadTime,
        inProduction: inProduction,
        lastAction: lastAction,
        sameDayUpdate: sameDayUpdate,
        timingStatus: isPastDeliv ? 'past' : (isDelivDate ? 'deliv' : (inProduction ? 'inprod' : null)),
        maxQty: maxQty,
        qtyChanged: qtyChanged
      }

      return ({...item, info: info})
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
    const prodNick = rowData.product.prodNick
    // const baseItem = itemBase?.find(item => item.product.prodNick === prodNick)
    // const leadTimeOverride = altLeadTimes?.find(
    //   (item) => item.prodNick === prodNick
    //   )
    // const leadTime = leadTimeOverride 
    //   ? leadTimeOverride.altLeadTime 
    //   : rowData.product.leadTime
    // const qtyChanged = baseItem ? baseItem.qty !== rowData.qty : rowData.qty > 0
    // const inProduction = delivDate < getWorkingDateTime('NOW').plus({ days: leadTime })
    // const timingStatus = isPastDeliv ? 'past' : (isDelivDate ? 'deliv' : (inProduction ? 'inprod' : null))

    const { qtyChanged, timingStatus, lastAction, sameDayUpdate, canFulfill, isAvailable } = rowData.info
    const recentlyDeleted = (lastAction === "Deleted") && sameDayUpdate
    const cleanedProdName = rowData.product.prodName.replace(/\([0-9]+\)/, '').trim()
    const packSizeString = rowData.product.packSize > 1 ? ` (${rowData.product.packSize}pk)` : ''
    const displayProdName = `${cleanedProdName}${packSizeString}`

    return (
      <div style={rowData.qty === 0 ? {color : "gray"} : null}>
        <div style={{ display: "flex", justifyContent: "space-between", alignContent: "center", gap: ".25rem"}}>
          <span style={{
            fontStyle: qtyChanged && rowData.qty > 0 ? "italic" : "normal", 
            fontWeight: "bold"
          }}>
              {displayProdName}
          </span>
        </div>
        {rowData.action === 'CREATE' && rowData.qty === 0 &&
          <IconInfoMsg infoMessage="Will not be added" iconClassName="pi pi-info-circle" />
        }
        {!!timingStatus && 
          <IconInfoMsg { ...timingMessageModel[timingStatus] } />
        }
        {(fulfillmentOption === 'deliv' && !canFulfill && rowData.qty > 0) && 
          <IconInfoMsg infoMessage={`Pick up only for ${dayOfWeek}`} iconClassName="pi pi-times" />
        }
        {!isAvailable && rowData.qty > 0 && 
          <IconInfoMsg infoMessage={`Not available ${dayOfWeek}`} iconClassName="pi pi-times" />
        }
        {(recentlyDeleted && rowData.qty === 0) && 
          <IconInfoMsg infoMessage="recently deleted" iconClassName="pi pi-info-circle" />
        }
        {showDetails && 
          <>
            {rowData.qtyUpdatedOn && (
              <div style={{paddingTop: ".5rem", fontSize:".9rem"}}>edited <TimeAgo datetime={rowData.qtyUpdatedOn}/></div>
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
    const { baseItem, maxQty, qtyChanged } = rowData.info
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
      <div className="p-fluid">
        <InputText
          //className={`qty-input-${rowData.product.prodNick}`}
          value={rowData.qty}
          inputMode="numeric"
          keyfilter={/[0-9]/}
          style={{
            fontWeight : qtyChanged ? "bold" : "normal",
            color: rowData.qty === 0 ? "gray" : '',
            backgroundColor: qtyChanged ? 'hsl(37, 67%, 95%)' :'',
          }}
          tooltip={rowData.product.packSize > 1 ? `${rowData.qty || 0} pk = ${(rowData.qty || 0) * rowData.product.packSize} ea` : ''}
          tooltipOptions={{ event: 'focus', position: 'left' }}
          onClick={() => console.log(rowData)}
          readOnly={disableInput}
          //disabled={disableInput}
          onFocus={(e) => {
            setRollbackQty(parseInt(e.target.value));
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
                let resetQty = baseItem.qty || 0
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
        {/* <Tooltip 
          target={`.qty-input-${rowData.product.prodNick}`}
          position="left"
          event="focus"
          autoHide={false}
        >
          {rowData.product.packSize > 1 && 
            <div style={{display: "flex"}}>
              <span style={{width: "4.5rem"}}>{`${(rowData.qty || 0) * rowData.product.packSize} pcs`}</span>
            </div>
          }
        </Tooltip> */}
        {showDetails &&
          <>
            <div style={{paddingTop: ".5rem", fontSize:".9rem"}}>{`$${rowData.rate.toFixed(2)}/${rowData.product.packSize > 1 ? "pk" :"ea"}.`}</div>
            <div style={{paddingTop: ".5rem", fontSize:".9rem"}}>Subtotal:</div>
            <div style={{fontSize:".9rem"}}>{`$${(rowData.rate * rowData.qty).toFixed(2)}`}</div>
          </>
        }
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
    <div className="bpb-datatable-orders" style={{padding: ".5rem"}}>
      <DataTable
        value={tableDisplayData} 
        //value={itemChanges}
        responsiveLayout
        footer={footerTemplate}
      >
        <Column 
          headerClassName="header-split-content"
          header={() => {
            return (
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
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
          style={{width: "5.5rem"}}
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
    </div>
  )
}

const timingMessageModel = {
  inprod: { infoMessage: "In production", iconClassName: "pi pi-exclamation-triangle" },
  deliv: { infoMessage: "Delivery date reached", iconClassName: "pi pi-times" },
  past: { infoMessage: "Past delivery date", iconClassName: "pi pi-times" }
}

const IconInfoMsg = ({ infoMessage, iconClassName, iconPosition="left" }) => {

  return(
    <div style={{
      display: "flex", 
      alignContent: "center", 
      gap: ".25rem", 
      fontSize: ".9rem"
    }}>
      {iconPosition === 'left' && <i className={iconClassName} />}
      <span>{infoMessage}</span>
      {iconPosition === 'right' && <i className={iconClassName} />}
    </div>
  ) 

}

const testProductAvailability = (prodNick, dayOfWeek) => {
  if (['ptz', 'unpz', 'pbz'].includes(prodNick) && ['Sun', 'Mon'].includes(dayOfWeek)) return false
  return true  
}