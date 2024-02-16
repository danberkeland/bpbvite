import React, { useEffect, useContext, useState } from "react";

import styled from "styled-components";

import BillingGrid from "./Parts/BillingGrid";
import SelectDate from "./Parts/SelectDate";

import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { useLegacyFormatDatabase } from "../../data/legacyData";
import { API, graphqlOperation } from "aws-amplify";
import { listZones } from "../../graphql/queries";
import { sortAtoZDataByIndex } from "../../helpers/sortDataHelpers";
import { DT } from "../../utils/dateTimeFns";

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
  const [delivDate, setDelivDate] = useState(DT.today().toFormat('yyyy-MM-dd'))


  
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const ordersHasBeenChanged = useSettingsStore(
    (state) => state.ordersHasBeenChanged
  );
  const setOrdersHasBeenChanged = useSettingsStore(
    (state) => state.setOrdersHasBeenChanged
  );
  const { data: database } = useLegacyFormatDatabase();


  
  useEffect(() => {
    setIsLoading(true);
    fetchZones()
  }, []);

  const fetchZones = async () => {
    try {
      const zoneData = await API.graphql(
        graphqlOperation(listZones, {
          limit: "50",
        })
      );
      const zoneList = zoneData.data.listZones.items;
      sortAtoZDataByIndex(zoneList, "zoneNick");
      let noDelete = zoneList.filter((zone) => zone["_deleted"] !== true);

      setZones(noDelete);
      setIsLoading(false);
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };
  

  return (
    <React.Fragment>
      <BasicContainer>
        <h1>Billing</h1>
      </BasicContainer>

      <BasicContainer>
        <SelectDate
          database={database}
          dailyInvoices={dailyInvoices}
          delivDate={delivDate}
          setDelivDate={setDelivDate}
          // nextInv={nextInv}
          // setNextInv={setNextInv}
          // setDailyInvoices={setDailyInvoices}
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
          delivDate={delivDate}
        />
      </BasicContainer>
    </React.Fragment>
  );
}

export default Billing;
