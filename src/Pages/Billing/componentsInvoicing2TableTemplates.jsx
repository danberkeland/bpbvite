import React from "react"
import { useRef, useState } from "react"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Menu } from "primereact/menu"


const CustomerCellTemplate = (row) => <div style={{padding: ".25rem"}}>
  <div style={{fontWeight: "bold"}}>{row.locNameDisplay}</div>
  <pre style={{fontSize: ".8rem", margin: "0"}}>{row.locNick}: {row.qbID}</pre>
</div>

const OrderCellTemplate = (row) => {
  const { order } = row
  const [showModal, setShowModal] = useState(false)
  const [orderChanges, setOrderChanges] = useState()
  const openModal = () => {
    setOrderChanges(order)
    setShowModal(true)
  }
  const closeModal = () => {
    setOrderChanges(undefined)
    setShowModal(false)
  }
  return (
    <div>
      <Button 
        className="p-button-text" 
        style={{paddingLeft: "0", paddingRight: ".25rem"}}
        onClick={() => openModal()}
      >
        <div style={{paddingRight: ".5rem", textDecoration: "underline"}}>
          {row.nOrderItems} item{(row.nOrderItems !== 1) && 's'}
        </div>
        {row.nOrderItems === 0 
          ? <i className="pi pi-trash"/>
          : <i className="pi pi-external-link"/>
        }
      </Button>
      <Dialog 
        visible={showModal} 
        onHide={() => closeModal()}
        header={() => <div style={{marginRight: "1rem"}}>{row.locNameDisplay}</div>}
        footer={() => <div style={{display: "flex", justifyContent: "end"}}><Button disabled={true}>Submit Changes (editing not available yet)</Button></div>}
      >
        <DataTable value={row.order ?? []} size="small">
          <Column header="Product" field="prodNick" />
          <Column header="Qty" field="qty" />
          <Column header="Unit price" field="rate" />
          <Column header="Qty Short" field="qtyShort" />
        </DataTable>
      </Dialog>
    </div>
  )
}

const invStratIconMap = {
  "no invoice": <><i className="pi pi-ban" /> none</>,
  "print only": <><i className="pi pi-print" /> print</>,
  "email": <><i className="pi pi-at" /> email</>,
}
const InvoiceTypeCellTemplate = (row) => (
  <div style={{display: "flex", alignItems: "center", gap: ".5rem"}}>
    {invStratIconMap[row.invoicingStrategy]}
  </div>
)

const InvoiceCellTemplate = (row) => (
  row.invoiceFlags.exists ? row.invoice.DocNumber
    : row.invoiceFlags.readyToSyncData ? "not found"
    : "n/a"
)


const SyncMenuButton = ({ row, syncData, suggestedAction }) => {
  const menuRef = useRef(null)

  return (
    <div>
      <Button 
        className="p-button-rounded p-button-text" 
        icon="pi pi-chevron-down" 
        onClick={e => menuRef.current.toggle(e)}
      />
      <Menu 
        popup ref={menuRef} 
        model={[
          { 
            label: `Manually ${suggestedAction}`, 
            icon: "pi pi-refresh", 
            command: async () => await(syncData(row)),
          },
        ]}  
      />
    </div>
  )
}

const InvoiceSyncedCellTemplate = (row, syncData) => {

  const suggestedAction = row.invoiceFlags.readyToCreate ? "create"
    : row.invoiceFlags.readyToDelete ? "delete"
    : row.invoiceFlags.readyToUpdate ? "resync"
    : undefined

  const displayInfo = !!suggestedAction ? <><i className="pi pi-times" /> need to {suggestedAction}</>
    : row.invoiceFlags.exists ? <><i className="pi pi-check-circle" /> synced</>
    : ""

  return <div style={{display: "flex", alignItems: "center", gap: ".5rem"}}>
    {displayInfo}
    {row.invoiceFlags.readyToSyncData && false 
      && <SyncMenuButton row={row} syncData={syncData} suggestedAction={suggestedAction} />
    }
  </div> 
}


const SyncEmailMenuButton = ({ row, sendEmail }) => {
  const menuRef = useRef(null)

  const model = row.invoiceFlags.readyToSyncData 
    ? [{ label: "Sync data first", icon: "pi pi-refresh", disabled: true }]
    : [{ label: "send", icon: "pi pi-send", command: async () => await(sendEmail(row)) }]

  return (
    <div>
      <Button 
        className="p-button-rounded p-button-text" 
        icon="pi pi-chevron-down" 
        onClick={e => menuRef.current.toggle(e)}
      />
      <Menu popup ref={menuRef} model={model} />
    </div>
  )
}

const EmailSentCellTemplate = (row, sendEmail) => {
  const containerStyle = {display: "flex", alignItems: "center", gap: ".5rem"}

  if (row.invoiceFlags.emailSent) {
    return <div style={containerStyle}><i className="pi pi-check-circle" /> sent</div>
  }

  if (row.invoiceFlags.emailExpected) {
    return <>not sent { false && <SyncEmailMenuButton row={row} sendEmail={() => {}} />}</>
  }

  if (row.invoiceFlags.dataExpected && !row.invoiceFlags.emailExpected) {
    return "n/a"
  }

  return ""
} 

export const CellTemplates = {
  Customer: CustomerCellTemplate,
  Order: OrderCellTemplate,
  InvoiceType: InvoiceTypeCellTemplate,
  Invoice: InvoiceCellTemplate,
  InvoiceSynced: InvoiceSyncedCellTemplate,
  EmailSent: EmailSentCellTemplate,

}