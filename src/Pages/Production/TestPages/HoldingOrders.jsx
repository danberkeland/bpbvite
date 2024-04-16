import { DataTable } from "primereact/datatable"
import { useStandings } from "../../../data/standing/useStandings"
import { sumBy } from "../../../utils/collectionFns"
import { tablePivot } from "../../../utils/tablePivot"
import { Column } from "primereact/column"
import { WEEKDAYS_EEE } from "../../../constants/constants"




export const HoldingOrders = () => {

  const { data:STD } = useStandings({ shouldFetch: true })

  console.log("STD", STD)

  const data = !!STD 
    ? tablePivot(
        STD.filter(std => !std.isStand),
        { prodNick: order => order.prodNick },
        'dayOfWeek',
        cellItems => cellItems[0].qty
      )
    : undefined


  return (
    <div>
      <h1>Standing Orders</h1>
      <DataTable value={data} >
        <Column header="product" field="rowProps.prodNick" />
        {WEEKDAYS_EEE.map(dayOfWeek => 
          <Column key={dayOfWeek} header={dayOfWeek} field={`colProps.${dayOfWeek}.value`} />
        )}
      </DataTable>
    </div>
  )

}