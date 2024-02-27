import gqlFetcher from "../../../../data/_fetchers"

import useSWR from 'swr'
import { getProduct } from "../../../../graphqlCustom/queries/_getQueries"
import { DateTime } from "luxon"
import { useMemo } from "react"
import { flatten, groupBy, mapValues, orderBy, round, set, sumBy } from "lodash"
import { DataTable } from "primereact/datatable"
import { TreeTable } from 'primereact/treetable'
import { Column } from "primereact/column"
import { useListData } from "../../../../data/_listData"

const briocheProdNicks = ['bz', 'lgbz', 'brsl', 'bri', 'zdog']
const qtyPlaceholder = { bz: 0, lgbz: 0, brsl: 0, bri: 0 }
const emptyQtyPlaceholder = { bz: '', lgbz: '', brsl: '', bri: '' }


const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
const getRelativeIsoDate = (daysAhead) => todayDT.plus({ days: daysAhead }).toISODate()
const getRelativeWeekday = (daysAhead) => todayDT.plus({ days: daysAhead }).toFormat('EEE')

/**
 * ReLU, the "rectified linear unit" function (it's a thing, google it).
 * 
 * "Converts negative numbers to 0 and otherwise preserves them."
 * @param {number} x
 */
const relu = (x) => x >= 0 ? x : 0

// const convertToTreeStructure = (data, iteratee) => {
//   const groupedData = groupBy(data, iteratee)

//   const foo = Object.entries(treeData).map(entry => ({
//     key: `${data.key ? data.key + '.' : ''}${entry[0]}`,
//     data: {},
//     children: {}
//   }))
// }

// const makeTreeData = (data, groupByIteratees) => {
  
//   for (let iter of groupByIteratees) {
//     groupedData = groupBy(data, iter)
//   }

// }

const useProduct = (prodNick) => {
  const { data } = useSWR(
    [getProduct, { prodNick }],
    gqlFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true
    }
  )

  return {
    data: data?.data.getProduct
  }
}

const useCartOrderByDate = (delivDate) => {
  const { data } = useListData({
    tableName: "Order",
    customQuery: "orderByDelivDate",
    variables: { 
      delivDate,
      limit: 5000,
    },
    shouldFetch: true,
  })

  if (data) {
    const dupeTest = groupBy(
      data, 
      order => `${order.locNick}#${order.prodNick}`
    )

    Object.values(dupeTest).forEach(group => {
      if (group.length > 1) {
        console.log("duplicates detected", group)
      }
    })
  }

  return {
    data: data 
      ? data.filter(order => briocheProdNicks.includes(order.prodNick))
      : undefined
  }

}

const useStandingOrderByWeekday = (dayOfWeek) => {
  const { data } = useListData({
    tableName: "Standing",
    customQuery: "standingByDayOfWeek",
    variables: { 
      dayOfWeek,
      limit: 5000,
    },
    shouldFetch: true,
  })

  if (data) {
    const dupeTest = groupBy(
      data, 
      order => `${order.locNick}#${order.prodNick}#${order.isStand}`
    )

    Object.values(dupeTest).forEach(group => {
      if (group.length > 1) {
        console.log("duplicates detected", group)
      }
    })
  }

  return {
    data: data 
      ? data.filter(order => briocheProdNicks.includes(order.prodNick))
      : undefined
  }
  
}

const useFullOrderByRelativeDate = ({ daysAhead, includeHolding=true }) => {
  const delivDate = getRelativeIsoDate(daysAhead)
  const dayOfWeek = getRelativeWeekday(daysAhead)
  
  const { data:cart } = useCartOrderByDate(delivDate)
  const { data:standing } = useStandingOrderByWeekday(dayOfWeek)

  const composeFullOrders = () => {
    if (!cart || !standing) return undefined

    const holdingEntries = includeHolding 
      ? orderBy(
          standing
            .filter(order => briocheProdNicks.includes(order.prodNick))
            .filter(S => S.isStand === false)
            .map(S => ([`${S.locNick}.${S.prodNick}`, {...S, type: 'H'}])),
          'updatedAt',
          'desc'
        )
      : []

    const standingEntries = orderBy(
      standing
        .filter(order => briocheProdNicks.includes(order.prodNick))
        .filter(S => S.isStand === true)
        .map(S => ([`${S.locNick}.${S.prodNick}`, {...S, type: 'S'}])),
      'updatedAt',
      'desc'
    )

    const cartEntries = orderBy(
      cart
        .filter(order => briocheProdNicks.includes(order.prodNick))
        .map(C => ([`${C.locNick}.${C.prodNick}`, {...C, type: 'C'}])),
      'updatedOn',
      'desc'
    )

    const fullOrderDict = {
      ...Object.fromEntries(holdingEntries),
      ...Object.fromEntries(standingEntries),
      ...Object.fromEntries(cartEntries)
    }

    const fullOrders = Object.values(fullOrderDict)
      .map(order => ({
        prodNick: order.prodNick,
        locNick: order.locNick,
        qty: order.qty,
        route: order.route,
        type: order.type,
        isWhole: order.isWhole,
        relativeDate: daysAhead,
        delivDate,
        dayOfWeek,
      }))

    return fullOrders

  }

  return ({
    data: useMemo(composeFullOrders, [cart, standing])
  })
  
}

const useFullOrderReport = () => {
  const { data:bz } = useProduct('bz')
  const { data:lgbz } = useProduct('lgbz')
  const { data:brsl } = useProduct('brsl')
  const { data:bri } = useProduct('bri')
  const { data:zdog } = useProduct('zdog')
  const productArray = [bz, lgbz, brsl, bri, zdog]
  const products = { bz, lgbz, brsl, bri, zdog }

  const { data:T0 } = useFullOrderByRelativeDate({ daysAhead: 0 })
  const { data:T1 } = useFullOrderByRelativeDate({ daysAhead: 1 })
  const { data:T2 } = useFullOrderByRelativeDate({ daysAhead: 2 })
  const { data:T3 } = useFullOrderByRelativeDate({ daysAhead: 3 })
  const allOrderData = [T0, T1, T2, T3]

  const allLoaded = [...productArray, ...allOrderData].every(data => !!data)
  if (!allLoaded) return { data: undefined }

  const allOrders = allOrderData.map(TN => TN.filter(order => order.type !== 'H'))
  const allHolding = allOrderData.map(TN => TN.filter(order => order.type === 'H'))

  const makeNodes = (TN, idx, typeString) => {
    const TNPivoted = Object.values(
      mapValues(
        groupBy(TN, 'locNick'),
        group => ({
          key: `T${idx}.${group[0].locNick}`,
          data: {
            label: group[0].locNick,
            data: group[0].locNick,
            ...emptyQtyPlaceholder,
            ...Object.fromEntries(group.map(order => 
              ([order.prodNick, order.qty * products[order.prodNick].packSize]))
            )
          }
        })
      )
    )
  
    const TNnode = {
      key: `T${idx}.${typeString}`,
      data: {
        label: `${typeString} - ${getRelativeWeekday(idx)}, Today +${idx}`,
        ...qtyPlaceholder,
        ...mapValues(
          groupBy(TN, 'prodNick'),
          group => sumBy(group, order => 
            order.qty * products[order.prodNick].packSize
          )
        )
      },
      children: TNPivoted
    }

    return TNnode
  }

  const orderNodes = allOrders.map((TN, idx) => makeNodes(TN, idx, 'Orders'))
  const holdingNodes = allHolding.map((TN, idx) => makeNodes(TN, idx, 'Holding'))

  const bakeExtraNode = {
    key: "bakeExtra",
    data: {
      label: 'bakeExtra',
      ...Object.fromEntries(productArray.map(P => 
        [P.prodNick, P.bakeExtra]
      ))
    }
  }

  const currentStockNode = {
    key: "currentStock",
    data: {
      label: 'Inventory',
      ...Object.fromEntries(productArray.map(P => 
        [P.prodNick, P.currentStock * P.packSize * -1]
      ))
    }
  }

  const T0BakeNodes = [ 
    orderNodes[0], 
    orderNodes[1], 
    holdingNodes[1], 
    bakeExtraNode, 
    currentStockNode 
  ].map(node => ({ ...node, key: `standardBakeTotal.${node.key}`}))

  const standardBakeFormula = (prodNick) => Math.ceil(relu(
    sumBy(T0BakeNodes, node => node.data[prodNick])
  ) / products[prodNick].batchSize) * products[prodNick].batchSize

  const T0bake = {
    key: "standardBakeTotal",
    data: {
      label: "Bake Total - Standard",
      ...mapValues(products, P => standardBakeFormula(P.prodNick)),
    },
    children: T0BakeNodes
  }

  const T0MaxSafeBakeNodes = [ 
    orderNodes[0], 
    orderNodes[1], 
    holdingNodes[1], 
    orderNodes[2], 
    currentStockNode 
  ].map(node => ({ ...node, key: `maxBakeTotal.${node.key}`}))

  const maxSafeFormula = (prodNick) => Math.floor(relu(
    sumBy(T0MaxSafeBakeNodes, node => node.data[prodNick])
  ) / products[prodNick].batchSize) * products[prodNick].batchSize

  const T0MaxSafeBake = {
    key: "maxBakeTotal",
    data: {
      label: "Bake Total - 'Max Safe'",
      ...mapValues(products, P => maxSafeFormula(P.prodNick)),
    },
    children: T0MaxSafeBakeNodes
  }

  // Mix Stuff
  const EODGuessNodes = [
    currentStockNode,
    {
      key: "standardBakeNegative",
      data: mapValues(
        T0bake.data, 
        value => typeof value === 'number' ? value * -1 : value
      )
    },
    orderNodes[0]
  ].map(node => ({ ...node, key: `eodGuess.${node.key}`}))

  const eodGuessFormula = (prodNick) => 
    currentStockNode.data[prodNick] 
    - T0bake.data[prodNick] 
    + orderNodes[0].data[prodNick]

  const EODGuessNode = {
    key: "eodGuess",
    data: {
      label: "EOD Guess = Tomorrow's Stock",
      ...mapValues(products, P => eodGuessFormula(P.prodNick)),
    },
    children: EODGuessNodes
  }

  const T0MixNodes = [ 
    orderNodes[1], 
    orderNodes[2], 
    holdingNodes[2], 
    bakeExtraNode, 
    EODGuessNode 
  ].map(node => ({ ...node, key: `standardMixTotal.${node.key}`}))

  const standardMixFormula = (prodNick) => Number((
    Math.ceil(relu(
      sumBy(T0MixNodes, node => node.data[prodNick])
    ) / products[prodNick].batchSize) * products[prodNick].batchSize
  ).toFixed(1))

  let T0Mix = {
    key: "standardMixTotal",
    data: {
      label: "Mix - Standard",
      ...mapValues(products, P => standardMixFormula(P.prodNick)),
    },
    children: T0MixNodes
  }
  T0Mix.data.total = Number(
    sumBy(
      briocheProdNicks,
      pn => T0Mix.data[pn] * products[pn].weight
    ).toFixed(1)
  )

  const T0MaxSafeMixNodes = [
    orderNodes[1], 
    orderNodes[2], 
    holdingNodes[2], 
    orderNodes[3], 
    EODGuessNode
  ].map(node => ({ ...node, key: `maxSafeMixTotal.${node.key}` }))

  const maxSafeMixFormula = (prodNick) => Number((
    Math.floor(relu(
      sumBy(T0MaxSafeMixNodes, node => node.data[prodNick])
    ) / products[prodNick].batchSize) * products[prodNick].batchSize
  ).toFixed(1))


  let T0MaxSafeMix = {
    key: "maxSafeMixTotal'",
    data: {
      label: "Mix - 'Max Safe'",
      ...mapValues(products, P => maxSafeMixFormula(P.prodNick)),
    },
    children: T0MaxSafeMixNodes
  }
  T0MaxSafeMix.data.total = Number(
    sumBy(
      briocheProdNicks,
      pn => T0MaxSafeMix.data[pn] * products[pn].weight
    ).toFixed(1)
  )

  return { 
    todaysBake: [T0bake, T0MaxSafeBake],
    todaysMix: [T0Mix, T0MaxSafeMix]
  }
}

const useOrderProjection = () => {
  const { data:bz } = useProduct('bz')
  const { data:lgbz } = useProduct('lgbz')
  const { data:brsl } = useProduct('brsl')
  const { data:bri } = useProduct('bri')
  const { data:zdog } = useProduct('zdog')

  const { data: T0 } = useFullOrderByRelativeDate({ daysAhead: 0 })
  const { data: T1 } = useFullOrderByRelativeDate({ daysAhead: 1 })
  const { data: T2 } = useFullOrderByRelativeDate({ daysAhead: 2 })
  const { data: T3 } = useFullOrderByRelativeDate({ daysAhead: 3 })
  const { data: T4 } = useFullOrderByRelativeDate({ daysAhead: 4 })
  const { data: T5 } = useFullOrderByRelativeDate({ daysAhead: 5 })
  const { data: T6 } = useFullOrderByRelativeDate({ daysAhead: 6 })

  const allOrderData = [T0, T1, T2, T3, T4, T5, T6]
  const productArray = [bz, lgbz, brsl, bri, zdog]
  const products = { bz, lgbz, brsl, bri, zdog }

  const allLoaded = [ ...productArray, ...allOrderData ].every(data => !!data)
  if (!allLoaded) return { data: undefined }

  const productRows = productArray.map(P => ({
    label: P.prodNick,
    ...Object.fromEntries(allOrderData.map((TN, idx) => 
      [
        `T${idx}`, 
        sumBy(
          TN.filter(order => order.prodNick === P.prodNick), 
          order => order.qty * products[order.prodNick].packSize
        )
      ]
    ))
  }))

  const rowData = productRows.concat({
    label: "Total Weight",
    ...Object.fromEntries(
      ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6'].map(qtyKey => 
        [
          qtyKey,
          round(sumBy(
            productRows,
            row => row[qtyKey] * products[row.label].weight
          ), 1)
        ]
      )
    )
  })
  


  // with grouping

  const productRowTemplate = briocheProdNicks.map(pn => ({
    key: pn,
    data: { label: pn },
    children: [],
  }))

  const ordersByProductByTypeByLocation = groupBy(
    flatten(allOrderData),
    order => `${order.prodNick}.${order.type === 'H' ? 'H' : 'CS'}.${order.locNick}`
  )

  const datePlaceholder = { T0: 0, T1: 0, T2: 0, T3: 0, T4: 0, T5: 0, T6: 0 }
  const withPivotedQtys = mapValues(
    ordersByProductByTypeByLocation,
    group => ({
      ...datePlaceholder,
      ...mapValues(
        groupBy(group, order => `T${order.relativeDate}`),
        group => sumBy(group, order => {
          if (!products[order.prodNick]) console.log(order.prodNick)
          return order.qty * products[order.prodNick].packSize
        })
      )
    })
  ) 
  let nestedOrders = {}
  Object.entries(withPivotedQtys).forEach(entry => 
    set(nestedOrders, entry[0], entry[1])
  )


  //console.log('rowData', rowData)
  console.log('allOrderData', allOrderData)
  console.log('ordersByProductByTypeByLocation', ordersByProductByTypeByLocation)
  console.log('nestedOrders', nestedOrders)
  return { rowData }

}




export const BriocheCalc = () => {
  const { todaysBake, todaysMix } = useFullOrderReport()
  const { rowData } = useOrderProjection()
  if (!todaysBake || !todaysMix || !rowData) return <div>loading...</div>

  return (
    <div>
      <h1>Brioche Calcs: {getRelativeWeekday(0)}, {getRelativeIsoDate(0)}</h1>

      <p>
        This calculator will help us estimate how much brioche dough is needed 
        for today. Shelf stock (yesterday's EOD) is an important part of this --
        Make sure those totals are accurate first.
      </p>
      <p>
        Two strategies are offered here. The first is the standard calculation
        found in "What to Bake." The tables below expand to show the source of
        our bake/mix requirements. Some sources are known, while others represent
        a guess or buffer to catch orders placed after the mix is completed.
      </p><p>
        The second strategy swaps the bakeExtra guess with known orders an extra 
        day ahead. These items are considered 'safe' to produce because shelf 
        life still permits us to deliver these items. Holding orders
        are included since they typically represent potential next-day orders
        that we need to be able to fulfill.
      </p>
      <p>
        Totals are not exact sums of their component parts as they are rounded 
        to batch-size multiples.
      </p>
      <p>
        Mix predictions tend to underestimate our dough needs. It mostly serves 
        to show what is being made to order (known) vs to stock (guessing).
      </p>

      <h2>Bake Strategies for Today</h2>

      <TreeTable value={todaysBake} >
        <Column field="label" header="Bake Strategies for Today" expander style={{ width: '30rem' }}/>
        <Column field="bz" header="bz"/>
        <Column field="lgbz" header="lgbz" />
        <Column field="brsl" header="brsl" />
        <Column field="bri" header="bri" />
      </TreeTable>

      <h2>Mix for Tomorrow's Bake</h2>

      <p> 
        EOD Guess = (Today's standard bake total) + (current shelf stock) - (today's orders).
      </p>
      <p>Individual products are counted as ea, but are totaled together by Weight.</p>

      <TreeTable value={todaysMix} >
        <Column field="label" header="Mix Strategies for Tomorrow's Bake" expander style={{ width: '30rem' }}/>
        <Column field="bz" header="bz"/>
        <Column field="lgbz" header="lgbz" />
        <Column field="brsl" header="brsl" />
        <Column field="bri" header="bri" />
        <Column field="total" header="Total (lb.)" />
      </TreeTable>

      <h2>Order Outlook</h2>
      <p>
        Includes holding orders. Does not include bakeExtra.
      </p>

      <DataTable value={rowData}
        responsiveLayout="scroll"
      >
        <Column field="label" />
        {
          ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6'].map((columnKey, idx) => <Column  
            key={`projTable.${columnKey}`}
            field={columnKey}
            header={() => <>
              <div>{getRelativeWeekday(idx)}</div>
              <div>{columnKey}</div>
            </>}
          />)
        }
      </DataTable>
      

    </div>
  )
}
