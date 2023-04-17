import React, { useEffect, useContext, useState } from "react";

import styled from "styled-components";

import BillingGrid from "./Parts/BillingGrid";
import SelectDate from "./Parts/SelectDate";

// import { fetchZones } from "../helpers/databaseFetchers";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { useLegacyFormatDatabase } from "../../data/legacyData";

const BasicContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  border: 1px solid hsl(37, 100%, 30%);
  padding: 5px 10px;
  margin: 0px auto;
  box-sizing: border-box;
`;

const printButtonStyle = {
  backgroundColor: "hsl(97.26, 51.67%, 40%)",
  border: "solid 1px hsl(97.26, 51.67%, 35%)",
  fontSize: "1.25rem",
}

function Billing() {
 
  const [nextInv, setNextInv] = useState(0);
  const [dailyInvoices, setDailyInvoices] = useState([]);
  const [zones, setZones] = useState([]);

  
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const ordersHasBeenChanged = useSettingsStore(
    (state) => state.ordersHasBeenChanged
  );
  const setOrdersHasBeenChanged = useSettingsStore(
    (state) => state.setOrdersHasBeenChanged
  );
  const { data: database } = useLegacyFormatDatabase();


  /*
  useEffect(() => {
    setIsLoading(true);
    fetchZones().then((getZones) => setZones(getZones));
  }, []);
  */

  return (
    <React.Fragment>
      <BasicContainer>
        <h1>Billing</h1>
      </BasicContainer>

      <BasicContainer>
        <SelectDate
          database={database}
          nextInv={nextInv}
          setNextInv={setNextInv}
          dailyInvoices={dailyInvoices}
          setDailyInvoices={setDailyInvoices}
        />
      </BasicContainer>

      <BasicContainer>
        <h2>Daily Invoicing</h2>
        <BillingGrid
          database={database}
          nextInv={nextInv}
          dailyInvoices={dailyInvoices}
          setDailyInvoices={setDailyInvoices}
          zones={zones}
        />
      </BasicContainer>
    </React.Fragment>
  );
}

export default Billing;
