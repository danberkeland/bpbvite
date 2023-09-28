import { DateTime } from "luxon";
import { useListData } from "../../../../data/_listData";
import { flatten, keyBy, uniqBy } from "lodash";
import { useMemo } from "react";

const croixBucketMap = {
  pl: 'pl', frpl: 'pl',
  ch: 'ch', frch: 'ch',
  pg: 'pg', frpg: 'pg',
  sf: 'sf', frsf: 'sf',
  mb: 'mb', frmb: 'mb', unmb: 'mb',
  mini: 'mini', frmini: 'mini',
}

const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
const dateList = [0, 1, 2, 3, 4, 5, 6, 7].map(daysAhead => {
  const dateDT = todayDT.plus({ days: daysAhead })

  return {
    relDate: daysAhead,
    delivDate: dateDT.toFormat('yyyy-MM-dd'),
    dayOfWeek: dateDT.toFormat('EEE'),
  }

})

export const useT0T7Data = ({ shouldFetch, includeHolding=false }) => {
  const { data:cart } = useListData({ 
    tableName: "Order", shouldFetch 
  })
  const { data:standing } = useListData({ 
    tableName: "Standing", shouldFetch 
  })
  const { data:PRD } = useListData({
    tableName: "Product", shouldFetch
  })

  const composeData = () => {
    if (!cart || !standing || !PRD ) return undefined

    const products = keyBy(PRD, 'prodNick')

    const isCroissant = (prodNick) => {
      const { doughNick, packGroup } = products[prodNick]

      return doughNick === 'Croissant' 
        && ['baked pastries', 'frozen pastries'].includes(packGroup)
    }

    const _cart = cart.filter(C => isCroissant(C.prodNick))
    const _standing = standing.filter(S => isCroissant(S.prodNick))

    const ordersByDate = dateList.map(dateObj => {
      const { delivDate, dayOfWeek, relDate } = dateObj

      const cartDict = keyBy(
        _cart.filter(C => C.delivDate === delivDate),
        item => `${item.locNick}#${item.prodNick}`
      )
      const standingDict = keyBy(
        _standing.filter(S => S.isStand === true && S.dayOfWeek === dayOfWeek), 
        item => `${item.locNick}#${item.prodNick}`
      )
      const holdingDict = keyBy(
        _standing.filter(S => S.isStand === false && S.dayOfWeek === dayOfWeek), 
        item => `${item.locNick}#${item.prodNick}`
      )

      const orders = includeHolding 
        ? { ...holdingDict, ...standingDict, ...cartDict }
        : { ...standingDict, ...cartDict } 

      return Object.values(orders).map(order => ({
        ...order,
        delivDate,
        dayOfWeek,
        relDate,
      }))
    })

    const orders = flatten(ordersByDate)
    const routedOrders = '' //TODO

    const frCroixConsumptionProjection = [0, 1, 2, 3, 4].map(relDate => {

      // const frplConsumed = orders.filter(order => 
      //   order.prodNick === 'frpl' && order.relDate === relDate
      //   ||  
      // )
      
      // return {

      // }

    })

  }

  return { data: useMemo(composeData, [cart, standing, PRD])}
  
}

