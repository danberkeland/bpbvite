import { createColumns } from "./createColumns"
import { tablePivot, tablePivotFlatten } from "../../../utils/tablePivot";
import { sumBy } from "../../../utils/collectionFns/sumBy";
import { compareBy } from "../../../utils/collectionFns/compareBy";
import { getOrdersList } from "../../../core/production/getOrdersList";
   
  
const makePivotTableAndColumns = (delivDate, database, filter) => {

  let fullOrder = getOrdersList(delivDate, database).filter(filter)
  console.log(fullOrder.filter(order => order.custName.startsWith('Merry Hill')))

  const pivotTable = tablePivot(
    fullOrder,
    {
      customer: row => row.custName,
      delivOrder: row => row.delivOrder,
      route: row => row.route,
    },
    "prodNick",
    cellItems => sumBy(cellItems, item => item.qty * item.packSize)
  )

  const flattenedTable = tablePivotFlatten(pivotTable)
    .map(row => ({
      ...row,
      customerShort: row.customer.length>10 
        ? row.customer.substring(0,13) + "..." 
        : row.customer
    }))
    .sort(compareBy(order => order.delivOrder, "desc"))
    .sort(compareBy(order => order.route))

  const prodNicks = Object.keys(pivotTable[0].colProps)
  const columnTemplate = createColumns(prodNicks)

  return [flattenedTable, columnTemplate]
}



export default class ComposeAMPastry {
  returnAMPastryBreakDown = (delivDate, database) => {

    const [AMPastry, columnsAMPastry] = 
      makePivotTableAndColumns(delivDate, database, this.AMPastryFilter)

    const AMOthers = []
    const columnsAMOthers = []

    return {
      AMPastry: AMPastry,
      columnsAMPastry: columnsAMPastry,
      AMOthers: AMOthers,
      columnsAMOthers: columnsAMOthers
    };
  };

  AMPastryFilter = (ord) => {
    return (
      (ord.where.includes("Mixed") || ord.where.includes("Prado")) &&
      ord.packGroup === "baked pastries" &&
      ord.routeDepart === "Prado"
    );
  };

}
