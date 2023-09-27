import React, { useContext, useEffect, useRef } from "react";

import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import styled from "styled-components";

import {
  convertDatetoBPBDate,
  todayPlus,
  daysOfTheWeek,
} from "../../../helpers/dateTimeHelpers";

import {
  checkQBValidation,
  createQBInvoice,
  getQBInvIDandSyncToken,
  emailQBInvoice,
} from "../../../helpers/QBHelpers";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";

const { DateTime } = require("luxon");

const BasicContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-around;
  box-sizing: border-box;
`;

const printButtonStyle = {
  backgroundColor: "hsl(97.26, 51.67%, 40%)",
  border: "solid 1px hsl(97.26, 51.67%, 35%)",
  fontSize: "1.25rem",
}

let today = todayPlus()[0];
let Sunday = daysOfTheWeek()[0];
let Sunday15due = daysOfTheWeek()[7];

const SelectDate = ({ database, dailyInvoices }) => {
  
  const [products = [], customers = [], routes = [], standing = [], orders = []] = database || [];
 
  
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const delivDate = useSettingsStore((state) => state.delivDate);
  const setDelivDate = useSettingsStore((state) => state.setDelivDate);
  

  const toast = useRef(null);

  const showSuccess = (invNum) => {
    toast.current.show({
      severity: "success",
      summary: "Invoice created",
      detail: invNum + " successfully entered",
      life: 3000,
    });
  };

  const showSuccessEmail = (custo, status) => {
    toast.current.show({
      severity: status === 200 ? "success" : "error",
      summary: "Invoice Emailed",
      detail: "Invoice Status for " + custo,
      life: 3000,
    });
  };

  const showNoEmail = (custo) => {
    toast.current.show({
      severity: "warn",
      summary: "No Invoice",
      detail: "No Invoice for " + custo,
      life: 3000,
    });
  };

  const showDoNotMail = (custo) => {
    toast.current.show({
      severity: "info",
      summary: "No Mail",
      detail: "No Mailing Option for " + custo,
      life: 3000,
    });
  };

  useEffect(() => {
    setDelivDate(today);
  }, []);

  const setDate = (date) => {
    const dt2 = DateTime.fromJSDate(date);
    setDelivDate(dt2.toFormat("yyyy-MM-dd"));
  };

  const createQBItem = (count, ord, qbID) => {
    let lineID = qbID ? delivDate.replace(/-/g, "") + qbID : "0000991234";
    lineID = lineID.slice(5);
    console.log("Id", lineID);
    return {
      Id: lineID,

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

  const exportCSV = async (dailyInv, email) => {
    setIsLoading(true);
    let access = await checkQBValidation();

    /*  

      Format for dailyInv:

        custName: "15 degrees",
        invNum: "0104202215c",
        orders:
          0:
            prodName: "Blueberry Muffin",
            qty: 1,
            rate: 1.56
        qbID: "596"

    */

    for (let inv of dailyInv) {
      /* begin export csv module */

      try {
        let count = 0;
        let total = 0;
        let custOrders = [];

        for (let ord of inv.orders) {
          count = count + 1;
          total = total + Number(ord.rate) * Number(ord.qty);
          let thisProd =
            products[
              products.findIndex((pro) => pro.prodName === ord.prodName)
            ];
          let qbID = null;
          try {
            qbID = thisProd.qbID;
          } catch {}

          let item = createQBItem(count, ord, qbID);
          custOrders.push(item);
        }

        let TxnDate = delivDate;
        let DocNum = inv.invNum;
        let dueDate = todayPlus()[11]; // relate this to terms
        let custo =
          customers[
            customers.findIndex((cust) => cust.custName === inv.custName)
          ];
        let custInvoicing = custo.invoicing;
        let custNick = custo.nickName;

        let ponote;
        try {
          ponote =
            orders[
              orders.findIndex(
                (order) =>
                  order.delivDate === convertDatetoBPBDate(delivDate) &&
                  order.custName === inv.custName
              )
            ].PONote;
        } catch {
          ponote = "na";
        }
        let addr1;
        let addr2;
        let state;
        let zipCode;
        let terms;
        let custEmail;

        try {
          addr1 = custo.addr1;
          addr2 = custo.city;
          state = "CA";
          zipCode = custo.zip;
          terms = custo.terms;
          custEmail = custo.email;
        } catch {}

        let custSetup = {
          AllowIPNPayment: false,
          AllowOnlinePayment: false,
          AllowOnlineCreditCardPayment: false,
          AllowOnlineACHPayment: true,
          domain: "QBO",
          DocNumber: DocNum,
          sparse: true,
          TxnDate: TxnDate,
          CurrencyRef: {
            value: "USD",
            name: "United States Dollar",
          },
          Line: custOrders,
          CustomerRef: {
            value: inv.qbID,
            name: inv.custName,
          },
          CustomerMemo: {
            value: ponote,
          },
          BillAddr: {
            Line1: addr1,
            CountrySubDivisionCode: state,
            PostalCode: zipCode,
          },
          ShipAddr: {
            Line1: addr1,
            Line2: addr2,
          },
          FreeFormAddress: true,

          ClassRef: {
            value: "3600000000001292604",
            name: "Wholesale",
          },
          SalesTermRef: {
            name: terms,
          },
          DueDate: dueDate,
          ShipDate: TxnDate,

          BillEmail: {
            Address: custEmail,
          },
        };
        if (custInvoicing !== "no invoice") {
          let invID;

          invID = await getQBInvIDandSyncToken(access, DocNum);

          if (Number(invID.data.Id) > 0) {
            custSetup.Id = invID.data.Id;
            custSetup.SyncToken = invID.data.SyncToken;

            if (custInvoicing === "daily") {
              custSetup.sparse = false;
            }
          } else {
          }

          createQBInvoice(access, custSetup);
          showSuccess(DocNum);
        }
      } catch {}

      /* end csv module */

      if (email) {
        /* Begin email module */

        let DocNum = inv.invNum;
        
        let invID = await getQBInvIDandSyncToken(access, DocNum);
       
        if (Number(invID.data.Id) > 0) {
          invID = invID.data.Id;
          let custo =
            customers[
              customers.findIndex((cust) => cust.custName === inv.custName)
            ];
          if (custo.toBeEmailed) {
            let didItEmail = await emailQBInvoice(access, invID);
            showSuccessEmail(inv.custName, didItEmail.status);
          } else {
            showDoNotMail(inv.custName);
          }
        } else {
          showNoEmail(inv.custName);
        }

        /* end email module */
      }
    }
    setIsLoading(false);
  };

  const confirm = (e) => {
    confirmDialog({
      message: "Are all invoices accurate and ready for publishing?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => exportCSV(dailyInvoices, true),
    });
  };

  return (
    <React.Fragment>
      <Toast ref={toast} />
      <BasicContainer>
        <div className="p-field p-col-12 p-md-4">
          <label htmlFor="delivDate">Pick Delivery Date: </label>
          <Calendar
            id="delivDate"
            placeholder={convertDatetoBPBDate(delivDate)}
            dateFormat="mm/dd/yy"
            onChange={(e) => setDate(e.value)}
          />
        </div>

        <Button label="EXPORT CSV"
          onClick={() => exportCSV(dailyInvoices, false)}
          style={printButtonStyle}
        />
        <Button label="Email Invoices"
          onClick={(e) => {
            confirm();
          }}
          style={printButtonStyle}
        />
        <ConfirmDialog />
      </BasicContainer>
    </React.Fragment>
  );
};

export default SelectDate;
