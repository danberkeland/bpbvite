import { useState } from "react"

import { Dialog } from "primereact/dialog"

export const HelpDialog = ({ showHelp, setShowHelp }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const linkModel = [
    { index: 0, label: 'Table Fields' },
    { index: 1, label: 'Order View' },
    { index: 2, label: 'Invoice Actions' },
    { index: 3, label: 'Batch Tasks' }
  ]

  const liTemplate = (linkModelItem) => 
    <li
      key={`help-link-${linkModelItem.index}`}
      onClick={() => { setActiveIndex(linkModelItem.index) }}
      style={{
        cursor: "pointer",
        fontWeight: activeIndex === linkModelItem.index ? "bold" : "",
      }}
    >
      {linkModelItem.label}
    </li>

  return (
    <Dialog 
      visible={showHelp} 
      onHide={() => { setShowHelp(false) }} 
      style={{maxWidth: "35rem", height:"80vh"}}
      header="Help - Invoicing"
    >
      <div style={{fontWeight: "bold"}}>Topics:</div>
      <ul style={{textDecoration: "underline"}}>
        {linkModel.map(liTemplate)}
      </ul>
      {activeIndex === 0 && tableArticle}
      {activeIndex === 1 && orderViewArticle}
      {activeIndex === 2 && invoiceActionsArticle}
      {activeIndex === 3 && batchTasksArticle}
    </Dialog>
  )
}

const tableArticle =
<div>
  <h2>Table Columns</h2>

  <h3>Order</h3>
  <p>
    Shows locations with order data for the given date. The number counts
    how many products with non-zero qty are in the order. 
  </p>
  <p>  
    An order that shows 0 items is considered 'deleted' and will appear with a 
    '<i className="pi pi-trash"/>' next to it. In this case data will not be
    sent to QB, and any existing invoice will be deleted when syncing.
  </p>
  <p>
    Clicking on the cell will let you view the order in more detail and make 
    specific edits to it. See 'Order View' for more details.
  </p>

  <h3>Invoice</h3>
  <p>
    Matches fetched invoice data with the appropriate order using the
    location's qbID and DocNumber. If an order has a matching invoice, the 
    DocNumber will be displayed in this field.
  </p>
  <p>
    Icons indicate how invoices are expected to be sent to customers:
  </p>
  <ul>
    <li>
      <i className="pi pi-ban" /> means the customer does not get invoices. 
      Data will not be sent to QB; invoice data will not be created.
    </li>
    <li>
      <i className="pi pi-print" /> means the customer gets printed invoices 
      only. Data will be sent to QB, but emails cannot be sent.
    </li>
    <li>
      <i className="pi pi-at" /> means the customer gets both printed and 
      emailed invoices. Data will be sent to QB, and emails will be sent. 
    </li>
  </ul>
  <p>
    Clicking on the cell will reveal a menu to take actions on the invoice. See 
    'Invoice Actions' for more details.
  </p>

  <h3>Synced with QB (<i className="pi pi-refresh" />?)</h3>
  <p>
    Indicates if the QB invoice reflects the most up-to-date order data.
  </p>
  <p>
    Note: this check is not 100% rigorous and can be dangerously incorrect 
    in very rare cases. The page does not check that all critical order/invoice 
    data matches. Instead, it simply looks at when each was last edited. It's 
    ASSUMED that all invoice edits are caused by actions on this page, so if
    we see the invoice was edited later than the order, then it must have 
    been updated with current order data. This can be thrown out of whack if a 
    customer's invoice is manipulated directly in QB. As a result, the page 
    may incorrectly think that the invoice does not need to be updated.
  </p>
  <p>
    If you believe a particular invoice is messed up in this way, you can 
    force data to be re-synced from the menu in the 'Invoice' field.
  </p>

  <h3>Email Sent (<i className="pi pi-send" />?)</h3>
  <p>
    Looks for a flag in the invoice data indicating whether an email has been 
    sent or not. Once an email is sent, their invoice data can no longer be 
    changed through the actions on this page. Any corrections/adjustments 
    should be handled directly in QB, most likely with credit memos.
  </p>
</div>

const orderViewArticle =
<div>
  <h2>Order: Expanded View</h2>
  Click on items in the 'Order' column to view order data in more detail and 
  make specific edits to it (Currently read-only)

  <h3>Edit Short Qty (Experimental)</h3>
    <p>
      An alternate way to handle invoice adjustments. Our previous method
      of editing the customer's order qty works as far as billing them 
      the correct amount, but is lacking for customers who want to 
      verify that their invoices are correct. Adding a short qty here 
      preserves the line item on the invoice and adds an appropriate 
      "correction" line item with a negative subtotal.
    </p>
    <p>
      If a customer's entire order needs to be scrapped, it's probably better to 
      delete the order from the ordering page so that no invoice is generated. 
      Shorting a customer's entire order here will generate a $0.00 invoice in QB.
    </p>

    <h3>Edit Unit Price</h3>
    <p>
      Override the customer's default unit price on a per-order basis. The most 
      common use would be to set an item as a sample by setting the price 
      to $0.00. If you create a sample for a customer who uses the app, they 
      will not be allowed to edit the qty for that item on the ordering page.
    </p>

    <h3>Edit Delivery Fee</h3>
    <p>
      Override the default fee on a per-order basis. Intended as a way to 
      waive the delivery fee when deemed necessary.
    </p>

    <h3>Submit Changes</h3>
    <p>Submitting only updates order data in our app, not in QB. That is, if the 
      order was previously synced, submitting will put the (app) order and (QB) 
      invoice out of sync. The end of day batch task will fix this.
    </p>

</div>

const invoiceActionsArticle = 
<div>
  <h2>Invoice Actions</h2>
  Click on items in the 'Invoice' column to bring up a menu that handles the
  following actions.

  <h3>Sync with QB</h3>
  <p>
    Sends order data from the app over to QB so that invoice reflects the 
    current state of the order. 'Syncing' could mean creating, updating, or 
    deleting invoice data -- the page will figure out the appropriate action.
    This action requires location to have print or emailed invoices enabled. It 
    is disabled after an email has been sent.
  </p>

  <h3>Send Email</h3>
  <p>
    Triggers QB to send an electronic invoice to the address(es) specified for 
    the location. This action requires the location to have emailed invoices 
    enabled, and for invoice data to be synced. It is disabled after an email 
    has been sent.
  </p>
  <p>
    Normally we only send emails on the day of delivery. While the 'Send Email' 
    batch task only works for the usual case, you can send emails for orders on
    any date on a per-invoice basis here as long as the above requirements are
    met.
  </p>

  <h3>Get PDF</h3>
  <p>
    Download a printable PDF of the invoice. This action requires that invoice 
    data exists and is synced with order data first.
  </p>
</div>

const batchTasksArticle = 
<div>
  <h2>Batch Tasks</h2>

  <h3>For Today's Orders</h3>
  <p>
    Today's inovices need to be possibly updated, then sent by email. 
  </p>
  <p>
    Use  the 'Sync data with QB' button first if some emails are not ready to send, 
    then use the 'Send Emails' button. The buttons should show 'all items synced' 
    and 'all items sent' when everything is completed successfully.
  </p>

  <h3>For Tomorrow's Orders </h3>
  <p>
    Tomorrow's order data needs to be sent to QB so that the crew can download 
    and print PDF invoices tomorrow.
  </p>
  <p>
    Use 'Sync data with Qb'. The button should show 'all items synced' 
    when finished. Then use 'Get PDFs' to download a backup set of inovoices. 
    This works the same as on the 'Logistics - By Route' page.
  </p>
</div>