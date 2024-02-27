import { DT } from "../../../utils/dateTimeFns";
import { getOrdersList } from "../../../core/production/getOrdersList";
import { sumBy } from "../../../utils/collectionFns/sumBy";

export default class ComposeRetailBags {
  returnRetailBags = (database) => {
    const todayDT = DT.today()
    const T0 = todayDT.plus({ days: 0 }).toFormat('yyyy-MM-dd')
    const T1 = todayDT.plus({ days: 1 }).toFormat('yyyy-MM-dd')

    const retailProducts = database[0].filter(P => P.packGroup === "retail")
    const T0RetailOrders = getOrdersList(T0, database).filter(order => order.packGroup === "retail")
    const T1RetailOrders = getOrdersList(T1, database).filter(order => order.packGroup === "retail")

    const retailBags = retailProducts.map(P => ({
      prodName: P.prodName,
      qty:    sumBy(T0RetailOrders.filter(order => order.prodNick === P.nickName), order => order.qty * order.packSize),
      tomQty: sumBy(T1RetailOrders.filter(order => order.prodNick === P.nickName), order => order.qty * order.packSize),
    }))

    return { retailBags }

  }
}