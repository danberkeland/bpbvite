import React from "react";

import { Form, Formik } from "formik";

import { motion } from "framer-motion";
import { CustomInput } from "../../../FormComponents/CustomIDInput";
import { validationSchema } from "./ValidationSchema";

function EditCustomer({ initialState, create }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: "0", y: "0" }}
      animate={{ opacity: 1, x: "0", y: "0" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      exit={{ opacity: 0, x: "0" }}
    >
      <Formik initialValues={initialState} validationSchema={validationSchema}>
        {(props) => (
          <Form>
            <CustomInput
              label="Customer Name"
              name="custName"
              type="text"
              disabled={!create}
              placeholder="Enter customer name"
            />

            <CustomInput
              label="Auth Type"
              name="authType"
              type="text"
              disabled={!create}
              placeholder="Enter auth type"
            />
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}

export default EditCustomer;
