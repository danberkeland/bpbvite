import React, { useState } from "react";

import CustomerList from "./CustomerList";
import CustomerDetails from "./CustomerDetails";
import { withFadeIn } from "../../../hoc/withFadeIn";

function ManageCustomers() {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCustClick = () => {
    setSelectedCustomer("");
  };

  const FadeCustomerList = withFadeIn(() => {
    return (
      <CustomerList
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    );
  });

  return (
    <React.Fragment>
      {selectedCustomer === "" ? (
        <FadeCustomerList />
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
