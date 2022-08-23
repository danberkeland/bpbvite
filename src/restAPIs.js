import axios from "axios";

const API_testingGrQL = "https://q086lcz3fa.execute-api.us-east-2.amazonaws.com/auth/testingGrQL"


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
  
  
  