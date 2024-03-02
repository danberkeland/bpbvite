import { useMemo } from "react";
import { useLocations } from "../../../../data/location/useLocations";
import { useProducts } from "../../../../data/product/useProducts";
import { Data } from "../../../../utils/dataFns";
import { DateTime } from "luxon";
import { DBLocation, DBProduct } from "../../../../data/types.d.js";
import { useCombinedRoutedOrdersByDate } from "../../../../data/production/useProductionData.js";
import { useInfoQBAuths } from "../../../../data/infoQBAuths/useInfoQBAuths.js";
import { DT } from "../../../../utils/dateTimeFns.js";

// These equivalences cannot be queried directly from DB records;
// better to hard code the values for now.

/** maps ProdNicks to the forBake of some representative product */
const prodNickToForBakeMap = {
  al: "Almond",
  fral: "Almond",
  ch: "ch",
  frch: "ch",
  pg: "pg",
  frpg: "frpg",
  mb: "mb",
  unmb: "mb",
  frmb: "mb",
  pl: "pl",
  frpl: "pl",
  sf: "sf",
  frsf: "sf",
  mini: "mini",
  frmni: "mini",
}

const croissantRowKeys = ["Almond", "ch", "pg", "mb", "pl", "sf", "mini"]

// forBake is mostly used to find the product holding freezerNorth inventory counts.
const initialCroissantRows = [
  { forBake: "Almond", prodNick: "al" },
  { forBake: "ch",     prodNick: "ch" },
  { forBake: "pg",     prodNick: "pg" },
  { forBake: "mb",     prodNick: "mb" },
  { forBake: "pl",     prodNick: "pl" },
  { forBake: "mini",   prodNick: "mini" },
]

/**
 * 
 * @param {Object} input
 * @param {DateTime} input.delivDT
 * @returns 
 */ 
const useNorthListData = ({
  delivDT
}) => {
  const { data:LOC } = useLocations({ shouldFetch: true })
  const { data:PRD } = useProducts({ shouldFetch: true })
  const { data:IQB }  = useInfoQBAuths({ shouldFetch: true })
  const { data:T0Orders } = useCombinedRoutedOrdersByDate({ delivDT, useHolding: false })
  const { data:T1Orders } = useCombinedRoutedOrdersByDate({ delivDT: delivDT.plus({ days: 1 }), useHolding: true })
  
  const calcNorthLists = () => {
    if (!LOC || !PRD || !IQB || !T0Orders || !T1Orders) return []
    console.log([LOC, PRD, IQB, T0Orders, T1Orders])
    

    // /** @type {Object<string, DBLocation>} */
    // const locations = LOC.reduce(Data._keyBy(L => L.locNick), {})

    /** @type {Object<string, DBProduct>} */
    const products = PRD.reduce(Data._keyBy(P => P.prodNick), {})
    

    // ***** Croissant List *****

    // Frozen

    // IMPORTANT rule: product list must be sorted by prodName (ascending) 
    // when we find by forBake
    const sortedProducts = PRD.sort(Data.compareBy(P => P.prodName))
    const freezerNorthInventory = initialCroissantRows.map(row => {
      const productRep = sortedProducts.find(P => P.forBake === row.forBake)

      return {
        forBake: row.forBake, 
        prodNick: row.prodNick, 
        qty: productRep?.freezerNorth ?? 0
      }
    })
    console.log(freezerNorthInventory)

    const T0Frozen = T0Orders.filter(order => 1
      && products[order.prodNick].bakedWhere.length > 1
      && products[order.prodNick].packGroup === "frozen pastries"
      && products[order.prodNick].doughNick === "Croissant"
      && order.meta.route?.RouteDepart      === "Carlton"
    )
    console.log("T0Frozen", T0Frozen)

    const T1Baked = T1Orders.filter(order => 1
      && products[order.prodNick].bakedWhere.length > 1
      && products[order.prodNick].packGroup === "baked pastries"
      && products[order.prodNick].doughNick === "Croissant"
      && order.meta.route?.RouteDepart      === "Carlton"
    )   
    console.log("T1Baked", T1Baked)

    const frozensNeeded = [...T0Frozen, ...T1Baked]
      .reduce(Data._bucketBy(order => prodNickToForBakeMap[order.prodNick]), [])
      .map(shapeTypeGroup => {

        const qty = shapeTypeGroup.reduce(Data._sumBy(order => 
          order.qty * products[order.prodNick].packSize), 0
        )

        return { 
          forBake: prodNickToForBakeMap[shapeTypeGroup[0].prodNick],
          qty, 
          items: shapeTypeGroup 
        }
      })

    console.log("frozensNeeded", frozensNeeded)

    // Baked
    // Baked::orders after deadline
    
    const T1Iso = delivDT.plus({ days: 1}).toFormat('yyyy-MM-dd')

    const bpbsSetoutRecord = 
      IQB.find(item => item.id === T1Iso + "PradosetoutTime")?.updatedAt
    
    const bpbsSetoutTimestamp = bpbsSetoutRecord
      ? DT.fromIsoTs(bpbsSetoutRecord).toMillis()
      : undefined


    const afterDeadlineOrders = T0Orders.filter(order => (
      order.isWhole && (
        order.route === "slopick"
      )
    ))


    // backporch orders
    // getBackPorchBakeryOrders = (delivDate, database) => {
    //   let BackPorchOrders = getOrdersList(today, database).filter(
    //     (ord) =>
    //       ord.custName === "Back Porch Bakery" && ord.doughType === "Croissant"
    //   );
    //   return BackPorchOrders;
    // };
    // const backporchOrders = T0Orders.filter(order => (1
    //   && products[order.prodNick].packGroup === "baked pastries"
    //   && products[order.prodNick].doughNick === "Croissant"  
    // ))

  
  }

  return { data: useMemo(calcNorthLists, [LOC, PRD, IQB, T0Orders, T1Orders])}

}

export { useNorthListData }


// getOrdersPlacedAfterDeadline = (delivDate, database) => {
//   const [products, customers, routes, standing, orders, d, dd, alt, QBInfo] =
//     database;
//   console.log("QBInfo", QBInfo);
//   let qbidS = tomBasedOnDelivDate(delivDate) + "PradosetoutTime";
//   let qbidN = tomBasedOnDelivDate(delivDate) + "CarltonsetoutTime";
//   let southCompare = new Date();
//   let northCompare = new Date();
//   try {
//     southCompare = new Date(
//       QBInfo[QBInfo.findIndex((qb) => qb.id === qbidS)].updatedAt
//     );
//   } catch {}
//   try {
//     northCompare = new Date(
//       QBInfo[QBInfo.findIndex((qb) => qb.id === qbidN)].updatedAt
//     );
//   } catch {}

//   let todayOrders = orders.filter(
//     (ord) =>
//       (ord.route === "slopick" &&
//         ord.delivDate === convertDatetoBPBDate(delivDate) &&
//         new Date(ord.updatedAt) > southCompare &&
//         ord.isWhole === false) ||
//       (ord.route === "atownpick" &&
//         ord.delivDate === convertDatetoBPBDate(delivDate) &&
//         new Date(ord.updatedAt) > northCompare &&
//         ord.isWhole === false)
//   );
//   return todayOrders;
// };
