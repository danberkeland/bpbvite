import { DataTable } from "primereact/datatable"
import { DT } from "../../utils/dateTimeFns"
import { Column } from "primereact/column"
import { Button } from "primereact/button"



const PageCroissantEodCounts = () => {
  const reportDT = DT.today()

  return (
    <div style={{padding: "2rem 5rem 5rem 5rem", width:"52rem", margin: "auto"}}>
      <h1>Croissant Freezer Count {reportDT.toFormat('MM/dd/yyyy')}</h1>

      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div>
          <h2>South/Prado</h2>
          <DataTable
            responsiveLayout="scroll"
            size="large"
          >
            <Column header="Product"                         field="prodNick" />
            <Column header={<span>Opening <br/>Count</span>} field="freezerCount"   footer={<Button label="Edit" />} />
            <Column header={<span>Closing <br/>Count</span>} field="freezerClosing" footer={<Button label="Edit" />} />
          </DataTable>
        </div>
        <div>
          <h2>North/Carlton</h2>
          <DataTable
            responsiveLayout="scroll"
            size="large"
          >
            <Column header="Product"                         field="prodNick" />
            <Column header={<span>Opening <br/>Count</span>} field="freezerNorth" />
            <Column header={<span>Closing <br/>Count</span>} field="freezerNorthClosing" footer={<Button label="Edit" />} />
          </DataTable>
        </div>
      </div>
    </div>
  )
}

export { PageCroissantEodCounts as default }