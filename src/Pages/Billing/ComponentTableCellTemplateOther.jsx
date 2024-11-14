const successCheckIcon = 
  <i className="pi pi-check" 
    style={{ 
      color: "#ffffff", 
      backgroundColor: "#689F38", 
      fontSize: ".9rem", 
      borderRadius: "160px", 
      padding: ".35rem"
    }} 
  />
const exclamationWarnIcon = 
  <i className="pi pi-exclamation-triangle" 
    style={{ 
      color: "#212529", 
      backgroundColor: "#FBC02D", 
      fontSize: ".9rem", 
      borderRadius: "160px", 
      padding: ".35rem"
    }} 
  />
const timesContrastIcon =  
  <i className="pi pi-times" 
    style={{ 
      color: "var(--bpb-contrast-color)",
      backgroundColor: "transparent",
      opacity: ".8",
      // color: "#ffffff", 
      // backgroundColor: "var(--bpb-contrast-color)", 
      fontSize: ".9rem", 
      border: "solid 1px var(--bpb-contrast-color)",
      borderRadius: "160px", 
      padding: ".35rem"
    }} 
  />

export const InvoiceSyncedCellTemplate = (row) => {
  return !!row.invoiceFlags.readyToSyncData ? timesContrastIcon 
    : row.issues[0].hasIssue ? exclamationWarnIcon 
    : row.invoiceFlags.exists ? successCheckIcon
    : ""
}

export const EmailSentCellTemplate = (row) => {
  return row.invoiceFlags.emailSent ? successCheckIcon
    : row.invoiceFlags.emailExpected ? timesContrastIcon
    : (row.invoiceFlags.dataExpected && !row.invoiceFlags.emailExpected)? "n/a"
    : ""
} 