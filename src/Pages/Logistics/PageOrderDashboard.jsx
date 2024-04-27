import { useMemo, useState } from "react"
import { useProducts } from "../../data/product/useProducts"
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { compareBy, keyBy, sumBy, uniqByRdc } from "../../utils/collectionFns"
import { DT } from "../../utils/dateTimeFns"

import "./stylesOrderDashboard.css"

import { Button } from "primereact/button"
import { SelectButton } from "primereact/selectbutton"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Panel } from "primereact/panel"
import { ListBox } from "primereact/listbox"
import { DrilldownCellTemplate } from "../Production/ComponentDrilldownCellTemplate"
import { tablePivot } from "../../utils/tablePivot"
import { round } from "lodash"
import { useRoutes } from "../../data/route/useRoutes"



const useOrderDashboardData = ({ reportDT, shouldFetch }) => {
  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false, shouldFetch })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true,  shouldFetch })
  const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true,  shouldFetch })
  const { data:R3Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 3 }), useHolding: true,  shouldFetch })
  const { data:R4Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 4 }), useHolding: true,  shouldFetch })
  const { data:R5Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 5 }), useHolding: true,  shouldFetch })
  const { data:R6Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 6 }), useHolding: true,  shouldFetch })
  const { data:R7Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 7 }), useHolding: true,  shouldFetch })
  const { data:PRD }      = useProducts({ shouldFetch })
  const { data:RTE }      = useRoutes({ shouldFetch })

  const products = useMemo(() => !!PRD ? keyBy(PRD, P => P.prodNick) : undefined, [PRD])

  const data = useMemo(() => {
    if (!R0Orders || !R1Orders || !R2Orders || !R3Orders || !R4Orders || !R5Orders || !R6Orders || !R7Orders || !products) {
      return undefined
    }

    return [...R0Orders, ...R1Orders, ...R2Orders, ...R3Orders, ...R4Orders, ...R5Orders, ...R6Orders, ...R7Orders ]
      .filter(order => !(order.Type === 'Retail' && order.prodNick === 'brn' && order.locNick.includes('__')))
      .sort(compareBy(order => order.prodNick))
      .sort(compareBy(order => products[order.prodNick].doughNick))
      .sort(compareBy(order => products[order.prodNick].packGroup))
      .sort(compareBy(order => order.meta.routePlan.steps[0].end.place))

  }, [R0Orders, R1Orders, R2Orders, R3Orders, R4Orders, R5Orders, R6Orders, R7Orders, products])

  const packGroups = useMemo(() => {
    return !PRD 
      ? undefined
      : PRD.reduce(uniqByRdc(P => P.packGroup), [])
          .sort(compareBy(P => P.packGroupOrder))
          .map(P => ({ value: P.packGroup, label: !!P.packGroup ? P.packGroup : 'N/A'}))
  }, [PRD])

  const doughNicks = useMemo(() => {
    return !PRD 
      ? undefined
      : PRD.reduce(uniqByRdc(P => P.doughNick), [])
          .sort(compareBy(P => P.doughNick))
          .map(P => ({ value: P.doughNick, label: !!P.doughNick ? P.doughNick : 'N/A'}))
  }, [PRD])

  const shops = [
    { value: 'Carlton', label: 'BPB North' },
    { value: 'Prado',   label: 'BPB South' },
  ]

  const routeNicks = useMemo(() => {
    return !!RTE 
      ? RTE
          .sort(compareBy(R => R.printOrder))
          .map(R => R.routeNick)
      : undefined
  }, [PRD])

  return {
    data,
    products,
    packGroups,
    doughNicks,
    shops,
    routeNicks,
  }

}


// Order Dashboard
const PageOrderDashboard = () => {

  const reportDT = DT.today()
  const { 
    data, 
    products,
    packGroups,
    doughNicks,
    shops,
    routeNicks,
  } = useOrderDashboardData({ reportDT, shouldFetch: true })

  //  Table Config Settings
  // ==================
  const [rowPartitionAttribute, setRowPartitionAttribute] = useState('prodNick') // 'prodNick'|'forBake'
  const rowPartitionAttributeOptions = ['prodNick', 'forBake']
  const [aggregationDate, setAggregationDate] = useState('deliv') // 'deliv|'finish'
  const aggregationDateOptions = [
    { value: 'deliv', label: 'Delivery Date'}, 
    { value: 'finish', label: 'Bake/Pack Date'}
  ]
  const [displayAmount, setDisplayAmount] = useState('qty')   // 'qty'|'ea'|'lbs'
  const displayAmountOptions = [
    { value: 'qty', label: 'Qty/Pks' },
    { value: 'ea',  label: 'Each' },
    { value: 'wt',  label: 'Weight'}
  ]

  const [qtyEditDaysAgo, setQtyEditDaysAgo] = useState() // number of days ago, with respect to the cutoff window

  const [selectedShops, setSelectedShops] = useState([])
  const [hideShops, setHideShops] = useState(true)

  const [selectedPackGroups, setSelectedPackGroups] = useState([])
  const [hidePackGroups, setHidePackGroups] = useState(true)

  const [selectedDoughNicks, setSelectedDoughNicks] = useState([])
  const [hideDoughNicks, setHideDoughNicks] = useState(true)

  const [selectedRouteNicks, setSelectedRouteNicks] = useState([])
  const [hideRouteNicks, setHideRouteNicks] = useState(true)

  const [selectedOrderTypes, setSelectedOrderTypes] = useState([])
  const [hideOrderTypes, setHideOrderTypes] = useState(true)
  const orderTypeOptions = [
    { value: 'Orders',   label: 'Cart' },
    { value: 'Standing', label: 'Standing' },
    { value: 'Holding',  label: 'Holding' },
    { value: 'Retail',  label: 'Retail/Special'},
  ]

  const [selectedLocNicks, setSelectedLocNicks] = useState([])


  //  Table Config Fns
  // ==================
  const getDateValue = (/**@type {CombinedRoutedOrder}*/ order) => aggregationDate === 'deliv'
    ? order.delivDate
    : order.meta.routePlan.steps[0].end.date

  const getPivotValue = (/**@type {CombinedRoutedOrder[]|undefined}*/orders) => {
    if (!products || !orders) return ''
    switch (displayAmount) {
      case 'qty': return sumBy(orders, order => order.qty) 
      case 'ea':  return sumBy(orders, order => order.qty * products[order.prodNick].packSize) 
      case 'wt':  return round(sumBy(orders, order => order.qty * products[order.prodNick].packSize * products[order.prodNick].weight), 1)
      default: return ''
    }
  }

  const reportOrderDT = DT.now().plus({ hours: 4 }).startOf('day')
  const getOrderEditDaysAgo = timestamp => 
    reportOrderDT.diff(DT.fromIsoTs(timestamp).plus({ hours: 4 }).startOf('day'), 'days').days

  const applyUiFilters = (/**@type {CombinedRoutedOrder[]|undefined}*/orders) => {
    if (!products || !orders) return orders
    let _orders = orders
    if (selectedShops.length > 0)      _orders = _orders.filter(o => selectedShops.includes(o.meta.routePlan.steps[0].end.place))
    if (selectedPackGroups.length > 0) _orders = _orders.filter(o => selectedPackGroups.includes(products[o.prodNick].packGroup))
    if (selectedDoughNicks.length > 0) _orders = _orders.filter(o => selectedDoughNicks.includes(products[o.prodNick].doughNick))
    if (selectedRouteNicks.length > 0) _orders = _orders.filter(o => selectedRouteNicks.includes(o.meta.routeNick))
    if (selectedOrderTypes.length > 0) _orders = _orders.filter(o => selectedOrderTypes.includes(o.Type))
    if (qtyEditDaysAgo >= 0) _orders = _orders.filter(o => getOrderEditDaysAgo(o.qtyUpdatedOn) <= qtyEditDaysAgo)
    
    return _orders
  }

  //  Build Pivot Table
  // ===================
  const pivotDTs = [0,1,2,3,4,5,6].map(days => reportDT.plus({ days }))
  

  const buildRowPartitionModel = () => {
    let model = {}
    if (!products || rowPartitionAttribute === 'prodNick') {
      Object.assign(model, { prodNick: order => order.prodNick })
    } else {
      Object.assign(model, { forBake: order => products[order.prodNick].forBake })
    }
    if (!hideShops)      Object.assign(model, { shop:      order => order.meta.routePlan.steps[0].end.place })
    if (!hideRouteNicks) Object.assign(model, { routeNick: order => order.meta.routeNick})
    if (!products) return model
    if (!hidePackGroups) Object.assign(model, { packGroup: order => products[order.prodNick].packGroup })
    if (!hideDoughNicks) Object.assign(model, { doughNick: order => products[order.prodNick].doughNick})
    if (!hideOrderTypes) Object.assign(model, { Type:      order => order.Type})

    return model
  }
  
  const displayData = applyUiFilters(data) ?? []

  const pivotData = tablePivot(
    displayData,
    buildRowPartitionModel(),
    getDateValue,
    orders => getPivotValue(orders),
  )




  return (
    <div style={{ padding: "2rem 5rem 5rem 5rem", maxWidth: "100rem", margin: "auto" }}>
      <h1>Order Dashboard</h1>

      <div style={{marginBlock: "1rem"}}>
        Group Rows By: 
        <SelectButton 
          value={rowPartitionAttribute} 
          options={rowPartitionAttributeOptions} 
          onChange={e => { if (e.value) setRowPartitionAttribute(e.value) }} 
        />
        Group Columns By: 
        <SelectButton 
          value={aggregationDate} 
          options={aggregationDateOptions} 
          onChange={e => { if (e.value) setAggregationDate(e.value) }} 
        />
        Count By: 
        <SelectButton 
          value={displayAmount} 
          options={displayAmountOptions} 
          onChange={e => { if (e.value) setDisplayAmount(e.value) }}
         />
      </div>

      <div style={{display: "grid", gridTemplateColumns: "12rem 1fr", columnGap: "1rem"}}>
        <div>
          <Panel 
            header={<div>Shop</div>} 
            icons={
              <i className={hideShops ? "pi pi-minus" : "pi pi-bars"} 
                onClick={() => setHideShops(!hideShops)} 
                style={{cursor: "pointer", paddingInline: ".5rem"}} 
              />
            }
            className="bpb-order-dash-panel" 
            style={{marginBottom: "1rem"}}
          >
            <ListBox 
              value={selectedShops} 
              options={shops} 
              onChange={e => setSelectedShops(e.value)} 
              multiple 
              style={{border: "none"}} 
            />
          </Panel>
          <Panel 
            header={<div>Pack Group</div>} 
            icons={
              <i className={hidePackGroups ? "pi pi-minus" : "pi pi-bars"} 
                onClick={() => setHidePackGroups(!hidePackGroups)} 
                style={{cursor: "pointer", paddingInline: ".5rem"}} 
              />
            }
            className="bpb-order-dash-panel" 
            style={{marginBottom: "1rem"}}
          >
            <ListBox 
              value={selectedPackGroups} 
              options={packGroups} 
              onChange={e => setSelectedPackGroups(e.value)} 
              multiple 
              style={{border: "none"}} 
            />
          </Panel>
          <Panel 
            header={<div>Dough Type</div>} 
            icons={
              <i className={hideDoughNicks ? "pi pi-minus" : "pi pi-bars"} 
                onClick={() => setHideDoughNicks(!hideDoughNicks)} 
                style={{cursor: "pointer", paddingInline: ".5rem"}} 
              />
            }
            className="bpb-order-dash-panel" 
            style={{marginBottom: "1rem"}}
          >
            <ListBox 
              value={selectedDoughNicks} 
              options={doughNicks} 
              onChange={e => setSelectedDoughNicks(e.value)} 
              multiple 
              style={{border: "none"}} 
            />
          </Panel>
          <Panel 
            header="Route"
            icons={
              <i className={hideRouteNicks ? "pi pi-minus" : "pi pi-bars"} 
                onClick={() => setHideRouteNicks(!hideRouteNicks)} 
                style={{cursor: "pointer", paddingInline: ".5rem"}} 
              />
            }
            className="bpb-order-dash-panel" 
            style={{marginBottom: "1rem"}}
          >
            <ListBox 
              value={selectedRouteNicks} 
              options={routeNicks} 
              onChange={e => setSelectedRouteNicks(e.value)} 
              multiple 
              style={{border: "none"}} 
            />
          </Panel>
          <Panel 
            header="Order Type"
            icons={
              <i className={hideOrderTypes ? "pi pi-minus" : "pi pi-bars"} 
                onClick={() => setHideOrderTypes(!hideOrderTypes)} 
                style={{cursor: "pointer", paddingInline: ".5rem"}} 
              />
            }
            className="bpb-order-dash-panel" 
            style={{marginBottom: "1rem"}}
          >
            <ListBox 
              value={selectedOrderTypes} 
              options={orderTypeOptions} 
              onChange={e => setSelectedOrderTypes(e.value)} 
              multiple 
              style={{border: "none"}} 
            />
          </Panel>

          
        </div>

        <DataTable
          value={pivotData}
          responsiveLayout="scroll"
          removableSort
          sortMode="multiple"
        >
          {!hideShops && <Column header={<div>Make<br/>Where</div>} field={`rowProps.shop`} sortable />}
          {!hidePackGroups && <Column header="Pack Group" field={`rowProps.packGroup`} sortable />}
          {!hideDoughNicks && <Column header="Dough Type" field={`rowProps.doughNick`} sortable />}
          {!hideRouteNicks && <Column header="Route" field={`rowProps.routeNick`} sortable />}
          {!hideOrderTypes && <Column header="Type" field={`rowProps.Type`} sortable />}
          <Column header={rowPartitionAttribute} field={`rowProps.${rowPartitionAttribute}`} sortable />
          {pivotDTs.map((dt, idx) => {
            const date = dt.toFormat('yyyy-MM-dd')

            return <Column 
              header={<div>{dt.toFormat('EEE')}<br/>{dt.toFormat('M/d')}</div>} 
              key={idx} 
              // field={`colProps.${date}.value`}
              body={row => {
                if ((row.colProps[date]?.items ?? []).some(item => item === undefined)) console.log("ERR", row.colProps[date].items)
                return DrilldownCellTemplate({
                  dialogHeader: row.rowProps.prodNick,
                  tableData: row.colProps[date]?.items ?? [],
                  cellValue: row.colProps[date]?.value,
                  valueType: displayAmount,
                  products
                })}
              }
              style={{minWidth: "6.5rem"}}
            />
          })}

        </DataTable>
      </div>

    </div>
  )
}

export { PageOrderDashboard as default }