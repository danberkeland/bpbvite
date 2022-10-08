import React, { useState, useEffect } from "react";

import { FilterMatchMode } from "primereact/api";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { TabMenu } from "primereact/tabmenu";

import CreateCustomer from "./EditCustomer";
import { motion } from "framer-motion";
import { useCustomerList } from "../../../hooks";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";

const submitButtonStyle = {
  width: "100px",
  margin: "20px",
  fontSize: "1.2em",
  backgroundColor: "red",
};

const initialState = {
  prodNick: "",
  prodName: "",
  wholePrice: null,
  packSize: 1,
};

const menuItems = [{ label: "By Customer" }, { label: "By Location" }];

function CustomerList({ selectedCustomer, setSelectedCustomer }) {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const [filter] = useState({
    custName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [isCreate, setIsCreate] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { customerList } = useCustomerList();

  useEffect(() => {
    console.log("customerList", customerList);
  }, [customerList]);

  const handleClick = () => {
    setIsCreate(!isCreate);
  };

  const handleSubmit = () => {
    setIsCreate(!isCreate);
  };


  return (
    <React.Fragment>
      {!isCreate ? (
        <React.Fragment>
          <button onClick={handleClick}>+ CREATE CUSTOMER</button>
          <TabMenu
            model={menuItems}
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          />
          {customerList.isLoading ? setIsLoading(true) : setIsLoading(false)}

          {customerList.isError && <div>Table Failed to load</div>}
          {customerList.data && (
            <motion.div
              initial={{ opacity: 0, x: "0", y: "0" }}
              animate={{ opacity: 1, x: "0" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              exit={{ opacity: 0, x: "0" }}
            >
              <DataTable
                className="dataTable"
                value={customerList.data}
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
                    field="locNick"
                    header="Location"
                    filterPlaceholder="loc"
                    filter
                    sortable
                  />
                )}
              </DataTable>
            </motion.div>
          )}
          <div className="bottomSpace"></div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="submitButton">
            <Button
              label="Submit"
              className="p-button-raised p-button-rounded"
              style={submitButtonStyle}
              onClick={handleSubmit}
            />
          </div>
          <button onClick={handleClick}>+ CUSTOMER LIST</button>
          <CreateCustomer initialState={initialState} create={true} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default CustomerList;
