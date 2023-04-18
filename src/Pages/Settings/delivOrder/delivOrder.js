import React, { useState, useContext, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { updateLocation } from "../../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";
import { useLegacyFormatDatabase } from "../../../data/legacyData";
import { sortAtoZDataByIndex } from "../../../helpers/sortDataHelpers";

const DelivOrder = () => {
  

  const [customerList, setCustomerList] = useState();
  
  
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const ordersHasBeenChanged = useSettingsStore(
    (state) => state.ordersHasBeenChanged
  );
  const setOrdersHasBeenChanged = useSettingsStore(
    (state) => state.setOrdersHasBeenChanged
  );
  const { data: database } = useLegacyFormatDatabase();
  
  const [products = [], customers = [], routes = [], standing = [], orders = []] = database || [];
 


  useEffect(() => {
    let custFilt;
    custFilt = customers.filter(
      (cust) =>
        cust.zoneName !== "slopick" &&
        cust.zoneName !== "atownpick" &&
        cust.zoneName !== "Prado Retail" &&
        cust.zoneName !== "Carlton Retail"
    );
    sortAtoZDataByIndex(custFilt,"delivOrder")
    setCustomerList(custFilt);
  }, [customers]);

  

  const columns = [
    { field: "custName", header: "Customer" },
    { field: "zoneName", header: "Zone" },
    { field: "addr1", header: "Address" },
    { field: "city", header: "City" },
  ];

  

  const onRowReorder = (e) => {
    setCustomerList(e.value);
    setOrdersHasBeenChanged(true);
  };

  const updateDeliveryOrder = async () => {
    setIsLoading(true)
    let ind = 0;
    for (let cust of customerList) {
      ind=ind+1
      const updateDetails = {
        id: cust.id,
        delivOrder: ind,
      };

      try {
        await API.graphql(
          graphqlOperation(updateLocation, { input: { ...updateDetails } })
        );
        
      } catch (error) {
        console.log("error on creating Orders", error);
        setIsLoading(false);
      }
    
    }
    setIsLoading(false)
    setOrdersHasBeenChanged(false);
  };

  return (
    <React.Fragment>
     
      <Button
        label="Update Delivery Order"
        icon="pi pi-plus"
        onClick={updateDeliveryOrder}
        className={
            ordersHasBeenChanged
            ? "p-button-raised p-button-rounded p-button-danger"
            : "p-button-raised p-button-rounded p-button-success"
        }
      />
      <div>
        <div className="card">
          <DataTable value={customerList} onRowReorder={onRowReorder}>
            <Column rowReorder style={{ width: "3em" }} />

            <Column field="custName" header="customer"></Column>
            <Column field="zoneName" header="Zone"></Column>
            <Column field="addr1" header="Address"></Column>
            <Column field="city" header="City"></Column>
          </DataTable>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DelivOrder;
