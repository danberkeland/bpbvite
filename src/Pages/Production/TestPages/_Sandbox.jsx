import { useMemo } from "react";
import { DT } from "../../../utils/dateTimeFns";
import { useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData";
import { DataTable } from "primereact/datatable";
import { tablePivot } from "../../../utils/tablePivot";
import { Column } from "primereact/column";
import { useProducts } from "../../../data/product/useProducts";
import { compareBy, keyBy } from "../../../utils/collectionFns";
import { DBProduct } from "../../../data/types.d";

export const Sandbox = () => {
 
  const reportDateDT = DT.today()

  const { data:orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDateDT, useHolding: false})
  const { data:PRD } = useProducts({ shouldFetch: true })

  const { 
    goingUpTable=[], 
    goingUpColKeys=[],
    goingDownTable=[], 
    goingDownColKeys=[],
    slopickTable=[],
    slopickColKeys=[],
  } = useMemo(() => {
    if (!orders || !PRD) return {} 

    const products = keyBy(PRD, P => P.prodNick)
    
    const goingUpOrders = orders?.filter(order => ['backporch', 'bpbkit'].includes(order.locNick)) ?? []
    const goingDownOrders = orders?.filter(order => ['slonat', 'whole'].includes(order.locNick)) ?? []
    const slopickOrders = orders.filter(order => ['bpbextras'].includes(order.locNick))// ['Pick up SLO'].includes(order.meta.routeNick))

    const isHigueraPackProduct = (/** @type {DBProduct} */ product) => 1
      && product.doughNick !== "French"
      && ['rustic breads', 'retail', 'focaccia'].includes(product.packGroup)

    console.log(goingUpOrders)
    console.log(goingDownOrders)
    console.log(slopickOrders)

    const [goingUpTable, goingDownTable, slopickTable] = 
      [goingUpOrders, goingDownOrders, slopickOrders]
        .map(orderSet => tablePivot(
          orderSet, 
          { locNick: item => item.locNick }, 
          order => order.prodNick, 
          items => items[0].qty
        ))

    const [goingUpColKeys, goingDownColKeys, slopickColKeys] = 
      [goingUpTable, goingDownTable, slopickTable].map(pivotData => 
        Object.keys((pivotData[0] ?? {}).colProps)
        .filter(prodNick => isHigueraPackProduct(products[prodNick]))
        .sort(compareBy(prodNick => products[prodNick].prodNick))
        .sort(compareBy(prodNick => products[prodNick].doughNick))
        .sort(compareBy(prodNick => products[prodNick].packGroup))
        .sort(compareBy(prodNick => products[prodNick].packGroupOrder))
      )

    return { 
      goingUpTable, 
      goingUpColKeys,
      goingDownTable, 
      goingDownColKeys,
      slopickTable,
      slopickColKeys,
    }

  }, orders)

  console.log(goingUpTable)
  console.log(goingDownTable)
  console.log(slopickTable)
  
  return (<>

    <h1>Sandbox</h1>


    <h2>Higuera - Other Orders</h2>

    <h3>Long Drive - Up</h3>
    
    <DataTable
      value={goingUpTable ?? []}
      showGridlines
      stripedRows
      size="small"
      
    >
      <Column header="Location" field="rowProps.locNick" />
      {goingUpColKeys.map(prodNick => 
          <Column key={`up-${prodNick}`} header={prodNick} field={`colProps.${prodNick}.value`} />
      )}
    </DataTable>


    <h3>Long Drive - Down</h3>

    <DataTable
      value={goingDownTable ?? []}
      showGridlines
      stripedRows
      size="small"

    >
      <Column header="Location" field="rowProps.locNick" />
      {goingDownColKeys.map(prodNick => 
        <Column key={`down-${prodNick}`} header={prodNick} field={`colProps.${prodNick}.value`} />
      )}
    </DataTable>

    
    <h3>Send To Prado</h3>

    <DataTable
      value={slopickTable ?? []}
      showGridlines
      stripedRows
      size="small"
    >
      <Column header="Location" field="rowProps.locNick" />
      {slopickColKeys.map(prodNick => 
        <Column key={`slopick-${prodNick}`} header={prodNick} field={`colProps.${prodNick}.value`} />
      )}
    </DataTable>
    
  </>)
}

