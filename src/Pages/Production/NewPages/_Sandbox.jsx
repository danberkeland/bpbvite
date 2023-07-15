import { DataTable } from "primereact/datatable"
import { useOrderSubscription } from "../../../data/swr2.x.x/useSubscription"
import { Column } from "primereact/column"
import { DateTime } from "luxon"
import { orderBy } from "lodash"
import TimeAgo from "timeago-react"


const formatTime = (isoStr) => DateTime.fromISO(isoStr)
  .setZone('America/Los_Angeles')
  .toFormat('MMM dd, h:mm a')

export const Sandbox = () => {
  const { data } = useOrderSubscription()

  const tableData = orderBy(
    data,
    'updatedOn', 
    'desc'
  )

  return (<div>
    <DataTable 
      value={tableData}
      size='small'
    >
      <Column header='locNick' field='locNick' />
      <Column header='prodNick' field='prodNick' />
      <Column header='qty' field='qty' />
      <Column header='updatedBy' field='updatedBy' />

      <Column header='timeAgo'
        body={row => <TimeAgo datetime={row?.updatedOn} />}
      />
      <Column header='updatedOn' 
        body={row => <span>
          {formatTime(row?.updatedOn)} 
        </span>
        } 
      />
      <Column header='action' field='_action' />
    </DataTable>

  </div>)
}