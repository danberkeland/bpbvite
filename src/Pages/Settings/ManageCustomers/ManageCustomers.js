import React, { useState } from "react";

import CustomerList from "./CustomerList";
import CustomerDetails from "./CustomerDetails";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";

function ManageCustomers() {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const setIsEdit = useSettingsStore((state) => state.setIsEdit);

  const handleCustClick = () => {
    setIsEdit(false)
    setSelectedCustomer("");
  };


  return (
    <React.Fragment>
      {selectedCustomer === "" ? (
        <CustomerList
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      ) : (
        <React.Fragment>
          <button onClick={handleCustClick}>CUSTOMER LIST</button>
          <CustomerDetails
            initialState={selectedCustomer}
            activeIndex={activeIndex}
            selectedCustomer={selectedCustomer}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default ManageCustomers;
