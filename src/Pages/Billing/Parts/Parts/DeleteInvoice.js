import React from "react";
import { Button } from "primereact/button";

// import swal from "@sweetalert/with-react";

import { convertDatetoBPBDate } from "../../../../utils/_deprecated/dateTimeHelpers";
import { API, graphqlOperation } from "aws-amplify";

import { updateOrder, createOrder } from "../../../../graphql/mutations";
import { checkQBValidation, deleteQBInvoice, getQBInvIDandSyncToken } from "../../../../data/QBHelpers";
import { useSettingsStore } from "../../../../Contexts/SettingsZustand";

const clonedeep = require("lodash.clonedeep");

export const DeleteInvoice = (
  invNum,
  dailyInvoices,
  setDailyInvoices,
  orders,
  delivDate,
  
) => {

    
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const isChange = useSettingsStore((state) => state.isChange);
  const setIsChange = useSettingsStore((state) => state.setIsChange);


  
 
  const deleteCheck = (invNum) => {
    /*
    swal({
      text: " Are you sure that you would like to permanently delete this invoice?",
      icon: "warning",
      buttons: ["Yes", "Don't do it!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (!willDelete) {
        deleteInvoiceFinal(invNum);
      } else {
        return;
      }
    });*/
  };

  const deleteInvoiceFinal = async (invNum) => {
    setIsLoading(true)
    let invToModify = clonedeep(dailyInvoices);
    invToModify = invToModify.filter((inv) => inv["invNum"] !== invNum);
   
    let access = await checkQBValidation();
    let invID = await getQBInvIDandSyncToken(access, invNum);

    
    let qbID = invID.data.Id
    let sync = invID.data.SyncToken
    if (qbID){
      let custSetup = {
        Id: qbID,
        SyncToken: sync,
        
      };
      console.log("qbID",qbID)
      console.log("SyncToken",sync)
      
      deleteQBInvoice(access, custSetup);
      console.log("I think it worked")
    } else {
      console.log("No invoice to delete")
    }
    
   
    let dailyParsedInvoices = dailyInvoices.filter(
      (daily) => daily.invNum === invNum
    );
    let parsedCust = dailyParsedInvoices[0].custName;
    dailyParsedInvoices = dailyParsedInvoices[0].orders.filter(daily => daily.prodName !== "DELIVERY")
    for (let parse of dailyParsedInvoices) {
      parse.custName = parsedCust;
    }

    let parsedOrders = orders.filter(
      (ord) =>
        ord.custName === parsedCust &&
        ord.delivDate === convertDatetoBPBDate(delivDate) 
    );
    console.log("dailyParsedInvoices", dailyParsedInvoices);
    console.log("parsedOrders", parsedOrders);

    for (let ord of dailyParsedInvoices) {
      let updateDetails = {
        qty: ord.qty,
        prodName: ord.prodName,
        custName: ord.custName,
        rate: 0,
        SO: ord.qty,
        delivDate: convertDatetoBPBDate(delivDate)
        
      };
      

      let ind = parsedOrders.findIndex(
        (parse) => parse.prodName === ord.prodName
      );
      if (ind > -1) {
        updateDetails["id"] = parsedOrders[ind].id;
        console.log("updateDetails",updateDetails)
        try {
          await API.graphql(
            graphqlOperation(updateOrder, { input: { ...updateDetails } })
          );
          console.log(updateDetails.prodName, "Successful update");
        } catch (error) {
          console.log(error, "Failed Update");
        }
      } else {
        
        
        try {
          await API.graphql(
            graphqlOperation(createOrder, { input: { ...updateDetails } })
          );
          console.log(updateDetails.prodName, "Successful create");
        } catch (error) {
          console.log(error, "Failed create");
        }
      }
    }
  
   
    setIsLoading(false)
  };

  return (
    <Button
      icon="pi pi-trash"
      className="p-button-outlined p-button-rounded p-button-help p-button-sm"
      onClick={(e) => deleteCheck(invNum)}
    />
  );
};
