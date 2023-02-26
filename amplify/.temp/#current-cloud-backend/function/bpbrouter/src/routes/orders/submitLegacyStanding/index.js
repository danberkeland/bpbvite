import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js'
const dynamo = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" })

const submitLegacyStanding = async (event) => {
  
  console.log("VERSION:", AWS.VERSION)
  
  let statusCode = 200
  let errors
  
  let requestData
  try { 
    requestData = JSON.parse(event.body) 
  } catch { 
    requestData = event.body 
  }
  
  console.log("REQUEST DATA", requestData)
  
  let returnData = []
  
  let custName = requestData.header.custName
  let isStand = requestData.header.isStand
  let newItems = requestData.items

  let legacyItems = (await getLegacyStanding(custName, isStand)).Items
  console.log("from ddb", JSON.stringify(legacyItems, null, 2))
  
  for (let newItem of newItems) {
    let legacyItem = legacyItems.find(i => i.prodName === newItem.prodName)
    
    if (!!legacyItem) {
      console.log("UPDATE", newItem.prodName)
      let resp = await updateStandingItem(newItem, legacyItem)
      returnData.push(resp)
      
    } else {
      console.log("CREATE", newItem.prodName)
      let resp = await createStandingItem(requestData.header, newItem)
      returnData.push(resp)
      
    }
    
  }
    
  
  return ({
    statusCode: statusCode,
    data: returnData,
    errors: errors
  })
  
}
export default submitLegacyStanding



const getLegacyStanding = async (cust, isStand) => {
  const params = {
    TableName: "Standing-huppwy3hefgohh6ur7yuz5vkcm-newone",
    ExpressionAttributeValues: {
      ":cust": cust,
      ":isStand": isStand
    },
    FilterExpression: "custName = :cust AND isStand = :isStand",
    ProjectionExpression: "id, prodName",
  }

  return dynamo.scan(params).promise()
}


function updateStandingItem(newItem, oldItem) {
  const params = {
    TableName: "Standing-huppwy3hefgohh6ur7yuz5vkcm-newone",
    Key: { id: oldItem.id },
    ExpressionAttributeNames: {
      "#sun": "Sun",
      "#mon": "Mon",
      "#tue": "Tue",
      "#wed": "Wed",
      "#thu": "Thu",
      "#fri": "Fri",
      "#sat": "Sat",
    },
    ExpressionAttributeValues: {
      ":sun": Number(newItem.Sun),
      ":mon": Number(newItem.Mon),
      ":tue": Number(newItem.Tue),
      ":wed": Number(newItem.Wed),
      ":thu": Number(newItem.Thu),
      ":fri": Number(newItem.Fri),
      ":sat": Number(newItem.Sat)
    },
    UpdateExpression: "set #sun = :sun, #mon = :mon, #tue = :tue, #wed = :wed, #thu = :thu, #fri = :fri, #sat = :sat",
  };
  return dynamo.update(params).promise()
}


function createStandingItem(header, item) {
  const dd = new Date().toISOString()
  const params = {
    TableName: "Standing-huppwy3hefgohh6ur7yuz5vkcm-newone",
    Item: {
      id: AWS.util.uuid.v4(),
      __typename: "Standing",
      isStand: header.isStand,
      custName: header.custName,
      prodName: item.prodName,
      Sun: item.Sun,
      Mon: item.Mon,
      Tue: item.Tue,
      Wed: item.Wed,
      Thu: item.Thu,
      Fri: item.Fri,
      Sat: item.Sat,
      createdAt: dd,
      updatedAt: dd,
      timeStamp: new Date().toISOString(),
    },
  }
  
  return dynamo.put(params).promise();
  // console.log("create item:", params.Item)
  // return params.Item
}
