// View all (complete) orders that have items edited today.

import { DateTime } from "luxon";
import { useListData } from "../../../data/_listData";
import { flatten, groupBy, mapValues, maxBy, orderBy, pickBy, set, sortBy, uniqBy } from "lodash";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";


const iso2Weekday = (isoDate) => {
  const [year, month, day] = isoDate.split('-')
  const dateDT = DateTime.fromObject({ year, month, day })
  return dateDT.toFormat('EEE')
}


const iso2RelDate = (isoDate, todayDT) => {
  const [year, month, day] = isoDate.split('-')
  const dateDT = DateTime.fromObject({ year, month, day })

  let diff = dateDT.diff(todayDT, 'days').toObject().days
  return `T +${diff}`
}

const testUpdatedToday = (rowData) => {
  const timestamp = rowData.updatedOn || rowData.updatedAt
  const tsDate = DateTime.fromISO(timestamp).setZone('America/Los_Angeles').startOf('day')
  const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
  
  return tsDate.toMillis() === todayDT.toMillis()
 
}

const dedupeCart = (cartOrders) => {
  const groupedData = groupBy(
    cartOrders,
    order => `${order.locNick}.${order.delivDate}.${order.prodNick}`,
  )
  
  const keyedCart = mapValues(
    groupedData,
    group => {
      if (group.length > 1) {console.log('duplicate cart found')}
      const orderedGroup = orderBy(group, 'updatedOn', 'desc')
      return orderedGroup[0]

    }
  )

  return Object.values(keyedCart)

}

/**
 * If an order item was updated today, include all order items for the same
 * loction & delivDate.
 */
const pickCartOrders = (cartOrders, todayISO) => {
  const groupedData = groupBy(
    cartOrders,
    order => `${order.locNick}.${order.delivDate}`
  )

  const pickedOrders = pickBy(
    groupedData,
    orderList => orderList.some(order => 
      DateTime.fromISO(order.updatedOn)
        .setZone('America/Los_Angeles')
        .startOf('day')
        .toISODate() === todayISO
    )
  )

  return flatten(Object.values(pickedOrders))

}

/**
 * groups orders by location/date, then keys group items on prodNick.
 * @param {*} cartOrders cart data in canonical array-of-object form
 */
const nestCartOrders = (cartOrders) => {
  let nestedObj = {}
  for(let order of cartOrders) {
    set(nestedObj, `${order.locNick}#${order.delivDate}.${order.prodNick}`, order)
  }

  return nestedObj
}

const nestStandingOrders = (standingOrders) => {
  let nestedObj = {}
  for(let order of standingOrders) {
    set(nestedObj, `${order.locNick}#${order.dayOfWeek}.${order.prodNick}`, order)
  }

  return nestedObj
}

const makeTreeData = (data, keyAttribute, parentKey) => {

  const groupedData = groupBy(data, keyAttribute)

  return Object.keys(groupedData).map(groupKey => ({
    key: parentKey ? `${parentKey}#${groupKey}` : groupKey,
    data: groupedData[groupKey]
  }))

}



// orders for today & future dates
const useOrdersEditedToday = ({ daysAhead=0 }={}) => {
  const { data:cart } = useListData({
    tableName: 'Order',
    shouldFetch: true,
  })

  const { data:standing } = useListData({
    tableName: 'Standing',
    shouldFetch: true
  })

  const composeData = () => {
    if (!cart || !standing) return undefined

    const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
    const todayISO = daysAhead >= 0 
      ? todayDT.plus({ days: daysAhead }).toISODate()
      : todayDT.minus({ days: daysAhead * -1 }).toISODate()

    const dedupedCart = dedupeCart(cart)
    const cartToUse = pickCartOrders(dedupedCart, todayISO)

    const nestedCart = nestCartOrders(cartToUse)
    
    const nestedStanding = nestStandingOrders(
      standing.filter(order => order.isStand === true)
    )
    

    //nested array
    const combinedValues = Object.keys(nestedCart).map(cartKey => {
      const [locNick, delivDate] = cartKey.split('#')
      const standingKey = `${locNick}#${iso2Weekday(delivDate)}`

      const _standing = mapValues(
        nestedStanding[standingKey],
        order => ({
          ...order,
          delivDate
        })
      )

      const combinedOrder = {
        ..._standing,
        ...nestedCart[cartKey]
      }

      const combinedOrderWithExtras = mapValues(combinedOrder, orderItem => {
        const maxTsItem = maxBy(
          Object.values(combinedOrder),
          item => (item.updatedOn || item.updatedAt)
        )

        return {
          ...orderItem,
          updatedToday: testUpdatedToday(orderItem),
          orderUpdatedOn: maxTsItem.updatedOn || maxTsItem.updatedAt,
        }
      })

      return Object.values(combinedOrderWithExtras)
    })


    // console.log('dedupedCart', dedupedCart)
    // console.log('cartToUse', cartToUse)
    // console.log('nestedCart', nestedCart)
    // console.log('nestedStanding', nestedStanding)
    // console.log('combinedOrders', combinedOrders)

    return orderBy(
      flatten(combinedValues),
      [
        'orderUpdatedOn', 
        'prodNick',
      ],
      [
        'desc',
        'asc',
      ]
    )

  }


  return {
    data: composeData()
  }

}



export const OrderReview = () => {
  const { data:orders } = useOrdersEditedToday()
  const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')

  if (!orders) return <div>Loading...</div>

  return (
    <div>
      <h1>Orders edited today</h1>
      <DataTable 
        value={orders}
        responsiveLayout="scroll"
      >
        <Column header="Location" body={rowData => {
          const splitString = rowData.locNick.split('__')
          const displayValue = splitString[0] + (splitString[1] ? ' (Square)' : '')
          return <FormattedRow rowData={rowData}>{displayValue}</FormattedRow>
        }}
      />
        <Column header="For Date" body={rowData => {
          const displayValue = rowData.delivDate
          return <FormattedRow rowData={rowData}>{displayValue}</FormattedRow>
        }}/>
        <Column header="Day" body={rowData => {
          const displayValue = iso2Weekday(rowData.delivDate)
          return <FormattedRow rowData={rowData}>{displayValue}</FormattedRow>
        }}/>
        <Column header="T +N" body={rowData => {
          const displayValue = iso2RelDate(rowData.delivDate, todayDT)
          return <FormattedRow rowData={rowData}>{displayValue}</FormattedRow>
        }}/>
        <Column header="Product" body={rowData => {
          const displayValue = rowData.prodNick
          return <FormattedRow rowData={rowData}>{displayValue}</FormattedRow>
        }}/>
        <Column header="Qty" body={rowData => {
          const displayValue = rowData.qty
          return <FormattedRow rowData={rowData}>{displayValue}</FormattedRow>
        }}/>
        <Column header="Changed By" body={rowData => {
          const displayValue = rowData.updatedBy
          return <FormattedRow rowData={rowData}>{displayValue}</FormattedRow>
        }}/>
      </DataTable>
      {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}
      
    </div>
  )
}

const FormattedRow = (props) => {
  return (
    <div style={{fontWeight: props.rowData.updatedToday ? 'bold' : ''}}>
      {props.children}
    </div>
  )
}