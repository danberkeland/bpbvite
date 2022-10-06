import React from "react";

import { Form, Formik } from "formik";

import { motion } from "framer-motion";
import {
  CustomIDInput,
  CustomInput,
  CustomFloatInput,
  CustomIntInput,
} from "../../FormComponents/CustomIDInput";
import { validationSchema } from "./ValidationSchema";

function EditProduct({ initialState, create }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: "0", y: "0" }}
      animate={{ opacity: 1, x: "0", y:"0" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      exit={{ opacity: 0, x: "0" }}
    >
      <Formik initialValues={initialState} validationSchema={validationSchema}>
        {(props) => (
          <Form>
            <CustomIDInput
              label="Product ID"
              name="prodNick"
              type="text"
              disabled={!create}
              placeholder="Enter product ID"
            />
            <CustomInput
              label="Product Name"
              name="prodName"
              type="text"
              placeholder="Enter product name"
            />
            <CustomFloatInput
              label="Wholesale Price"
              name="wholePrice"
              type="tel"
              converter={props}
            />
            <CustomIntInput
              label="Pack Size"
              name="packSize"
              type="tel"
              converter={props}
            />
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}

export default EditProduct;
