import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js'
const dynamo = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" })

const submitLegacyCart = async (event) => {
  
  let statusCode = 200
  let errors
  
  let requestData = JSON.parse(event.body) 
  // try { 
  //   requestData = JSON.parse(event.body) 
  // } catch { 
  //   requestData = event.body 
  // }
  
  console.log("requestData:", requestData)

  let responseItems = []
  for (let order of requestData) {
    let responseByDate = await submitCartByDate(order)
    responseItems.push(responseByDate)
  }


  let response = {
    statusCode: statusCode,
    body: {
      data: {items: responseItems},
      errors: errors
    }
  }
  
  console.log("final response:", JSON.stringify(response, null, 2))
  return response
}
export default submitLegacyCart



const submitCartByDate = async (order) => {
  console.log("order", order)
  const custName = order.header.custName
  const delivDate = order.header.delivDate
  
  let statusCode =200
  let errors
  
  
  let returnData = []
  let newItems = order.items
  let legacyItems = (await getLegacyOrders(custName, delivDate)).Items
  console.log("from ddb", legacyItems)
  
  for (let newItem of newItems) {
    let legacyItem = legacyItems.find(i => i.prodName === newItem.prodName)
    
    if (!!legacyItem) {
      // returnData.push({prodName: newItem.prodName, action: 'UPDATE'})
      if (
        legacyItem.qty !== newItem.qty 
          || legacyItem.route !== order.header.route
          || legacyItem.PONote !== order.header.PONote
      ) {
        let resp = await updateItem(order.header, newItem, legacyItem)
        returnData.push(resp)
      }
    } else {
      // returnData.push({prodName: newItem.prodName, action: 'CREATE'})
      let resp = await createItem(order.header, newItem)
      returnData.push(resp)
    }
  }
  
  for (let legacyItem of legacyItems) {
    let newItem = newItems.find(i => i.prodName === legacyItem.prodName)
    if (!newItem) {
      // returnData.push({prodName: oldItem.prodName, action: 'DELETE'})
      if (
        legacyItem.qty > 0
          || legacyItem.route !== order.header.route
          || legacyItem.PONote !== order.header.PONote
      ) {
        let resp = await deleteItem(order.header, legacyItem)
        returnData.push(resp)
      }
    }
  }
  
  return ({
    statusCode: statusCode,
    data: returnData,
    errors: errors
  })
  
}
  
  
const getLegacyOrders = async (cust, date) => {
  const params = {
    TableName: "Order-huppwy3hefgohh6ur7yuz5vkcm-newone",
    FilterExpression: "custName = :cust AND delivDate = :date",
    ExpressionAttributeValues: {
      ":cust": cust,
      ":date": date,
    },
    ProjectionExpression: "id, PONote, route, prodName, qty",
  }

  return dynamo.scan(params).promise()
}


function updateItem(header, newItem, oldItem) {
  const params = {
    TableName: "Order-huppwy3hefgohh6ur7yuz5vkcm-newone",
    Key: { id: oldItem.id },
    ExpressionAttributeNames: {
      "#q": "qty",
      "#so": "SO",
      "#r": "route",
      "#po": "PONote"
    },
    ExpressionAttributeValues: {
      ":q": Number(newItem.qty),
      ":so": Number(newItem.qty),
      ":r": header.route,
      ":po": header.PONote
    },
    UpdateExpression: "set #q = :q, #so = :so, #r = :r, #po = :po",
  };
  return dynamo.update(params).promise();
  // console.log("update item:", oldItem.prodName, params.Key.id)
  // return params.Key.id
}

function createItem(header, item) {
  const dd = new Date().toISOString()
  const params = {
    TableName: "Order-huppwy3hefgohh6ur7yuz5vkcm-newone",
    Item: {
      id: AWS.util.uuid.v4(),
      _typename: "Order",
      isWhole: header.isWhole,
      custName: header.custName,
      delivDate: header.delivDate,
      route: header.route,
      PONote: header.PONote,
      prodName: item.prodName,
      qty: Number(item.qty),
      SO: Number(item.qty),
      rate: Number(item.rate),
      createdAt: dd,
      updatedAt: dd,
      timeStamp: new Date().toISOString(),
    },
  }
  
  return dynamo.put(params).promise();
  // console.log("create item:", params.Item)
  // return params.Item
}



function deleteItem(header, oldItem) {
  const params = {
    TableName: "Order-huppwy3hefgohh6ur7yuz5vkcm-newone",
    Key: { id: oldItem.id },
    ExpressionAttributeNames: {
      "#q": "qty",
      "#so": "SO",
      "#r": "route",
      "#po": "PONote"
    },
    ExpressionAttributeValues: {
      ":q": 0,
      ":so": 0,
      ":r": header.route,
      ":po": header.PONote
    },
    UpdateExpression: "set #q = :q, #so = :so, #r = :r, #po = :po",
  };
  return dynamo.update(params).promise();
  // console.log("delete item:", oldItem.prodName, params.Key.id)
  // return params.Key.id
}