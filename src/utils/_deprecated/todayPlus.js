import { DateTime } from "luxon";

export const todayPlus = () => {
 
  const todayDT = DateTime.now().setZone("America/Los_Angeles");
  return [0, 1, 2, 3, -1, -8, -2, -3, -4, -5, -6, 15, 4].map(relDate =>
    relDate >= 0 
      ? todayDT.plus({ days: relDate }).toFormat('yyyy-MM-dd')  
      : todayDT.minus({ days: relDate * -1 }).toFormat('yyyy-MM-dd')  
  )

};