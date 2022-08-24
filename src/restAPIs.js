import axios from "axios";

const API_testingGrQL = "https://dltjjr5aja.execute-api.us-east-2.amazonaws.com/dev/testingGrQL"
const API_grabLocList = "https://lkho363aq2.execute-api.us-east-2.amazonaws.com/dev/grabloclist"

export const testingGrQL = async (locNick, delivDate, dayOfWeek) => {
    let testOrder
    try {
        testOrder = await axios.post(
          API_testingGrQL,
          {
            locNick: locNick,
            delivDate: delivDate,
            dayOfWeek: dayOfWeek
          }
        );
        
      } catch(err) {
        console.log("Error grabbing testingGrQL", err);
      }
    console.log("testOrder",testOrder)
    return testOrder.data.body
  }
  
  
  export const grabLocList = async () => {
    let locList
    try {
      locList = await axios.post(
          API_grabLocList,
          {}
        );
        
      } catch(err) {
        console.log("Error grabbing locList", err);
      }
    console.log("locList",locList)
    return locList.data.body
  }