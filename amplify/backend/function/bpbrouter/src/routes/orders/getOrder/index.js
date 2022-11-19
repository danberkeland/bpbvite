import mainCall from "/opt/mainCall/index.js";


const query = /* GraphQL */ `
  query MyQuery($locNick: String!, $delivDate: String!, $dayOfWeek: String!) {
    getLocation(locNick: $locNick) {
      orders(filter: { delivDate: { eq: $delivDate } }) {
        items {
          product {
            prodName
            wholePrice
          }
          qty
        }
      }
      standing(filter: { dayOfWeek: { eq: $dayOfWeek } }) {
        items {
          product {
            prodName
            wholePrice
          }
          qty
        }
      }
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const graborder = async (event) => {
  let statusCode = 200;
  let response;
  let list;
  let orders = {};
  let standing = {};
  let prods = {};
  let names = [];
  let final = [];

  console.log("event3", event)
  const variables = {
    locNick: JSON.parse(event.body).locNick,
    delivDate: JSON.parse(event.body).delivDate,
    dayOfWeek: JSON.parse(event.body).dayOfWeek,
  };
  console.log("variables", variables)
  try{
  let response = await mainCall(query, variables);
  
  console.log("response",response)
  /*
  let resp =   await response.body.body.getLocation;
  console.log("orders",orders)
  orders = await resp.orders.items.map((ord) => ({
    prodName: ord.product.prodName,
    prodNick: ord.product.prodNick,
    qty: ord.qty,
    type: "C",
    rate: ord.product.wholePrice,
  }));
  standing = await resp.standing.items.map((stand) => ({
    prodName: stand.product.prodName,
    prodNick: stand.product.prodNick,
    qty: stand.qty,
    type: "S",
    rate: stand.product.wholePrice,
  }));
  prods = [...orders, ...standing];
  console.log(prods);
  names = Array.from(new Set(prods.map((pro) => pro.prodNick)));

  for (let name of names) {
    let first = prods.find((obj) => obj.prodNick === name);
    final.push(first);
  }*/
} catch (error) {
  statusCode = 400;
  final = {
    errors: [
      {
        status: response.status,
        message: error.message,
        stack: error.stack,
      },
    ],
  };
}

return {
  statusCode,
  body: final,
};
};

export default graborder;
