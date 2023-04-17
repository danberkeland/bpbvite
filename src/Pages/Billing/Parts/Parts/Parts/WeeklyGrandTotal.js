import React from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

import { formatter } from "../../../../../helpers/billingGridHelpers";

import styled from "styled-components";

import { API, graphqlOperation } from "aws-amplify";

import { listHeldforWeeklyInvoicings } from "../../../../../graphql/queries";
import {
  createHeldforWeeklyInvoicing,
  updateHeldforWeeklyInvoicing,
} from "../../../../../graphql/mutations";

const clonedeep = require("lodash.clonedeep");

const FooterGrid = styled.div`
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px 10px;
  align-items: center;
`;

export const WeeklyGrandTotal = ({
  rowData,
  custName,
  weeklyInvoices,
  setWeeklyInvoices,
  products,
  pickedProduct,
  setPickedProduct,
  pickedQty,
  setPickedQty,
  pickedRate,
  setPickedRate,
  needToSave,
  setNeedToSave,
}) => {
  const handleAddProduct = (e, delivDate, custName) => {
    let invToModify = clonedeep(weeklyInvoices);
    let ind = invToModify.findIndex((inv) => inv["custName"] === custName);
    
    let nextInd = invToModify[ind].delivDate.findIndex(
      (inv) => inv["delivDate"] === delivDate
    );

    pickedQty = pickedQty ? pickedQty : 0;
    let prodToAdd = {
      prodName: pickedProduct,
      qty: pickedQty,
      rate: pickedRate,
    };
    invToModify[ind].delivDate[nextInd].orders.push(prodToAdd);
    setWeeklyInvoices(invToModify);
    setNeedToSave(true);
    setPickedProduct("");
    setPickedQty(0);
    setPickedRate(0);
  };
  let data = rowData.orders;
  let delivDate = rowData.delivDate;

  let sum = 0;

  try {
    for (let i of data) {
      sum = sum + Number(i.qty) * Number(i.rate);
    }

    sum = formatter.format(sum);
  } catch {
    console.log("nothing to calc");
  }

  const fetchInfo = async (operation, opString, limit) => {
    try {
      let info = await API.graphql(
        graphqlOperation(operation, {
          limit: limit,
        })
      );
      let list = info.data[opString].items;

      let noDelete = list.filter((li) => li["_deleted"] !== true);
      return noDelete;
    } catch {
      return [];
    }
  };

  const saveWeeklyOrder = async (e) => {
    let checkWeeklies;
    let ordsToMod;
    // fetchWeeklies = fetch Weekly Orders
    try {
      checkWeeklies = await fetchInfo(
        listHeldforWeeklyInvoicings,
        "listHeldforWeeklyInvoicings",
        "1000"
      );
    } catch (error) {
      console.log(error);
    }
  
    // find orders for custName and delivDate
    let ind = weeklyInvoices.findIndex((inv) => inv["custName"] === custName);
    let indDeliv = weeklyInvoices[ind].delivDate.findIndex(
      (deliv) => deliv["delivDate"] === delivDate
    );
    ordsToMod = weeklyInvoices[ind].delivDate[indDeliv].orders;

    // order for order
    for (let ord of ordsToMod) {
      let checkInd = checkWeeklies.findIndex(
        (week) =>
          week.prodName === ord.prodName &&
          week.custName === custName &&
          week.delivDate === delivDate
      );
      let newOrd = {
        custName: custName,
        delivDate: delivDate,
        prodName: ord.prodName,
        qty: ord.qty,
        rate: ord.rate,
      };

      if (checkInd < 0) {
        try {
          await API.graphql(
            graphqlOperation(createHeldforWeeklyInvoicing, {
              input: { ...newOrd },
            })
          );
        } catch (error) {
          console.log("error on adding Weekly Orders", error);
        }
      } else {
        newOrd.id = checkWeeklies[checkInd].id;
        try {
          await API.graphql(
            graphqlOperation(updateHeldforWeeklyInvoicing, {
              input: { ...newOrd },
            })
          );
        } catch (error) {
          console.log("error on updating Weekly Orders", error);
        }
      }
    }

    setNeedToSave(false);
  };

  return (
    <React.Fragment>
      <FooterGrid>
        <Button
          disabled={pickedProduct ? false : true}
          onClick={(e) => handleAddProduct(e, delivDate, custName)}
        >
          ADD +
        </Button>
        <label>Product</label>
        <Dropdown
          optionLabel="prodName"
          options={products}
          placeholder={pickedProduct}
          name="products"
          value={pickedProduct}
          onChange={(e) => setPickedProduct(e.target.value.prodName)}
        />
        <label>Quantity</label>
        <InputNumber
          id="addQty"
          placeholder={pickedQty}
          value={pickedQty}
          size="4"
          onKeyDown={(e) => e.code === "Enter" && setPickedQty(e.target.value)}
          onBlur={(e) => setPickedQty(e.target.value)}
        />
        <label>Rate</label>
        <InputNumber
          id="addRate"
          placeholder={pickedRate}
          value={pickedRate}
          size="4"
          mode="decimal"
          locale="en-US"
          minFractionDigits={2}
          onKeyDown={(e) => e.code === "Enter" && setPickedRate(e.target.value)}
          onBlur={(e) => setPickedRate(e.target.value)}
        />
      </FooterGrid>
      <FooterGrid>
        <div></div>
        <div></div>
        <div>Grand Total</div>
        <div>{sum}</div>
        <Button
          className={needToSave ? "p-button-danger" : ""}
          disabled={needToSave ? false : true}
          onClick={saveWeeklyOrder}
        >
          SAVE ORDER
        </Button>
      </FooterGrid>
    </React.Fragment>
  );
};
