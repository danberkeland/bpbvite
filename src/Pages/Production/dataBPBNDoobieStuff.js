import { DateTime } from "luxon"

/**
 * @param {Object} input
 * @param {DateTime} input.reportDT - 'yyyy-MM-dd' formatted date string
 */
export const useDoobieStuff = ({ reportDT }) => {
  let yes = reportDT.ordinal % 2 === 0
  
  const doobieStuffx = [
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
       Bake: yes ? "NO" : "NO",
     },
   ]

  return { data:doobieStuff }
  
}