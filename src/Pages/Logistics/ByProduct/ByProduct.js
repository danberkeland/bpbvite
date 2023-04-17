import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";

import ProductGrid from "../ByProduct/Parts/ProductGrid";
import ToolBar from "../ByProduct/Parts/ToolBar";
import { todayPlus } from "../../../helpers/dateTimeHelpers";

import ComposeProductGrid from "../ByRoute/Parts/utils/composeProductGrid"
import { useSettingsStore } from "../../../Contexts/SettingsZustand";
import { useLegacyFormatDatabase } from "../../../data/legacyData";

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  height: 100vh;
`;

const DescripWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  width: 95%;
  margin: 10px auto;
  flex-direction: column;
  justify-items: start;
  align-content: flex-start;

  //background: #ffffff;
`;

const compose = new ComposeProductGrid();

function ByProduct() {
  const [delivDate, setDelivDate] = useState(todayPlus()[0]);
  const [orderList, setOrderList] = useState();
  const [database, setDatabase] = useState();

  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const { data: db } = useLegacyFormatDatabase();

  useEffect(() => {
    try {
      gatherProdGridInfo(db);
      console.log("database", db);
    } catch {}
  }, [delivDate, db]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherProdGridInfo = (data) => {
    let prodGridData = compose.returnProdGrid(data, delivDate);
    setDatabase(data);

    setOrderList(prodGridData.prodGrid);
  };

  return (
    <React.Fragment>
      <MainWrapper>
        <DescripWrapper>
          <ToolBar delivDate={delivDate} setDelivDate={setDelivDate} />
          <ProductGrid
            orderList={orderList}
            database={database}
            delivDate={delivDate}
          />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}

export default ByProduct;
