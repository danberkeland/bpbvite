import { getInfoQBAuth, listInfoQBAuths } from "../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

const axios = require("axios").default;

export const checkQBValidation = async () => {
  let access;
  let val = await axios.get(
    "https://28ue1wrzng.execute-api.us-east-2.amazonaws.com/done"
  );

  console.log('val', val)

  if (val.data) {
    let authData = await API.graphql(
      graphqlOperation(listInfoQBAuths, { limit: "200" })
    );
    console.log('authData', authData)
      
    let ind = authData.data.listInfoQBAuths.items.findIndex(auth => auth.id === "accessToken")
    console.log('ind', ind)
    access = authData.data.listInfoQBAuths.items[ind].infoContent;
    console.log("access",access)
    console.log("authData",authData)
    
  } else {
    console.log("not valid QB Auth");
  }

  return access;
};

// fetch accessToken with getItem query instead
export const checkQBValidation_v2 = async () => {

  const fetchURL = "https://28ue1wrzng.execute-api.us-east-2.amazonaws.com/done"
  
  const accessToken = axios.get(fetchURL)
    .then(response => {
      if (!response) {
        throw new Error("QB Auth not valid")
      } else {
        // get appsync token
        return API.graphql(
          graphqlOperation(getInfoQBAuth, { id: "accessToken" })
        )
      }

    })
    .then(gqlResp => {
      return gqlResp.data.getInfoQBAuth.infoContent

    })
    .catch(err => {

      console.error(err)
      return undefined
    })

  return accessToken   
}


export const createQBInvItem = (count, ord, qbID, delivDate) => {
    return {
      Id: count.toString() + delivDate.replace(/-/g, ""),

      Description: ord.prodName,
      Amount: Number(ord.rate) * Number(ord.qty),
      DetailType: "SalesItemLineDetail",
      SalesItemLineDetail: {
        ServiceDate: delivDate,

        UnitPrice: ord.rate,
        Qty: ord.qty,
        ItemRef: {
          name: ord.prodName,
          value: qbID,
        },
        ItemAccountRef: {
          name: "Uncategorized Income",
        },
        TaxCodeRef: {
          value: "TAX",
        },
      },
    };
  };


 

  export const findProductQBID = (products,ord) => {
    let qbID = null;
    try {
      qbID =
        products[products.findIndex((pro) => pro.prodName === ord.prodName)]
          .qbID;
    } catch {}
    return qbID;
  };


  export const getQBInvIDandSyncToken = async (access, docNum) => {
    let invID
    try {
        invID = await axios.post(
          "https://unfaeakk8g.execute-api.us-east-2.amazonaws.com/done",
          {
            accessCode: "Bearer " + access,
            doc: docNum,
          }
        );
      } catch {
        console.log("Error grabbing invID for " + docNum);
      }
    return invID
  }



  export const createQBInvoice = async (access, custSetup) => {
    let invID
    try {
        invID = await axios.post(
          "https://9u7sp5khrc.execute-api.us-east-2.amazonaws.com/done",
          {
            accessCode: "Bearer " + access,
            invInfo: custSetup,
          }
        );
      } catch {
        console.log("Error creating Invoice " + custSetup.CustomerRef.name);
      }
    return invID
  }

  

  export const deleteQBInvoice = async (access, custSetup) => {
    let invID
    try {
        invID = await axios.post(
          "https://63m47lgp1b.execute-api.us-east-2.amazonaws.com/done",
          {
            accessCode: "Bearer " + access,
            invInfo: custSetup,
          }
        );
      } catch {
        console.log("Error creating Invoice " + custSetup.CustomerRef.name);
      }
    return invID
  }


  export const createQBCustomer = async (access, QBDetails) => {
    let cust
    try {
      cust = await axios
        .post("https://brzqs4z7y3.execute-api.us-east-2.amazonaws.com/done", {
          accessCode: "Bearer " + access,
          itemInfo: QBDetails,
          itemType: "Customer"
        })
        .then((data) => 
          data.data
        );
    } catch {
      console.log("Error creating Item ");
    }
    return cust
  }


  export const getQBProdSyncToken = async (access,updateDetails) => {
    let SyncToken
    console.log('access', access)
    console.log('updateDetails', updateDetails)
    try {
      await axios
        .post("https://sntijvwmv6.execute-api.us-east-2.amazonaws.com/done", {
          accessCode: "Bearer " + access,
          itemInfo: updateDetails.qbID,
          itemType: "Customer"
        })
        .then((data) => {
          SyncToken = data.data;
        });
    } catch {
      console.log("Error creating Item " + updateDetails.custName);
    }
    return SyncToken
  }



  export const grabQBInvoicePDF = async (access,invPDF,txnDate,custQBID) => {
    try {
      invPDF = await axios.post(
        "https://47i7i665dd.execute-api.us-east-2.amazonaws.com/done",
        {
          accessCode: "Bearer " + access,
          delivDate: txnDate,
          custID: custQBID,
        }
      );
     
      return invPDF.data
      
    } catch {}
  }


  export const emailQBInvoice = async (access,docNum) => {
    let emailResponse
    try {
      emailResponse = await axios
        .post("https://uhjpmnpz12.execute-api.us-east-2.amazonaws.com/emailQBInvoice", {
          accessCode: "Bearer " + access,
          docNum: docNum,
        })
        .then((data) => 
          data
        );
    } catch {
      console.log("Error creating Item ");
    }
    return emailResponse
 }

  