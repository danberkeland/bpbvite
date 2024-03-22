import { isoToDT } from "../../utils"

/**
 * @param {Object} input
 * @param {string} input.reportDate - 'yyyy-MM-dd' formatted date string
 */
export const useDoobieStuff = ({ reportDate }) => {
  const reportDateDT = isoToDT(reportDate)
  let yes = reportDateDT.ordinal % 2 === 0
  
  const doobieStuffx = [
    {
      Prod: "Doobie Buns",
      Bucket: "YES",
      Mix: yes ? "YES" : "YES",
      Bake: yes ? "NO" : "NO",
    },
    {
      Prod: "Siciliano",
      Bucket: "YES",
      Mix: yes ? "NO" : "NO",
      Bake: yes ? "YES" : "YES",
    },
  ]

  const doobieStuff = [
    {
      Prod: "Doobie Buns",
      Bucket: "YES",
      Mix: yes ? "NO" : "NO",
      Bake: yes ? "NO" : "NO",
    },
    {
      Prod: "Siciliano",
      Bucket: "YES",
      Mix: yes ? "NO" : "NO",
      Bake: yes ? "YES" : "YES",
    },
  ]

  return doobieStuff
  
}