import { ceil, set, sumBy } from "lodash";
import { DateTime } from "luxon";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { useOrderReportByDate } from "../../../data/productionData";
import { groupBy } from "../../../functions/groupBy";


const REPORT_DATE = DateTime.now().setZone('America/Los_Angeles')
const PROD_LOCATION = "Carlton"

const unitsPerPan = {
  pl: 12,
  ch: 12,
  pg: 12,
  sf: 12,
  al: 12,
  mini: 15,
  mb: 6
}
const convertToPans = (prodNick, qty) => ({
  pans: Math.trunc(qty/unitsPerPan[prodNick]),
  remainder: qty % unitsPerPan[prodNick]
})

export const BPBNSetout = () => {
  // ****************
  // * DATA SOURCES *
  // ****************

  // ***PRADO and CARLTON: Count non-almond croix***

  const { routedOrderData:T1ProdOrders } = useOrderReportByDate({
    delivDateJS: REPORT_DATE.plus({ days: 1}).toJSDate(),
    includeHolding: true,
    shouldFetch: true
  })

  // T0: Setout @ PROD_LOCATION
  // T1: Bake and deliver from PROD_LOCATION
  const T1CroixOrdersNoAlmonds = T1ProdOrders?.filter(order => {
    const { prodNick, product: { packGroup, doughNick }, routeNick, route: { RouteDepart }, locNick } = order

    let isPickupAtProdLocation = (PROD_LOCATION === "Carlton" && routeNick === "Pick Up Carlton")
      || (PROD_LOCATION === "Prado" && routeNick === "Pick Up SLO")

    return (
      (RouteDepart === PROD_LOCATION || isPickupAtProdLocation || locNick === "backporch") &&
      locNick !== "bpbextras" &&
      packGroup === "baked pastries" &&
      doughNick === "Croissant" &&
      prodNick !== "al"
    );
  }).map(order => order.prodNick === "unmb" ? { ...order, prodNick: "mb" } : order) ?? [] // unmb and mb are counted as just mb

  // Pastry Prep
  const T1PastryPrep = T1ProdOrders?.filter(order => {
    const { product: { bakedWhere, packGroup, doughNick }, routeNick, route: { RouteDepart } } = order
    const isNonCroixPastry = (packGroup === "baked pastries" && doughNick !== "Croissant")
    const isBakedExclusivelyAtProdLocation = bakedWhere.includes(PROD_LOCATION) && bakedWhere.length === 1
    const isBakedAtProdLocation = bakedWhere.includes(PROD_LOCATION) && bakedWhere.length > 1

    return isNonCroixPastry && (isBakedExclusivelyAtProdLocation
      || isBakedAtProdLocation && (RouteDepart === PROD_LOCATION || routeNick === "Pick Up SLO") // Not sure how to interpret this part
    )

  })

  // temp reference for above filter -- filter function for the compose pastry method

  // export const pastryPrepFilter = (ord, loc) => {
  //   return (
  //     (ord.where.includes(loc) &&                     <<< in the past this implied the item is ONLY baked at that location...
  //       ord.packGroup === "baked pastries" &&
  //       ord.doughType !== "Croissant") ||
  //     (ord.where.includes("Mixed") &&
  //     (ord.routeDepart === loc || ord.route === "Pick up SLO") && <<<
  //       ord.packGroup === "baked pastries" &&
  //       ord.doughType !== "Croissant")
  //   );
  // };


  // ***PRADO ONLY: Count pl to prep for future al, fral Orders***
  // T2 and T3 queries get filtered to prodNick 'al' only. can optimize with
  // a better targeted query in the future (might require index on prodNick).
  const { routedOrderData:T2ProdOrders } = useOrderReportByDate({
    delivDateJS: REPORT_DATE.plus({ days: 2}).toJSDate(),
    includeHolding: true,
    shouldFetch: PROD_LOCATION === "Prado" // these lists not counted @ Carlton
  })
  const { routedOrderData:T3ProdOrders } = useOrderReportByDate({
    delivDateJS: REPORT_DATE.plus({ days: 3}).toJSDate(),
    includeHolding: true,
    shouldFetch: PROD_LOCATION === "Prado" // these lists not counted @ Carlton
  })

  // (Note: Indeed, this par is only counted for Prado Set out...)
  // T0: Setout 'pl' @ Prado(? or at the given PROD_LOCATION?)
  // T1: Bake pl >> prep fral @ Prado
  // T2: ??? -- Seems like this only works if PROD_LOCATION is Prado.
  //     Does this logic work for routes departing from the Carlton?
  const T2AlmondOrders = T2ProdOrders?.filter(order => {
    let { locNick, prodNick, route: { RouteDepart } } = order
    return prodNick === "al"
      && (RouteDepart === PROD_LOCATION || locNick === "backporch")
      && locNick !== "bpbextras"
  })
  .map(order => ({ ...order, prodNick: "pl" })) ?? [] // will be counted as pl

  // (Note: Indeed, this par is only counted for Prado Set out...)
  // T0: Setout 'pl'
  // T1: Bake pl >> prep fral @ Prado
  // T2: deliver fral anywhere
  const T2FrozenAlmondOrders = T2ProdOrders?.filter(order => 
    order.prodNick === "fral" && order.locNick !== "bpbextras"
  )
  .map(order => ({ ...order, prodNick: "pl" })) ?? [] // will be counted as pl

  // (Note: Indeed, this par is only counted for Prado Set out...)
  // T0: Setout pl @ Prado
  // T1: Bake pl >> prep fral @ Prado 
  // T2: Transfer Prado to Carlton >> Setout @ Carlton
  // T3: Bake and deliver from Carlton (or PU at Carlton)
  const T3AlmondOrders = T3ProdOrders?.filter(order => {
    let { locNick, prodNick, routeNick, route: { RouteDepart } } = order
    return prodNick === "al"
      && (RouteDepart === "Carlton" || routeNick === "Pick up Carlton")
      && locNick !== "bpbextras"
  })
  .map(order => ({ ...order, prodNick: "pl" })) ?? [] // will be counted as pl

  const croixSetoutOrders = T1CroixOrdersNoAlmonds
    .concat(T2AlmondOrders)
    .concat(T2FrozenAlmondOrders)
    .concat(T3AlmondOrders)
    .map(order => order.locNick === "backporch" 
      ? {...order, qty: ceil(order.qty /2)} 
      : order
    )

  
  const setoutProductGroups = groupBy(croixSetoutOrders, ["prodNick"])

  const setoutTotals = Object.values(setoutProductGroups).map(pGroup => {
    const prodNick = pGroup[0].prodNick
    const total = sumBy(pGroup, order => order.qty)
    const { pans, remainder } = convertToPans(prodNick, total)

    return({
      prodNick: pGroup[0].prodNick,
      qty: total,
      pans,
      remainder
    })
  })

  const pastryPrepGroups = groupBy(T1PastryPrep, ['prodNick'])
  const pastryPrepTotals = Object.values(pastryPrepGroups).map(pGroup => {
    const prodNick = pGroup[0].prodNick
    const total = sumBy(pGroup, order => order.qty)

    return({
      prodNick: pGroup[0].prodNick,
      qty: total
    })
  })


  return (<>
    <h1>{`BPBN Set Out ${REPORT_DATE.toLocaleString()}`}</h1>

    <h2>Set Out</h2>
    <DataTable 
      size="small"
      value={setoutTotals}
    >
      <Column header="Product" field="prodNick" />
      <Column header="Qty" field="qty" />
      <Column header="Pans" field="pans" />
      <Column header="+" field="remainder" />
    </DataTable>

    <h2>Pastry Prep</h2>
    <DataTable 
      size="small"
      value={pastryPrepTotals}
    >
      <Column header="Product" field="prodNick" />
      <Column header="Qty" field="qty" />
    </DataTable>

  </>)
}