import { API } from "aws-amplify"

const displayTextMap = {
  deliv: "Delivery",
  slopick: "SLO Pick Up",
  atownpick: "Carlton Pick Up"
}

export const sendConfirmationEmail = async (
  location, 
  cartHeader, 
  cartItems, 
  delivDateJS,
  products,
) => {
  const { locName, orderCnfEmail } = location
  const { route, ItemNote } = cartHeader

  if (!orderCnfEmail) return false
  
  const toAddr = orderCnfEmail
    .split(',').map(email => email.trim()).filter(email => email !== '')
  
  //console.log(toAddr)

  const body = {
    params: {
      Source: "backporchbakeryslo@gmail.com",
      Destination: {
        ToAddresses: toAddr,
      },
      Message: {
        Subject: {
          Data: `Your BPB Order for ${delivDateJS.toLocaleDateString('en-US')} at ${locName}`
        },
        Body: {
          Html: {
            // Data: "This message body contains HTML formatting. 
            // It can, for example, contain links like this one: 
            // <a 
            //   class=\"ulink\" 
            //   href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" 
            //   target=\"_blank\"
            // >
            //   Amazon SES Developer Guide
            // </a>."
            Data: `
              <head>
                <style>
                  table {border-spacing: 1rem 0rem;}
                  th {
                    text-align: left;
                    padding-block: .5rem;
                  }
                  .qty-column {text-align: center;}
                </style>
              </head>
              
              <body>
                <h2>Order for ${delivDateJS.toLocaleDateString('en-US')}</h2>
                <p>Your order has been set as follows: </p>
                ${route === 'deliv' 
                  ? `<p>${displayTextMap[route]} to ${locName}</p>`
                  : `<p>${displayTextMap[route]}</p>`
                }
                ${ItemNote ? `<p>Note: ${ItemNote}</p>` : ''}
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${cartItems.filter(item => item.qty > 0).map(item => `
                      <tr>
                        <td>${products[item.prodNick].prodName}</td>
                        <td class="qty-column">${item.qty}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </body>
            `
          }
        }
      }
    }
  }

  const emailResp = await API.post('bpbGateway', '/ses', {body: body})
  console.log(emailResp)

  return true

}