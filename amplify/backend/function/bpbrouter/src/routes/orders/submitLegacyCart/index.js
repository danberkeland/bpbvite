import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js'
const dynamo = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" })

const submitLegacyCart = async (event) => {
  
  let statusCode = 200
  let errors
  
  let requestData = typeof(event.body) === "string" ?
    JSON.parse(event.body) :
    event.body
  
  let cloudwatchLog = {
    path: event.path
  }
  //console.log("requestData:", typeof(requestData), requestData.length, event.body)

  let responseItems = []
  for (let order of requestData) {
    let responseByDate = await submitCartByDate(order, cloudwatchLog)
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



const submitCartByDate = async (order, cloudwatchLog) => {
  //console.log("order", order)
  const custName = order.header.custName
  const delivDate = order.header.delivDate
  
  let statusCode =200
  let errors
  
  
  let returnData = []
  let newItems = order.items
  let legacyItems = (await getLegacyOrders(custName, delivDate)).Items
  
  let prods = [...new Set(newItems.concat(legacyItems).map(i => i.prodName))]
  let diff = prods.map(p => {
    let prevItem = legacyItems.find(i => i.prodName === p)
    let newItem = newItems.find(i => i.prodName === p)
    
    let dQty
    if (!newItem) dQty = 0
    else if (!prevItem) dQty = newItem.qty
    else dQty = (newItem.qty - prevItem.qty)
    
    return({
      prodName: p,
      dQty: dQty
    })
  })
 
  let dateParts = delivDate.split('/')
  let delivDateISO = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`
  let log = {
    ...cloudwatchLog,
    logType: "cartOrderSummary",
    custName: custName,
    delivDate: delivDateISO,
    route: order.header.route,
    PONote: order.header.PONote,
    submitItems: newItems.map(i => `${i.prodName}: ${i.qty}`).join(", "),
    itemChanges: diff.map(i => `${i.prodName}: ${i.dQty}`).join(", "),
    routeChanged: false,
    noteChanged: false
  }
  
  for (let newItem of newItems) {
    let legacyItem = legacyItems.find(i => i.prodName === newItem.prodName)
    
    if (!!legacyItem) {
      let dQty = legacyItem.qty !== newItem.qty
      let dRoute = legacyItem.route !== order.header.route
      let dPONote = legacyItem.PONote !== order.header.PONote
      
      if (dQty || dRoute || dPONote) {
        let resp = await updateItem(order.header, newItem, legacyItem)
        //returnData.push(resp)
      }
      if (dRoute) cloudwatchLog.routeChanged = true
      if (dPONote) cloudwatchLog.noteChanged = true
      
    } else {
      let resp = await createItem(order.header, newItem)
      //returnData.push(resp)
    }
  }
  
  console.log(JSON.stringify(log))
  
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
      __typename: "Order",
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
