import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
  query MyQuery {
    listLocations {
      items {
        Type
        locName
        locNick
        zoneNick
        addr1
        addr2
        city
        zip
        email
        phone
        toBePrinted
        toBeEmailed
        printDuplicate
        terms
        invoicing
        latestFirstDeliv
        latestFinalDeliv
        webpageURL
        picURL
        gMap
        specialInstructions
        delivOrder
        qbID
        currentBalance
        subs {
          items {
            sub
          }
        }
      }
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 * 
 * 
 */
// Update

const grabDetailedLocationList = async (event) => {
  let response = await mainCall(query, event);
  
  let newArray=[];
  
  for ( let item of response.body.body.listLocations.items){
    console.log("item",item);
    try{
      for (let sub of item.subs.items){
        if (sub.sub === response.body.user.sub){
          newArray.push(item);
        }
      }
    }catch{}
  }
  console.log("newArray",newArray);
  
  response.user = response.body.user;
  response.body.items = newArray;
  
  return response;
};

export default grabDetailedLocationList;
