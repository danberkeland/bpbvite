import React from "react";
import "../../index.css";
import { motion } from "framer-motion";

function CustomerNews() {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, x: "0", y: "0" }}
        animate={{ opacity: .8, x: "0" }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        exit={{ opacity: 0, x: "0" }}
        className="photoBox"
      >
        <img src="/bpblogo.jpg" alt="Back Porch Bakery Logo" width="100%" />
      </motion.div>
    </React.Fragment>
  );
}

export default CustomerNews;
