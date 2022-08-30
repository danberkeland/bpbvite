import axios from "axios";

const API_testingGrQL = "https://dltjjr5aja.execute-api.us-east-2.amazonaws.com/dev/testingGrQL"
const API_grabLocList = "https://lkho363aq2.execute-api.us-east-2.amazonaws.com/dev/grabloclist"
const API_grabStandOrder = "https://ab83b5yb6c.execute-api.us-east-2.amazonaws.com/auth/grabStandOrder"

export const testingGrQL = async (locNick, delivDate) => {
    console.log("delivDate",delivDate)
    let testOrder
    try {
        testOrder = await axios.post(
          API_testingGrQL,
          {
            locNick: locNick,
            delivDate: delivDate
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
  console.log("grabLocList Response:",locList.status)
  return locList.data.body
}


export const grabStandOrder = async (locNick) => {
  let testOrder
  try {
      testOrder = await axios.post(
        API_grabStandOrder,
        {
          locNick: locNick
        }
      );
      
    } catch(err) {
      console.log("Error grabbing testingGrQL", err);
    }
  console.log("testOrder",testOrder)
  return testOrder.data.body
}