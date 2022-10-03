import React from "react";
import moment from "moment";

import { InputNumber } from "primereact/inputnumber";
import { DataScroller } from "primereact/datascroller";
import { Button } from "primereact/button";
import { confirmPopup } from "primereact/confirmpopup";

import styled from "styled-components";

import { useSettingsStore } from "../../../Contexts/SettingsZustand";
import { useEffect } from "react";
import { getOrder } from "../../../restAPIs";

const ProductTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-size: 1.3em;
  padding: 0;
  margin 0;
  color: rgb(36, 31, 31);
`;

const ProductTotal = styled.h3`
  font-family: "Montserrat", sans-serif;
  font-size: 1.3em;
  padding: 0;
  margin 0;
  color: rgb(36, 31, 31);
`;

const BigBottom = styled.div`
  height: 200px;
`

const BasicContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  border: 1px solid lightgray;
  padding: 10px 10px;
  margin: 10px auto 10px auto;
  box-sizing: border-box;
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  margin: 2px 0px;
  align-items: center;
`;

const AlignRight = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-items: right;
`;

export const DataScroll = ({ checked }) => {
  const ponote = useSettingsStore((state) => state.ponote);
  const setIsModified = useSettingsStore((state) => state.setIsModified);
  const setCurrentOrder = useSettingsStore((state) => state.setCurrentOrder);
  const currentOrder = useSettingsStore((state) => state.currentOrder);
  const chosen = useSettingsStore((state) => state.chosen);
  const delivDate = useSettingsStore((state) => state.delivDate);
  const route = useSettingsStore((state) => state.route);
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  useEffect(() => {

    
    let finalDate = moment(delivDate).format('L')
    let dayOfWeek = moment(delivDate).format('ddd')

    let event = {
      "locNick": chosen ? chosen.locNick : "",
      "delivDate": finalDate,
      "dayOfWeek": dayOfWeek
    };
    setIsLoading(true);
    getOrder(event).then((result) => {
      setCurrentOrder(result);
      setIsLoading(false);
    });
  }, [setIsLoading, setCurrentOrder, chosen, delivDate]);

  let curr = {
    curr: currentOrder,
    chosen: chosen,
    delivDate: delivDate,
    route: route,
    ponote: ponote,
  };

  const makeChange = (e, simpleItem) => {
    // Is this a late order?  If YES, handle it ...

    if (e === 0) {
      confirmPopup({
        message: "Are you sure you want to delete this item?",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          setIsModified(true);
          let newOrder = addOrder(curr, simpleItem, e);
          setCurrentOrder(newOrder);
        },
        reject: () => {
          return;
        },
      });
    } else {
      setIsModified(true);
      let newOrder = addOrder(curr, simpleItem, e);
      setCurrentOrder(newOrder);
    }
  };

  const addOrder = (curr, simpleItem, e) => {};

  const makeLateChange = (e, simpleItem) => {
    setIsModified(true);
    let newOrder = addLateOrder(curr, simpleItem, e);
    setCurrentOrder(newOrder);
  };

  const addLateOrder = (curr, simpleItem, e) => {};

  const Quantity = (item) => {
    let simpleItem = item.prodName;

    return (
      <InputNumber
        name="changeQty"
        key={simpleItem}
        value={item.qty}
        size={3}
        buttonLayout="horizontal"
        onValueChange={(e) => makeChange(e.value, simpleItem)}
      />
    );
  };

  const LateQuantity = (item) => {
    let simpleItem = item.prodName;

    return (
      <React.Fragment>
        {checked ? (
          <InputNumber
            name="changeQty"
            key={simpleItem}
            value={Number(item.isLate)}
            size={3}
            min={0}
            max={item.qty}
            buttonLayout="horizontal"
            onValueChange={(e) => makeLateChange(e.value, simpleItem)}
          />
        ) : (
          <div>{Number(item.isLate)}</div>
        )}
      </React.Fragment>
    );
  };

  const Previous = (item) => {
    return <React.Fragment>PREV</React.Fragment>;
  };

  const Rate = (item) => {
    return <div>${item.rate.toFixed(2)}/ea.</div>;
  };

  const TrashCan = (item) => {
    let simpleItem = item.prodName;

    return (
      <AlignRight>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-help p-button-outlined"
          onClick={(e) => makeChange(0, simpleItem)}
        />
      </AlignRight>
    );
  };

  const itemTemplate = (item) => {
    return (
      <React.Fragment>
        <BasicContainer>
          <TwoColumn>
            <div style={{ textAlign: "left" }}>
              <ProductTitle>{item.prod}</ProductTitle>
              <Rate {...item} />
            </div>
            <TrashCan {...item} />
          </TwoColumn>
          <TwoColumn>
            <Quantity {...item} />
            <Previous {...item} />
            <ProductTotal name="productTotal">
              ${(item.rate * item.qty).toFixed(2)}
            </ProductTotal>
          </TwoColumn>
          {(checked || Number(item.isLate) > 0) && (
            <TwoColumn>
              <LateQuantity {...item} />
              {`OF ${item.qty} ARE LATE ORDERED`}
              <ProductTotal name="productTotal">
                ${(item.rate * Number(item.isLate) * 0.25).toFixed(2)}
              </ProductTotal>
            </TwoColumn>
          )}
        </BasicContainer>
      </React.Fragment>
    );
  };

  return (
    <div>
      
    <DataScroller
      value={!currentOrder.errors && currentOrder.filter((curr) => curr.qty !== 0)}
      itemTemplate={(item) => itemTemplate(item)}
      rows={currentOrder.length}
      inline
    ></DataScroller>
    <BigBottom />
  
    </div>
  );
};
