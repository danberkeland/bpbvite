import React, { useState } from "react";

import CustomerList from "./CustomerList";
import CustomerDetails from "./CustomerDetails";
import { motion } from "framer-motion";

function ManageCustomers() {
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const handleCustClick = () => {
    setSelectedCustomer("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y:0 }}
      exit={{ opacity: 0 }}
    >
      {selectedCustomer !== "" ? (
        <React.Fragment>
          <button onClick={handleCustClick}>CUSTOMER LIST</button>
          <CustomerDetails selectedCustomer={selectedCustomer} />
        </React.Fragment>
      ) : (
        <div></div>
      )}
      {selectedCustomer === "" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y:0 }}
          exit={{ opacity: 0 }}
        >
          <CustomerList
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
          />
        </motion.div>
      ) : (
        <div></div>
      )}
    </motion.div>
  );
}

export default ManageCustomers;
