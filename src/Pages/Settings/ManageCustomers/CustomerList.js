import React, { useState } from "react";

import { FilterMatchMode } from "primereact/api";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TabMenu } from "primereact/tabmenu";
import { useCustomerList } from "../../../swr";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";
import { withFadeIn } from "../../../hoc/withFadeIn";

import CustomerDetails from "./CustomerDetails";
const initialState = {
  custName: "",
  authClass: "",
  email: "",
  username: "",
  phone: "",
  sub: "",
  defLoc: "",
  locName: "",
  locNick: "",
  locations: [],
  customers: [],
};

const menuItems = [{ label: "By Customer" }, { label: "By Location" }];

function CustomerList({
  selectedCustomer,
  setSelectedCustomer,
  activeIndex,
  setActiveIndex,
}) {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const setIsCreate = useSettingsStore((state) => state.setIsCreate);
  const isCreate = useSettingsStore((state) => state.isCreate);

  const [filter] = useState({
    custName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const { customerList } = useCustomerList();

  console.log('rendering CustomerList', customerList)
  const handleClick = () => {
    setIsCreate(!isCreate);
  };


  const decideList = () => {
    console.log("activeIndex", activeIndex);
    let newArray = [];
    let filtArray = [];
    let filtTab = activeIndex === 0 ? "custName" : "locName";
    for (let li of customerList.data) {
      if (!filtArray.includes(li[filtTab])) {
        newArray.push(li);
        filtArray.push(li[filtTab]);
      }
    }
    return newArray;
  };

  const CustomerDataTable = () => {
   return(
      <DataTable
        className="dataTable"
        value={decideList()}
        selectionMode="single"
        metaKeySelection={false}
        selection={selectedCustomer}
        onSelectionChange={(e) => setSelectedCustomer(e.value)}
        sortField="custName"
        sortOrder={1}
        responsiveLayout="scroll"
        filterDisplay="row"
        filters={filter}
      >
        {activeIndex === 0 && (
          <Column
            field="custName"
            header="Customer"
            filterPlaceholder="cust"
            filter
            sortable
          />
        )}
        {activeIndex === 1 && (
          <Column
            field="locName"
            header="Location"
            filterPlaceholder="loc"
            filter
            sortable
          />
        )}
      </DataTable>
    );
  }

  return (
    <React.Fragment>
      {isCreate ? (
        <React.Fragment>
          <button onClick={handleClick}>+ CUSTOMER LIST</button>
          <CustomerDetails initialState={initialState} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <button onClick={handleClick}>+ CREATE CUSTOMER</button>
          <TabMenu
            model={menuItems}
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          />
          {customerList.isLoading ? setIsLoading(true) : setIsLoading(false)}

          {customerList.isError && <div>Table Failed to load</div>}
          {customerList.data && <CustomerDataTable />}
          <div className="bottomSpace"></div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default CustomerList;
