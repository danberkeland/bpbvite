import React from "react"
import { useState } from "react"

import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Dialog } from "primereact/dialog"
import { InputNumber } from "primereact/inputnumber"

import { useSettingsStore } from "../../Contexts/SettingsZustand"

import { orderValidation } from "../../data/order/changesets"
import { DBOrder } from "../../data/types.d"
import { groupByObject, sumBy } from "../../utils/collectionFns"
import { isEqual } from "lodash"

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const OrderCellTemplate = ({ row, isToday }) => {
  const userName = useSettingsStore(state => state.user)
  const { order, invoiceFlags } = row
  const shouldDisableInputs = !(invoiceFlags?.option_syncData) || row?.isOrderDeleted

  const [showModal, setShowModal] = useState(false)


  const [orderChanges, setOrderChanges] = useState(/** @type {DBOrder[]|null} */(null))
  const changesExist = !!orderChanges && !isEqual(order, orderChanges)

  const openModal = () => {
    setOrderChanges(order)
    setShowModal(true)
  }
  const closeModal = () => {
    setShowModal(false)
    setTimeout(() => setOrderChanges(null), 175)
  }
  
  const handleValueChange = (index, attribute, newValue) => {
    if (!orderChanges) return
    let newData = structuredClone(orderChanges)
    newData[index][attribute] = newValue
    setOrderChanges(newData)
  }
  const hendleDelivFeeChange = (newValue) => {
    if (!orderChanges) return
    let newData = structuredClone(orderChanges)
    newData = newData.map(item => ({ ...item, delivFee: newValue }))
    setOrderChanges(newData)
  }

  const handleSubmit = () => {
    if (!orderChanges) return
    const submitItems = orderChanges.filter((_, idx) => !isEqual(order[idx], orderChanges[idx]))

    const { 
      Orders=[], 
      Standing=[] 
    } = groupByObject(submitItems, item => item.Type)

    const createInputs = Standing.map(order => orderValidation
      .cast.toCreateInput({
        ...order,
        qtyUpdatedOn: new Date().toISOString(),
        updatedBy: userName,
      }),
    )
    const updateInputs = Orders.map(item => ({ 
      id: item.id, 
      qtyShort: item.qtyShort, 
      rate: item.rate,
      updatedBy: userName,
    }))

    console.log("updateInputs", updateInputs)
    console.log("createInputs", createInputs)

  } 

  return (
    <div>
      <Button 
        className="p-button-text" 
        style={{paddingInline: ".25rem"}}
        onClick={() => openModal()}
        label={
          <div style={{textAlign: "left", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: ".25rem"}}>
            <div style={{padding: ".25rem"}}>
              <div style={{fontWeight: "bold"}}>{row.locNameDisplay}</div>
              <pre style={{display: "flex", alignItems: "center", fontSize: ".8rem", margin: "0"}}>
                <div>{row.locNick} ({row.nOrderItems}){row.isOrderDeleted ? <i style={{fontSize: ".75rem"}} className="pi pi-trash" /> : ""}</div>
              </pre>
            </div>
            {/* {OrderCellTemplate(row, reportDate, isToday)} */}
          </div>
        }
      />

      <Dialog 
        visible={showModal} 
        onHide={() => closeModal()}
        style={{width: "clamp(20rem, 90%, 40rem)"}}
        header={
          <div style={{marginRight: "1rem"}} onClick={() => { console.log(row)}}>
            {row.location.locName + (shouldDisableInputs ? " (read only)" : "")}
          </div>
        }
        footer={
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: ".5rem"}}>
            <div style={{display: "flex", flexWrap: "wrap", alignItems: "center", gap: ".5rem", color: "var(--bpb-text-color)"}}>
              <span>Delivery Fee:</span>
              {orderChanges?.[0].route !== 'deliv' || ['slopick', 'atownpick'].includes(row.location.zoneNick)
                ? <span>n/a for pick-up</span>
                : <InputNumber 
                    value={order?.[0].delivFee} 
                    placeholder={USDollar.format(row.zone.zoneFee) + ' (auto)'} 
                    onValueChange={e => hendleDelivFeeChange(e.value)} 
                    min={0} mode="currency" currency="USD" locale="en-US"
                    inputStyle={{width: "7rem"}} 
                    disabled={shouldDisableInputs || !order?.length}
                  />
              }
            </div>
            <Button 
              label="Submit not available"
              disabled={shouldDisableInputs || !changesExist || true}
              // onClick={handleSubmit}
            />
          </div>
        }
      >
        <DataTable 
          value={orderChanges ?? []}
          size="small"
          responsiveLayout="scroll"
          footer={() => (
            <div style={{textAlign: "right"}}>
              Total: {USDollar.format(sumBy(orderChanges ?? [], order => (order.qty - order.qtyShort) * order.rate))}
            </div>
          )}
          className={isToday ? '' : 'not-today'}
        >
          <Column header="Product" 
            body={row => <div>
              <div className="show-min-sm">{row.product?.prodName ?? row.prodNick}</div>
              <pre className="show-min-sm" style={{fontSize: ".8rem", margin: "0rem"}}>{row.prodNick}</pre>
              <div className="show-max-sm">{row.prodNick}</div>
            </div>} 
          />
          <Column header="Qty" 
            field="qty" 
          />
          <Column header="Short"      
            body={(row, options) => (
              <InputNumber 
                value={row.qtyShort} 
                min={0} 
                max={row.qty} 
                onValueChange={e => {
                  handleValueChange(options.rowIndex, 'qtyShort', e.value)
                }}
                onBlur={e => {
                  if (e.target.value === "") {
                    handleValueChange(options.rowIndex, 'qtyShort', 0)
                  }
                }}
                inputStyle={{width: "4rem"}}
                disabled={shouldDisableInputs}
              />
            )} 
          />
          <Column header={<span>Total<br/>Deliv</span>} className="show-min-sm"
            body={row => row.qty - (row.qtyShort ?? 0)} 
          />
          <Column header="Unit Price" 
            body={(row, options) => (
              <InputNumber 
                value={row.rate} 
                onValueChange={e => 
                  handleValueChange(options.rowIndex, 'rate', e.value)
                }
                onBlur={e => {
                  if (e.target.value === "") {
                    handleValueChange(options.rowIndex, 'rate', 0)
                  }
                }}
                min={0} mode="currency" currency="USD" locale="en-US" 
                tooltip={`Default Rate: ${USDollar.format(row.product.wholePrice)}
                Customer Default Rate: ${row.rateDefault !== row.product.wholePrice ? USDollar.format(row.rateDefault) : 'same'}`} 
                tooltipOptions={{ position: "left" }}
                inputStyle={{width: "4.75rem"}} 
                disabled={shouldDisableInputs}
              />
            )} 
          />
          <Column header="Subtotal" className="show-min-md"
            body={row => USDollar.format((row.qty - row.qtyShort) * row.rate)} 
          />

        </DataTable>
      </Dialog>
    </div>
  )
}