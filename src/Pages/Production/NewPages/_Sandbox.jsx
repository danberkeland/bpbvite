import { DataTable } from "primereact/datatable"
import { useOrderSubscription } from "../../../data/swr2.x.x/useSubscription"
import { Column } from "primereact/column"
import { DateTime } from "luxon"
import { orderBy } from "lodash"
import TimeAgo from "timeago-react"
import { Button } from "primereact/button"
import { syncSquareOrders } from "../../../helpers/databaseFetchers"
import { useListData } from "../../../data/_listData"


// const formatTime = (isoStr) => DateTime.fromISO(isoStr)
//   .setZone('America/Los_Angeles')
//   .toFormat('MMM dd, h:mm a')

const syncSquare = ({ productCache, orderCache }) => {
  (!!productCache.data && !!orderCache.data) 
    ? syncSquareOrders({ productCache, orderCache })
    : console.log("product data required to execute")
}

export const Sandbox = () => {

  const productCache = useListData({ tableName: "Product", shouldFetch: true })
  const orderCache = useListData({ tableName: "Order", shouldFetch: true })


  // const { data } = useOrderSubscription()

  // const tableData = orderBy(
  //   data,
  //   'updatedOn', 
  //   'desc'
  // )

  return (<div>
    {/* <DataTable 
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
    </DataTable> */}

    <Button label="Test Square" 
      onClick={() => syncSquare({ productCache, orderCache })}
    />


  </div>)
}