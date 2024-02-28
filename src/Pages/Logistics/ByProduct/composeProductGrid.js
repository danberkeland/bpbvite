
import { getOrdersList } from "../../../core/production/getOrdersList"; 
import { compareBy } from "../../../utils/collectionFns/compareBy";

export default class ComposeProductGrid {
  returnProdGrid = (database, delivDate) => {
    const customers = database[1]
    
    const prodGrid = getOrdersList(delivDate, database).sort(compareBy(order => 
      customers.find(C => C.custName === order.custName)?.delivOrder ?? 0)
    )
    
    return { prodGrid }

  }

}

