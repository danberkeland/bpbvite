import { useMemo, useRef, useState } from "react"

import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { useRoutes } from "../../data/route/useRoutes"
import { useProducts } from "../../data/product/useProducts"

import { AutoComplete } from "primereact/autocomplete"
import { Chip } from "primereact/chip"
import { Button } from "primereact/button"
import { SelectButton } from "primereact/selectbutton"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Panel } from "primereact/panel"
import { ListBox } from "primereact/listbox"
import { DrilldownCellTemplate } from "../Production/ComponentDrilldownCellTemplate"

import { compareBy, countByRdc, keyBy, sumBy, uniqByRdc } from "../../utils/collectionFns"
import { DT } from "../../utils/dateTimeFns"
import { tablePivot } from "../../utils/tablePivot"
import { round } from "lodash"
import { rankedSearch } from "../../utils/textSearch"

import "./stylesOrderDashboard.css"
import { useLocations } from "../../data/location/useLocations"

const useOrderDashboardData = ({ reportDT, shouldFetch }) => {
  const showCustom = true
  const showRetailBrn = true
  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false, shouldFetch, showCustom, showRetailBrn })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true,  shouldFetch, showCustom, showRetailBrn })
  const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true,  shouldFetch, showCustom, showRetailBrn })
  const { data:R3Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 3 }), useHolding: true,  shouldFetch, showCustom, showRetailBrn })
  const { data:R4Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 4 }), useHolding: true,  shouldFetch, showCustom, showRetailBrn })
  const { data:R5Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 5 }), useHolding: true,  shouldFetch, showCustom, showRetailBrn })
  const { data:R6Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 6 }), useHolding: true,  shouldFetch, showCustom, showRetailBrn })
  const { data:R7Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 7 }), useHolding: true,  shouldFetch, showCustom, showRetailBrn })
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
    return (!PRD || !products)
      ? undefined
      : PRD.reduce(uniqByRdc(P => P.packGroup), [])
          .sort(compareBy(P => P.packGroupOrder))
          .map(P => ({ value: P.packGroup, label: !!P.packGroup ? P.packGroup : 'N/A', test: order => products[order.prodNick]?.packGroup === P.packGroup }))
  }, [PRD])


  const doughNicks = useMemo(() => {
    return (!PRD || !products)
      ? undefined
      : PRD.reduce(uniqByRdc(P => P.doughNick), [])
          .sort(compareBy(P => P.doughNick))
          .map(P => ({ value: P.doughNick, label: !!P.doughNick ? P.doughNick : 'N/A', test: order => products[order.prodNick]?.doughNick === P.doughNick }))
  }, [PRD])

  const getShop = order => order.meta.routePlan.steps[0].end.place
  const shops = [
    { value: 'Carlton', label: 'North/Carlton', test: order => getShop(order) === 'Carlton', filterValues: (data ?? []).map(order => getShop(order) === 'Carlton')},
    { value: 'Prado',   label: 'South/Prado',   test: order => getShop(order) === 'Prado',   filterValues: (data ?? []).map(order => getShop(order) === 'Prado') },
  ]

  const routeNicks = useMemo(() => {
    return !!RTE 
      ? RTE
          .sort(compareBy(R => R.printOrder))
          .map(R => ({ value: R.routeNick, label: R.routeNick, test: order => order.meta.routeNick === R.routeNick, filterValues: order => order.meta.routeNick === R.routeNick }))
      : undefined
  }, [RTE])

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
  const [rowPartitionAttribute, setRowPartitionAttribute] = useState('prodNick') // 'prodNick'|'prodName'|'forBake'
  const rowPartitionAttributeOptions = ['prodNick', 'prodName', 'forBake']

  const [aggregationDate, setAggregationDate] = useState('deliv') // 'deliv|'finish'
  const aggregationDateOptions = [
    { value: 'deliv', label: 'Delivery Date'}, 
    { value: 'finish', label: 'Bake/Pack Date'}
  ]
  const [displayAmount, setDisplayAmount] = useState('qty') // 'qty'|'ea'|'wt'
  const displayAmountOptions = [
    { value: 'qty', label: 'Qty/Pks' },
    { value: 'ea',  label: 'Each' },
    { value: 'wt',  label: 'Weight'}
  ]

  const [selectedLocNicks, setSelectedLocNicks] = useState([])
  const [hideLocNicks, setHideLocNicks] = useState(true)

  const [selectedProdNicks, setSelectedProdNicks] = useState([])
  const [hideProdNicks, setHideProdNicks] = useState(true)

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
    { value: 'Retail',   label: 'Retail/Special'},
  ]

  const [selectedEditDates, setSelectedEditDates] = useState([]) // number of days ago, with respect to the cutoff window
  const [hideEditDates, setHideEditDates] = useState(true)
  const editDateOptions = [
    { value: 0, label: "Current Order Date"},
    { value: 1, label: "Curr -1"},
    { value: 2, label: "Curr -2"},
    { value: 3, label: "Curr -3 or Before"},
  ]

  const [hideUpdatedBy, setHideUpdatedBy] = useState(true)

  const resetState = () => {
    setSelectedLocNicks([])
    setSelectedProdNicks([])
    setSelectedShops([])
    setSelectedPackGroups([])
    setSelectedDoughNicks([])
    setSelectedRouteNicks([])
    setSelectedOrderTypes([])
    setSelectedEditDates([])
    setHideLocNicks(true)
    setHideProdNicks(true)
    setHideShops(true)
    setHidePackGroups(true)
    setHideDoughNicks(true)
    setHideRouteNicks(true)
    setHideOrderTypes(true)
    setHideEditDates(true)
    setHideUpdatedBy(true)
    setRowPartitionAttribute('prodNick')
    setAggregationDate('deliv')
    setDisplayAmount('qty')
  }

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
    if (selectedLocNicks.length > 0)   _orders = _orders.filter(o => selectedLocNicks.includes(o.locNick))
    if (selectedProdNicks.length > 0)  _orders = _orders.filter(o => selectedProdNicks.includes(o.prodNick))
    if (selectedShops.length > 0)      _orders = _orders.filter(o => selectedShops.includes(o.meta.routePlan.steps[0].end.place))
    if (selectedPackGroups.length > 0) _orders = _orders.filter(o => selectedPackGroups.includes(products[o.prodNick].packGroup))
    if (selectedDoughNicks.length > 0) _orders = _orders.filter(o => selectedDoughNicks.includes(products[o.prodNick].doughNick))
    if (selectedRouteNicks.length > 0) _orders = _orders.filter(o => selectedRouteNicks.includes(o.meta.routeNick))
    if (selectedOrderTypes.length > 0) _orders = _orders.filter(o => selectedOrderTypes.includes(o.Type))
    if (selectedEditDates.length > 0)  _orders = _orders.filter(o => selectedEditDates.some(dateDuration => 0
      || dateDuration === getOrderEditDaysAgo(o.updatedOn)
      || (dateDuration === 3 && dateDuration < getOrderEditDaysAgo(o.updatedOn))
    ))
    
    return _orders
  }

  //  Build Pivot Table
  // ===================
  const pivotDTs = [0,1,2,3,4,5,6].map(days => reportDT.plus({ days }))
  

  const buildRowPartitionModel = () => {
    let model = {}
    if (!products || rowPartitionAttribute === 'prodNick') {
      Object.assign(model, { rowKey: order => order.prodNick })
    } else {
      Object.assign(model, { rowKey: order => products[order.prodNick][rowPartitionAttribute] ?? order.prodNick })
    }
    if (!hideLocNicks)   Object.assign(model, { locNick:   order => order.locNick })
    if (!hideShops)      Object.assign(model, { shop:      order => order.meta.routePlan.steps[0].end.place })
    if (!hideRouteNicks) Object.assign(model, { routeNick: order => order.meta.routeNick })
    if (!products) return model
    if (!hidePackGroups) Object.assign(model, { packGroup: order => products[order.prodNick].packGroup })
    if (!hideDoughNicks) Object.assign(model, { doughNick: order => products[order.prodNick].doughNick })
    if (!hideOrderTypes) Object.assign(model, { Type:      order => order.Type })

    if (!hideEditDates)  Object.assign(model, { editDate:  order => getOrderEditDaysAgo(order.updatedOn) })
    if (!hideUpdatedBy)  Object.assign(model, { updatedBy: order => order.updatedBy })

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
    <div style={{ padding: "3rem 5rem 5rem 5rem", margin: "auto" }}>
      {/* <div style={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem"}}> */}
      <div style={{width: "100%", display: "grid", gridTemplateColumns: "25rem 1fr", columnGap: "1rem", marginBottom: "2rem"}}>

        <div style={{width: "25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
          <h1 style={{display: "inline-block", marginBlock: "0"}}>Order Dashboard</h1> <Button icon="pi pi-replay" iconPos="right" label="Reset" onClick={resetState} className="p-button-outlined" />
        </div>

        <div style={{display: "flex", justifyContent: "right", gap: "2rem", flexWrap: "wrap-reverse"}}>
          <div>
            Group Rows By: 
            <SelectButton 
              value={rowPartitionAttribute} 
              options={rowPartitionAttributeOptions} 
              onChange={e => { if (e.value) setRowPartitionAttribute(e.value) }} 
            />
          </div>
          <div>
            Group Columns By: 
            <SelectButton 
              value={aggregationDate} 
              options={aggregationDateOptions} 
              onChange={e => { if (e.value) setAggregationDate(e.value) }} 
            />
          </div>
          <div>
            Sum Values By: 
            <SelectButton 
              value={displayAmount} 
              options={displayAmountOptions} 
              onChange={e => { if (e.value) setDisplayAmount(e.value) }}
            />
          </div>
        </div>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "25rem 1fr", columnGap: "1rem"}}>

        <div>

          <Panel
            header={<div style={{width: "20rem", display: "flex", justifyContent: "space-between", alignItems: "center"}}>Location<LocationSelector selectedLocNicks={selectedLocNicks} setSelectedLocNicks={setSelectedLocNicks} /></div>}
            icons={
              <i className={hideLocNicks ? "pi pi-minus" : "pi pi-bars"} 
                onClick={() => setHideLocNicks(!hideLocNicks)} 
                style={{cursor: "pointer", paddingInline: ".5rem"}} 
              />
            }
            className="bpb-order-dash-panel bpb-order-dash-panel-search-header"
            style={{marginBottom: "1rem"}}
          >
            <div style={{padding: ".5rem", background: "var(--bpb-orange-vibrant-050)", display: "flex", gap: ".5rem", flexWrap: "wrap", minHeight: "3.15rem"}}>
              {selectedLocNicks.map((locNick, idx) => 
                <Chip  
                  key={"l-chip" + idx} 
                  label={locNick}
                  template={<>
                    <span style={{display: "inline-block", fontSize: "1.1rem", marginLeft: ".33rem"}}>{locNick}</span>
                    <span style={{height: "2rem", marginLeft: ".5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem"}}><i className="pi pi-times-circle"/></span> 
                  </>}
                  onClick={() => setSelectedLocNicks(selectedLocNicks.filter(item => item !== locNick))}
                  style={{cursor: "pointer"}}
                />
              )}
            </div>
          </Panel>

          <Panel
            header={<div style={{width: "20rem", display: "flex", justifyContent: "space-between", alignItems: "center"}}>Product<ProductSelector selectedProdNicks={selectedProdNicks} setSelectedProdNicks={setSelectedProdNicks} /></div>}
            // icons={
            //   <i className={hideProdNicks ? "pi pi-minus" : "pi pi-bars"} 
            //     onClick={() => setHideProdNicks(!hideProdNicks)} 
            //     style={{cursor: "pointer", paddingInline: ".5rem"}} 
            //   />
            // }
            className="bpb-order-dash-panel bpb-order-dash-panel-search-header"
            style={{marginBottom: "1rem"}}
          >
            <div style={{padding: ".5rem", background: "var(--bpb-orange-vibrant-050)", display: "flex", gap: ".5rem", flexWrap: "wrap", minHeight: "3.15rem"}}>
              {selectedProdNicks.map((prodNick, idx) => 
                <Chip  
                  key={"p-chip" + idx} 
                  label={prodNick}
                  template={<>
                    <span style={{display: "inline-block", fontSize: "1.1rem", marginLeft: ".33rem"}}>{prodNick}</span>
                    <span style={{height: "2rem", marginLeft: ".5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem"}}><i className="pi pi-times-circle"/></span> 
                  </>}
                  onClick={() => setSelectedProdNicks(selectedProdNicks.filter(item => item !== prodNick))}
                  style={{cursor: "pointer"}}
                />
              )}
            </div>
          </Panel>

          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "1rem"}}>
            <div>
              <Panel 
                header={<div>Shop</div>} 
                icons={
                  <i className={hideShops ? "pi pi-minus" : "pi pi-bars"} 
                    onClick={() => {setHideShops(!hideShops)}} 
                    style={{cursor: "pointer", paddingInline: ".5rem"}} 
                  />
                }
                className="bpb-order-dash-panel" 
                style={{marginBottom: "1rem"}}
              >
                <ListBox 
                  value={selectedShops} 
                  options={shops} 
                  onChange={e => {console.log("e", e); setSelectedShops(e.value)}} 
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
            </div>
            <div>
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
              <Panel 
                header="Last Edited"
                icons={
                  <i className={hideEditDates ? "pi pi-minus" : "pi pi-bars"} 
                    onClick={() => setHideEditDates(!hideEditDates)} 
                    style={{cursor: "pointer", paddingInline: ".5rem"}} 
                  />
                }
                className="bpb-order-dash-panel" 
                style={{marginBottom: "1rem"}}
              >
                <ListBox 
                  value={selectedEditDates} 
                  options={editDateOptions} 
                  onChange={e => setSelectedEditDates(e.value)} 
                  multiple 
                  style={{border: "none"}} 
                />
              </Panel>
              <Panel 
                header="Edited By"
                icons={
                  <i className={hideUpdatedBy ? "pi pi-minus" : "pi pi-bars"} 
                    onClick={() => setHideUpdatedBy(!hideUpdatedBy)} 
                    style={{cursor: "pointer", paddingInline: ".5rem"}} 
                  />
                }
                className="bpb-order-dash-panel bpb-empty-panel-body" 
                style={{marginBottom: "1rem"}}
              >
              </Panel>
            </div>
          </div>

        </div>


        <DataTable
          value={pivotData}
          responsiveLayout="scroll"
          removableSort
          sortMode="multiple"
        >
          {!hideEditDates  && <Column header={<div>Update<br/>Days Ago</div>} field={'rowProps.editDate'} sortable />}
          {!hideUpdatedBy  && <Column header='Updated By' field='rowProps.updatedBy' sortable />}
          {!hideShops      && <Column header={<div>Make<br/>Where</div>} field={`rowProps.shop`} sortable />}
          {!hidePackGroups && <Column header="Pack Group" field={`rowProps.packGroup`} sortable />}
          {!hideDoughNicks && <Column header="Dough Type" field={`rowProps.doughNick`} sortable />}
          {!hideRouteNicks && <Column header="Route"      field={`rowProps.routeNick`} sortable />}
          {!hideOrderTypes && <Column header="Type"       field={`rowProps.Type`}      sortable />}
          {!hideLocNicks   && <Column header="Location"   field={'rowProps.locNick'}   sortable bodyStyle={{overflow: "hidden", textOverflow: "ellipsis", whitespace: "nowrap"}} style={{maxWidth: "12rem"}} />}
          <Column header={rowPartitionAttribute} field={`rowProps.rowKey`} sortable style={{maxWidth: "12rem"}} />
          {pivotDTs.map((dt, idx) => {
            const date = dt.toFormat('yyyy-MM-dd')

            return <Column 
              header={<div>{idx === 0 ? "Today" : dt.toFormat('EEE')}<br/>{dt.toFormat('M/d')}</div>} 
              key={idx} 
              // field={`colProps.${date}.value`}
              body={row => {
                if ((row.colProps[date]?.items ?? []).some(item => item === undefined)) console.log("ERR", row.colProps[date].items)
                return DrilldownCellTemplate({
                  dialogHeader: row.rowProps.rowKey,
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





const SearchBar = ({ 
  value,
  setValue,
  onValueChange,
  displayField, 
  displayValue,
  setDisplayValue,
  placeholder="Search (type '?' to show all)",
  data=[], 
  searchFields,
  itemTemplate,
  style,
  inputStyle,
  panelStyle,
  panelClassName,
  dropdown, // controls display of dropdown button on the side
  showDropdownOnClick,
  scrollToRef,
  disabled,
  id,
}) => {

  const [suggestions, setSuggestions] = useState(data)
  // const ref = useRef(null)
  const inputRef = useRef(null)
  
  return <AutoComplete
    id={id}
    // ref={ref}
    inputRef={inputRef}
    field={displayField}
    value={disabled ? null : (displayValue ?? value)}
    placeholder={placeholder}
    itemTemplate={itemTemplate} 
    delay={150}
    dropdown={dropdown}
    autoHighlight
    forceSelection
    spellCheck={false}
    scrollHeight="25rem"
    style={style}
    inputStyle={inputStyle}
    panelStyle={panelStyle}
    panelClassName={panelClassName}
    suggestions={suggestions}
    // onClick={e => {
    //   if (showDropdownOnClick && scrollToRef) {
    //     scrollToRef.current.scrollIntoView({ behavior: 'smooth' })
    //     setTimeout(() => {
    //       ref.current.search(e, "", "dropdown")
    //     }, 250);
    //   }
    //   else if (showDropdownOnClick) ref.current.search(e, "", "dropdown")
    // }}
    completeMethod={e => {
      if (e.query === "?") setSuggestions([...data])
      else setSuggestions(rankedSearch(e.query, data, searchFields))
    }}
    onFocus={e => {
      e.target.select() // auto-hilight query text
      //setRollbackValue(e.value)
    }} 
    onChange={e => { // the underlying combobox's(?) 'onChange'
      // console.log("change", e.value)
      setDisplayValue(e.value)

      // Fun Javascript jank for you to try out: 
      // typeof null evaluates to "object" for some reason...
      if (e.value !== null && typeof e.value === "object") { 
        console.log(e.value)
        onValueChange(e.value)
        //setValue(e.value)
      }
    }}
    onKeyUp={e => {
      if (e.key === "Escape") {
        inputRef.current.select() // hilight text (so that you can overwrite)
      }
    }}
    onBlur={e => {
      // console.log(e, e.target.value)
      setDisplayValue(value)
    }}
    disabled={disabled}
  />
}

const locationSelectorItemTemplate = option => 
  <>
    <div>{option.locName}</div>
    <pre style={{fontSize: ".8rem", margin: "0rem"}}>
      {option.locNick}
    </pre>
  </>


const LocationSelector = ({
  selectedLocNicks,
  setSelectedLocNicks,
  disabled
}) => {
  const { data:LOC } = useLocations({ shouldFetch: true })
  const [displayValue, setDisplayValue] = useState(null)

  const handleValueChange = newLocation => {
    const newLocNick = newLocation?.locNick
    if (!!newLocNick && !selectedLocNicks.includes(newLocNick)) {
      setSelectedLocNicks(selectedLocNicks.concat(newLocNick))
    }
    setDisplayValue(null)
  }

  return (
    <SearchBar
      value={''}
      displayValue={displayValue}
      placeholder="Search (type '?' to see all)"
      // placeholder={disabled ? "" : undefined}
      onValueChange={handleValueChange}
      setDisplayValue={setDisplayValue}
      displayField="locName"
      data={LOC?.sort(compareBy(L => L.locName)) ?? []}
      searchFields={['locNick', 'locName']}
      itemTemplate={locationSelectorItemTemplate}
      dropdown={false}
      disabled={disabled}
      inputStyle={{width: "15rem"}}
    />
  )

}



const productSelectorItemTemplate = option => 
  <>
    <div>{option.prodName}</div>
    <pre style={{fontSize: ".8rem", margin: "0rem"}}>
      {option.prodNick}
    </pre>
  </>

const ProductSelector = ({
  selectedProdNicks,
  setSelectedProdNicks,
  disabled
}) => {
  const { data:PRD } = useProducts({ shouldFetch: true })
  const [displayValue, setDisplayValue] = useState(null)

  const handleValueChange = newProduct => {
    const newLocNick = newProduct?.prodNick
    if (!!newLocNick && !selectedProdNicks.includes(newLocNick)) {
      setSelectedProdNicks(selectedProdNicks.concat(newLocNick))
    }
    setDisplayValue(null)
  }

  return (
    <SearchBar
      value={''}
      displayValue={displayValue}
      placeholder="Search (type '?' to see all)"
      onValueChange={handleValueChange}
      setDisplayValue={setDisplayValue}
      displayField="prodName"
      data={PRD?.sort(compareBy(P => P.prodName)) ?? []}
      searchFields={['prodNick', 'prodName']}
      itemTemplate={productSelectorItemTemplate}
      dropdown={false}
      disabled={disabled}
      inputStyle={{width: "15rem"}}
    />
  )



}