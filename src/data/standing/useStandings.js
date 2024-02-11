import { useMemo } from "react"
import { useListData } from "../_listData.js"
import { Data } from "../../utils/dataFns.js"

/**@typedef {import('../types.d.js').DBStanding} DBStanding*/ 

/**
 * Cleans incoming data by separating out any "duplicate" records.
 * @param {Object} input
 * @param {boolean} input.shouldFetch
 * @param {'standingByDayOfWeek'|'standingByLocByDayOfWeek'} [input.customQuery]
 * @param {Object} [input.variables]
 */
const useStandingsGeneric = ({shouldFetch, customQuery, variables}) => {

  const { data: cacheData , ...otherCacheItems } = useListData({ 
    tableName: "Standing", 
    shouldFetch,
    customQuery,
    variables,
  })

  const calculateValue = () => {
    if (!cacheData) return { data: undefined, dupes: undefined }
 
    /** @type {DBStanding[]} */ 
    const standings = cacheData

    const groupList = Data.bucketBy(standings, 
      I => `${I.isWhole}#${I.dayOfWeek}#${I.locNick}#${I.prodNick}`
    )
    const sortedGroupList = groupList.map(grp => 
      Data.orderBy(
        grp, 
        [(/** @type {DBStanding} */ item) => item.updatedAt], 
        ["desc"]
      )
    )
    const returnData = sortedGroupList.map(grp => grp[0])
    const dupes = sortedGroupList.flatMap(grp => grp.slice(1))
 
     if (dupes.length) {
       console.warn("warning: duplicates found", dupes)
     }
     
     return { data: returnData, dupes }

   }
  
   return { 
    ...useMemo(calculateValue, [cacheData]),
    otherCacheItems 
  }

}

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch
 */
const useStandings = ({ shouldFetch }) => useStandingsGeneric({ shouldFetch })

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch
 * @param {string} input.locNick
 */
const useStandingsByLocNick = ({ shouldFetch, locNick }) => 
  useStandingsGeneric({
    shouldFetch: shouldFetch && !!locNick,
    customQuery: "standingByLocByDayOfWeek",
    variables: {
      locNick,
      limit: 5000
    }
  })

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch
 * @param {string} input.locNick
 * @param {string} input.dayOfWeek
 */
const useStandingsByLocNickByDayOfWeek = ({ shouldFetch, locNick, dayOfWeek }) => 
  useStandingsGeneric({
    shouldFetch: shouldFetch && !!locNick && !!dayOfWeek,
    customQuery: "standingByLocByDayOfWeek",
    variables: {
      locNick,
      dayOfWeek: { eq: dayOfWeek },
      limit: 5000
    }
  })

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch
 * @param {string} input.dayOfWeek
 */
const useStandingsByDayOfWeek = ({ shouldFetch, dayOfWeek }) => 
  useStandingsGeneric({
    shouldFetch: shouldFetch && !!dayOfWeek,
    customQuery: "standingByDayOfWeek",
    variables: {
      dayOfWeek: { eq: dayOfWeek },
      limit: 5000
    }
  })


export { 
  useStandings,
  useStandingsByLocNick,
  useStandingsByLocNickByDayOfWeek,
  useStandingsByDayOfWeek
}