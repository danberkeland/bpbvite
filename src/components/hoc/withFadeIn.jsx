import React from "react";

import { motion } from "framer-motion";

export const withFadeIn = (Component) => (props) => {
    return (
      <motion.div
        initial={{ opacity: 0, x: "0", y: "0" }}
        animate={{ opacity: 1, x: "0" }}
        transition={{ duration: 0.3, ease: "easeInOut"}}
        exit={{ opacity: 0, x: "0" }}
      >
        <Component {...props} />
      </motion.div>
    );
  };
  