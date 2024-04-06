import { DateTime } from "luxon"

/**
 * @param {Object} input
 * @param {DateTime} input.reportDT - 'yyyy-MM-dd' formatted date string
 */
export const useDoobieStuff = ({ reportDT }) => {
  let yes = reportDT.ordinal % 2 === 0
  
  const doobieStuff = [
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

<<<<<<< HEAD:src/Pages/Production/BPBN/dataDoobieStuff.js
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
=======
  // const doobieStuffx = [
  //   {
  //     Prod: "Doobie Buns",
  //     Bucket: "YES",
  //     Mix: yes ? "YES" : "YES",
  //     Bake: yes ? "NO" : "NO",
  //   },
  //   {
  //     Prod: "Siciliano",
  //     Bucket: "YES",
  //     Mix: yes ? "NO" : "NO",
  //     Bake: yes ? "YES" : "YES",
  //   },
  // ]
>>>>>>> 3bd7fb7e1c5c3a581d6a05e96c26f1087bc9dd1d:src/Pages/Production/dataBPBNDoobieStuff.js

  return { data:doobieStuff }
  
}