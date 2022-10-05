import React, { useRef } from "react";

import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import { DataScroll } from "./OrderingParts/DataScroller";
import { Cal } from "./OrderingParts/Calendar";
import { AddProduct } from "./OrderingParts/AddProduct";
import { Fulfill } from "./OrderingParts/FullfillOptions";

import styled from "styled-components";
import { useSettingsStore } from "../../Contexts/SettingsZustand";

import { useLocationList, useSimpleLocationList } from "../../hooks";

const BasicContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  border: 1px solid lightgray;
  padding: 10px 10px;
  margin: 10px auto 10px auto;
  box-sizing: border-box;
`;

const OrderButtonsFloat = styled.div`
  display: flex;
  position: fixed;
  z-index: 100;
  top: 100px;
  justify-content: space-around;
  width: 100%;
  margin: 5px 0;
`;

const PONote = () => {
  const ponote = useSettingsStore((state) => state.ponote);
  const setPonote = useSettingsStore((state) => state.setPonote);
  const setIsModified = useSettingsStore((state) => state.setIsModified);

  const handlePonote = (val, setPonote, setIsModified) => {
    setPonote(val);
    setIsModified(true);
  };

  return (
    <React.Fragment>
      <InputText
        value={ponote}
        onChange={(e) => handlePonote(e.target.value, setPonote, setIsModified)}
        placeholder="PO#/Special Instructions..."
      />
    </React.Fragment>
  );
};

const AddProdMod = ({ op }) => {
  const isModified = useSettingsStore((state) => state.isModified);

  return (
    <React.Fragment>
      <AddProduct op={op} />
      <OrderButtonsFloat>
        {isModified && <Submit />}
        <label htmlFor="addProd" hidden>
          addProd
        </label>
        <Button
          type="button"
          id="addProd"
          icon="pi pi-plus"
          onClick={(e) => op.current.toggle(e)}
          className="p-button-rounded"
        />
      </OrderButtonsFloat>
    </React.Fragment>
  );
};

const Submit = () => {
  return (
    <React.Fragment>
      <div>
        <Button
          label="SUBMIT ORDER"
          className="p-button-raised p-button-rounded p-button-danger"
          onClick={(e) => {}}
        />
      </div>
    </React.Fragment>
  );
};

const CustList = () => {
  const chosen = useSettingsStore((state) => state.chosen);
  const setChosen = useSettingsStore((state) => state.setChosen);
  const setIsModified = useSettingsStore((state) => state.setIsModified);

  const { locationList } = useLocationList();
  const { simpleLocationList } = useSimpleLocationList();

  const handleChosen = (e) => {
    let ind = locationList.data.findIndex((loc) => loc.locNick === e.value);
    setChosen(locationList.data[ind]);
  };

  return (
    <Dropdown
      value={chosen.locNick}
      name="custDropDown"
      options={simpleLocationList.data}
      onChange={(e) => {
        setIsModified(false);
        handleChosen(e);
      }}
      placeholder="Select a Customer"
    />
  );
};

export const Ordering = () => {
  const op = useRef(null);

  return (
    <React.Fragment>
      <AddProdMod op={op} />
      <BasicContainer>
        <CustList />
        <Cal />
        <Fulfill />
        <PONote />
      </BasicContainer>
      <DataScroll />
    </React.Fragment>
  );
};

export default Ordering;
