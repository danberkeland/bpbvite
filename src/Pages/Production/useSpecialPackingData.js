import { DateTime } from "luxon";
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData";
import { useProducts } from "../../data/product/useProducts";
import { compareBy, keyBy, sumBy } from "../../utils/collectionFns";
import { tablePivot } from "../../utils/tablePivot";
import { useMemo } from "react";

/** @param {CombinedRoutedOrder[]} orderList */
const buildTableData = orderList => tablePivot(
  orderList,
  {
    driver:      order => order.meta.route.driver,
    routeDepart: order => order.meta.route.routeDepart,
    routeStart:  order => order.meta.route.routeStart,
    routeNick:   order => order.meta.routeNick,
    locNick:     order => order.locNick,
  },
  order => order.prodNick,
  orders => sumBy(orders, order => order.qty)
)
.sort(compareBy(row => row.rowProps.locNick))
.sort(compareBy(row => row.rowProps.routeNick))
.sort(compareBy(row => row.rowProps.routeDepart))
.sort(compareBy(row => row.rowProps.routeStart))

/**
 * @param {Object} input
 * @param {DateTime} input.reportDT 
 * @param {boolean} input.shouldFetch
 */
export const useSpecialPacking = ({ reportDT, shouldFetch }) => {
  const R0 = reportDT.plus({ days: 0 }).toFormat('yyyy-MM-dd')

  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false, shouldFetch })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true,  shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch })

  const calculateSpecialPacking = () => {
    if (!R0Orders || !R1Orders || !PRD) {
      return { 
        T0Pretzel: undefined, 
        T1Pretzel: undefined, 
        T0French:  undefined, 
        R0Frozen:  undefined, 
        R1Frozen:  undefined, 
      }
    }

    const products = keyBy(PRD, P => P.prodNick)

    const R0pretzelData = R0Orders.filter(order => 1
      && products[order.prodNick].doughNick === 'Pretzel Bun'
      && order.meta.routePlan.steps[0].end.date === R0 // <<< "Baking is completed on R0"
      && order.qty !== 0
    )
    const R1pretzelData = R1Orders.filter(order => 1
      && products[order.prodNick].doughNick === 'Pretzel Bun'
      && order.meta.routePlan.steps[0].end.date === R0 // <<< "Baked is completed on R0"
      && order.qty !== 0
    )
    const R1FrenchData = R1Orders.filter(order => 1
      && products[order.prodNick].doughNick === 'French'
      && products[order.prodNick].readyTime < 15
      && !(['rdch', 'frfr'].includes(order.prodNick))
      && order.meta.routePlan.steps[0].end.date === R0 // <<< "Baked is completed on R0"
      && order.qty !== 0
    )
    const R0FrozenPastryData = R0Orders.filter(order => 1
      && products[order.prodNick].packGroup === 'frozen pastries'
      && order.qty !== 0
    )
    const R1FrozenPastryData = R1Orders.filter(order => 1
      && products[order.prodNick].packGroup === 'frozen pastries'
      && order.qty !== 0
    )
    
    return {
      R0Pretzel: buildTableData(R0pretzelData),
      R1Pretzel: buildTableData(R1pretzelData),
      R1French:  buildTableData(R1FrenchData),
      R0Frozen:  buildTableData(R0FrozenPastryData),
      R1Frozen:  buildTableData(R1FrozenPastryData),
    }
  }

  return useMemo(calculateSpecialPacking, [R0, R0Orders, R1Orders, PRD])

}